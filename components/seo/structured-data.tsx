import { siteConfig } from "@/site.config";

export function WebsiteStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.site_name,
    "description": siteConfig.site_description,
    "url": siteConfig.site_domain,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  url: string;
}

export function ArticleStructuredData({
  title,
  description,
  authorName,
  datePublished,
  dateModified,
  image,
  url,
}: ArticleStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "image": image,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.site_name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.site_domain}/profolio.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
