import { MetadataRoute } from "next";
import { getAllPostsForSitemap, getAllPagesForSitemap } from "@/lib/wordpress";
import { getAllProfiles } from "@/lib/profile";
import { siteConfig } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: any[] = [];
  let pages: any[] = [];
  let profiles: any[] = [];

  try {
    const results = await Promise.allSettled([
      getAllPostsForSitemap(),
      getAllPagesForSitemap(),
      getAllProfiles(),
    ]);

    if (results[0].status === 'fulfilled') posts = results[0].value;
    if (results[1].status === 'fulfilled') pages = results[1].value;
    if (results[2].status === 'fulfilled') profiles = results[2].value;
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.site_domain}/pages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/categories`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/tags`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const profileUrls: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${siteConfig.site_domain}/${profile.username}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/posts/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const pageUrls: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteConfig.site_domain}/pages/${page.slug}`,
    lastModified: new Date(page.modified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...profileUrls, ...postUrls, ...pageUrls];
}
