import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  // output: "standalone",
  serverExternalPackages: ["mysql2"],
  images: {
    remotePatterns: wordpressHostname
      ? [
        {
          protocol: "https",
          hostname: wordpressHostname,
          port: "",
          pathname: "/**",
        },
        {
          protocol: "http",
          hostname: wordpressHostname,
          port: "",
          pathname: "/**",
        },
      ]
      : [],
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