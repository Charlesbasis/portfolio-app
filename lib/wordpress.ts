// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
  Project,
  Experience,
  Skill,
} from "./wordpress.d";

// Single source of truth for WordPress configuration
const baseUrl = process.env.WORDPRESS_URL?.replace(/\/+$/, "");
const postBaseUrl = (process.env.WORDPRESS_POST_URL || process.env.WORDPRESS_URL)?.replace(/\/+$/, "");
const isConfigured = Boolean(baseUrl);

if (!isConfigured) {
  console.warn(
    "WORDPRESS_URL environment variable is not defined - WordPress features will be unavailable"
  );
}

class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Pagination types
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

const WP_AUTH = process.env.WP_USER && process.env.WP_APPLICATION_PASSWORD
  ? Buffer.from(`${process.env.WP_USER}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64")
  : null;

const USER_AGENT = "Next.js WordPress Client";
const CACHE_TTL = 3600; // 1 hour

// Core fetch - throws on error (for functions that require data)
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  const isPostRelated = path.includes("/wp/v2/posts") ||
    path.includes("/wp/v2/media") ||
    path.includes("/wp/v2/categories") ||
    path.includes("/wp/v2/tags") ||
    path.includes("/wp/v2/users");

  const currentBaseUrl = isPostRelated ? postBaseUrl : baseUrl;

  if (!currentBaseUrl) {
    throw new Error("WordPress URL not configured");
  }

  // Only strip /wp-json if we are using the rest_route bypass URL
  const isBypass = currentBaseUrl.includes("rest_route");
  const sanitizedPath = isBypass ? path.replace(/^\/wp-json/, "") : path;
  const url = `${currentBaseUrl}${sanitizedPath}${query ? `${isBypass ? "&" : "?"}${querystring.stringify(query)}` : ""}`;

  const headers: Record<string, string> = { "User-Agent": USER_AGENT };
  if (WP_AUTH) {
    headers["Authorization"] = `Basic ${WP_AUTH}`;
  }

  const response = await fetch(url, {
    headers,
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    // Log the error but consider if you want to throw during BUILD phase
    console.error(`WP API Error [${response.status}] at ${path}`);
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// Graceful fetch - returns fallback when WordPress unavailable or on error
async function wordpressFetchGraceful<T>(
  path: string,
  fallback: T,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!isConfigured) return fallback;

  try {
    return await wordpressFetch<T>(path, query, tags);
  } catch {
    console.warn(`WordPress fetch failed for ${path}`);
    return fallback;
  }
}

// Paginated fetch - returns response with headers
async function wordpressFetchPaginated<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  const isPostRelated = path.includes("/wp/v2/posts") ||
    path.includes("/wp/v2/media") ||
    path.includes("/wp/v2/categories") ||
    path.includes("/wp/v2/tags") ||
    path.includes("/wp/v2/users");

  const currentBaseUrl = isPostRelated ? postBaseUrl : baseUrl;

  if (!currentBaseUrl) {
    throw new Error("WordPress URL not configured");
  }

  // Only strip /wp-json if we are using the rest_route bypass URL
  const isBypass = currentBaseUrl.includes("rest_route");
  const sanitizedPath = isBypass ? path.replace(/^\/wp-json/, "") : path;
  const url = `${currentBaseUrl}${sanitizedPath}${query ? `${isBypass ? "&" : "?"}${querystring.stringify(query)}` : ""}`;

  const headers: Record<string, string> = { "User-Agent": USER_AGENT };
  if (WP_AUTH) {
    headers["Authorization"] = `Basic ${WP_AUTH}`;
  }

  const response = await fetch(url, {
    headers,
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return {
    data: await response.json(),
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// Graceful paginated fetch - returns empty response when unavailable
async function wordpressFetchPaginatedGraceful<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T[]>> {
  const emptyResponse: WordPressResponse<T[]> = {
    data: [],
    headers: { total: 0, totalPages: 0 },
  };

  if (!isConfigured) return emptyResponse;

  try {
    return await wordpressFetchPaginated<T[]>(path, query, tags);
  } catch {
    console.warn(`WordPress paginated fetch failed for ${path}`);
    return emptyResponse;
  }
}

// Paginated posts with filter support
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts", `posts-page-${page}`];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  return wordpressFetchPaginatedGraceful<Post>(
    "/wp-json/wp/v2/posts",
    query,
    cacheTags
  );
}

/**
 * Fetches recent posts (up to 100). For paginated access use getPostsPaginated().
 * For fetching ALL posts (e.g., sitemap), use getAllPostsForSitemap().
 */
export async function getRecentPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) query.search = filterParams.search;
  if (filterParams?.author) query.author = filterParams.author;
  if (filterParams?.tag) query.tags = filterParams.tag;
  if (filterParams?.category) query.categories = filterParams.category;

  return wordpressFetchGraceful<Post[]>("/wp-json/wp/v2/posts", [], query, [
    "wordpress",
    "posts",
  ]);
}

export async function getPostById(id: number): Promise<Post | null> {
  return wordpressFetchGraceful<Post | null>(`/wp-json/wp/v2/posts/${id}`, null);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/posts",
    [],
    { slug }
  );
  return posts[0];
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { per_page: 100 },
    ["wordpress", "categories"]
  );
}

export async function getCategoryById(id: number): Promise<Category | null> {
  return wordpressFetchGraceful<Category | null>(`/wp-json/wp/v2/categories/${id}`, null);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return wordpressFetchGraceful<Category[] | null>("/wp-json/wp/v2/categories", null, { slug }).then(
    (categories) => categories ? categories[0] : null
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>(
    "/wp-json/wp/v2/tags",
    [],
    { per_page: 100 },
    ["wordpress", "tags"]
  );
}

export async function getTagById(id: number): Promise<Tag | null> {
  return wordpressFetchGraceful<Tag | null>(`/wp-json/wp/v2/tags/${id}`, null);
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return wordpressFetchGraceful<Tag[] | null>("/wp-json/wp/v2/tags", null, { slug }).then(
    (tags) => tags ? tags[0] : null
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { per_page: 100 },
    ["wordpress", "pages"]
  );
}

export async function getPageById(id: number): Promise<Page | null> {
  return wordpressFetchGraceful<Page | null>(`/wp-json/wp/v2/pages/${id}`, null);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { slug }
  );
  return pages[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>(
    "/wp-json/wp/v2/users",
    [],
    { per_page: 100 },
    ["wordpress", "authors"]
  );
}

export async function getAuthorById(id: number): Promise<Author | null> {
  return wordpressFetchGraceful<Author | null>(`/wp-json/wp/v2/users/${id}`, null);
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  return wordpressFetchGraceful<Author[] | null>("/wp-json/wp/v2/users", null, { slug }).then(
    (users) => users ? users[0] : null
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  if (!author) return [];
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  if (!tag) return [];
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia | null> {
  return wordpressFetchGraceful<FeaturedMedia | null>(`/wp-json/wp/v2/media/${id}`, null);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { search: query, per_page: 100 }
  );
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>("/wp-json/wp/v2/tags", [], {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>("/wp-json/wp/v2/users", [], {
    search: query,
    per_page: 100,
  });
}

// Fetches ALL post slugs for generateStaticParams
// Returns empty array if WordPress is unavailable (allows build to succeed)
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isConfigured) return [];

  try {
    const allSlugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug" }
      );

      allSlugs.push(...response.data.map((post) => ({ slug: post.slug })));
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allSlugs;
  } catch {
    console.warn("WordPress unavailable, skipping static generation for posts");
    return [];
  }
}

// Fetches ALL posts for sitemap generation (paginates through all pages)
// Returns slug and modified date for each post
export async function getAllPostsForSitemap(): Promise<
  { slug: string; modified: string }[]
> {
  if (!isConfigured) return [];

  try {
    const allPosts: { slug: string; modified: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug,modified" }
      );

      allPosts.push(
        ...response.data.map((post) => ({
          slug: post.slug,
          modified: post.modified,
        }))
      );
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allPosts;
  } catch {
    console.warn("WordPress unavailable, skipping sitemap generation");
    return [];
  }
}

// Fetches ALL pages for sitemap generation (paginates through all pages)
// Returns slug and modified date for each page
export async function getAllPagesForSitemap(): Promise<
  { slug: string; modified: string }[]
> {
  if (!isConfigured) return [];

  try {
    const allPages: { slug: string; modified: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Page[]>(
        "/wp-json/wp/v2/pages",
        { per_page: 100, page, _fields: "slug,modified" }
      );

      allPages.push(
        ...response.data.map((page) => ({
          slug: page.slug,
          modified: page.modified,
        }))
      );
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allPages;
  } catch {
    console.warn("WordPress unavailable, skipping sitemap generation for pages");
    return [];
  }
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  });
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  });
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  });
}

/**
 * Projects CPT functions
 */
export async function getAllProjects(): Promise<Project[]> {
  return wordpressFetchGraceful<Project[]>(
    "/wp-json/wp/v2/projects",
    [],
    { _embed: true, per_page: 100 },
    ["wordpress", "projects"]
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await wordpressFetchGraceful<Project[]>(
    "/wp-json/wp/v2/projects",
    [],
    { slug, _embed: true }
  );
  return projects[0];
}

/**
 * Experiences CPT functions
 */
export async function getAllExperiences(): Promise<Experience[]> {
  return wordpressFetchGraceful<Experience[]>(
    "/wp-json/wp/v2/experiences",
    [],
    { _embed: true, per_page: 100, orderby: "date", order: "desc" },
    ["wordpress", "experiences"]
  );
}

/**
 * Skills Taxonomy functions
 */
export async function getAllSkills(): Promise<Skill[]> {
  return wordpressFetchGraceful<Skill[]>(
    "/wp-json/wp/v2/skills",
    [],
    { per_page: 100 },
    ["wordpress", "skills"]
  );
}

/**
 * Profile functions
 */
export async function getProfile(): Promise<Author | undefined> {
  // Assuming the main profile is the first user or a specific slug
  const authors = await getAllAuthors();
  return authors[0];
}

export { WordPressAPIError };
