import type { NextConfig } from "next";

const getHostname = (url: string | undefined) => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
};

const hostnames = Array.from(new Set([
  getHostname(process.env.WORDPRESS_URL),
  getHostname(process.env.WORDPRESS_POST_URL),
  process.env.WORDPRESS_HOSTNAME
].filter(Boolean) as string[]));

const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  // output: "standalone",
  serverExternalPackages: ["mysql2"],
  images: {
    remotePatterns: hostnames.flatMap(hostname => [
      {
        protocol: "https",
        hostname,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname,
        port: "",
        pathname: "/**",
      },
    ]),
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;