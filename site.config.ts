type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  portfolio_username?: string;
};

export const siteConfig: SiteConfig = {
  site_name: "Profolio",
  site_description: "A modern professional portfolio built with Next.js and WordPress",
  site_domain: "https://app.cvhowlader.com",
  portfolio_username: "",
};
