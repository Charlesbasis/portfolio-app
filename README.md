[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI Status](https://github.com/Charlesbasis/portfolio-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Charlesbasis/portfolio-app/actions)
[![Live Demo](https://img.shields.io/badge/demo-online-success?style=flat&logo=vercel)](https://app.cvhowlader.com)

## Table of Contents

- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Docker Development (Recommended)](#docker-development-recommended)
- [WordPress & Plugins Configuration](#wordpress--plugins-configuration)
- [Manual Development](#manual-development)
- [Professional Features Out-of-the-Box](#professional-features-out-of-the-box)
- [Starting Fresh (Git Reset)](#starting-fresh-git-reset)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Live Demo

Check out a live version at [app.cvhowlader.com](https://app.cvhowlader.com)

### Prerequisites

- [Docker](https://www.docker.com/) (v20+ recommended)  
- [Node.js](https://nodejs.org/) (v18+ if running manually)
- [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/) (if not using Docker)

# 🚀 Next.js WordPress Starter Kit

A professional-grade, SEO-optimized headless WordPress starter built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Designed for speed, scalability, and ease of use.

## 🛠️ Getting Started

You can set up this kit either manually or using Docker. Docker is the recommended approach for a consistent development environment.

### 🐳 Docker Development (Recommended)

The entire stack (Next.js, WordPress, and MariaDB) is containerized and ready to go.

1. **Clone and Setup Environment**
   ```bash
   cp .env.example .env
   ```

2. **Start the Stack**
   ```bash
   docker compose up -d
   ```

3. **Access Services**
   - **Next.js Frontend:** [http://localhost:3000](http://localhost:3000)
   - **WordPress Admin:** [http://localhost:8080/wp-admin](http://localhost:8080/wp-admin)
   - **Database:** `localhost:3307`

4. **Initialize WordPress**
   The Docker setup automatically installs WordPress, activates the **Next.js Headless** theme, and the **Next.js Revalidation** plugin.
   - **Default Admin User:** `admin`
   - **Default Admin Password:** `changeme` (Change this immediately!)

---

### 🔌 WordPress & Plugins Configuration

For the Next.js frontend to communicate with WordPress, you need to set up an **Application Password**.

1. Log in to your WordPress Admin.
2. Go to **Users > Profile**.
3. Scroll down to **Application Passwords**.
4. Add a new application password named `portfolio-app`.
5. Copy the generated password and add it to your `.env` file:
   ```bash
   WP_USER="admin"
   WP_APPLICATION_PASSWORD="xxxx xxxx xxxx xxxx xxxx"
   ```

#### Next.js Revalidation Plugin
This plugin is included in `plugin/next-revalidate` and is auto-configured in Docker. It ensures your Next.js site updates instantly when you edit content in WordPress.

- **Manual Setup:** If not using Docker, upload `plugin/next-revalidate.zip` to WordPress.
- **Webhook Secret:** Ensure `WORDPRESS_WEBHOOK_SECRET` matches in both WordPress (Settings > Next.js Revalidation) and your `.env` file.

---

## 🛠️ Manual Development

If you prefer to run Next.js locally against a remote WordPress instance:

### 1. Project Configuration
Customize your site's identity in `site.config.ts`:
```typescript
export const siteConfig = {
  site_name: "My Professional Portfolio",
  site_description: "Built with Next.js and Headless WordPress",
  site_domain: "https://yourdomain.com",
};
```

### 2. Start Developing
```bash
pnpm install
pnpm dev
```

---

## ✨ Professional Features Out-of-the-Box

- **Industry-Standard SEO:** Pre-configured dynamic `sitemap.xml`, `robots.txt`, and `manifest.json`.
- **Performance:** Leveraging Next.js 16 App Router and React 19 for sub-second page loads.
- **Tailwind CSS v4:** The latest in utility-first CSS for rapid, modern styling.
- **Headless WordPress:** Deep integration with WP REST API including custom post types and taxonomies.
- **Hybrid Auth:** Sync local MySQL users with WordPress accounts seamlessly.
- **Instant Revalidation:** Trigger cache updates from WordPress via the included plugin.

---

## 🧼 Starting Fresh (Git Reset)

If you are using this as a template for a brand-new project, you may want to clear the git history:

```bash
# Remove existing git history
rm -rf .git

# Initialize new repository
git init
git add .
git commit -m "Initial commit from Next WP Starter Kit"

# Link to your new remote
git remote add origin https://github.com/youruser/your-new-repo.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deployment

### Railway (Recommended)
This kit is optimized for Railway's one-click deployment, handling the Next.js frontend, WordPress CMS, and MySQL database in a single stack.

### Vercel / Netlify
Ensure you provide the necessary Environment Variables in your dashboard and connect your WordPress instance.

---

## 📁 Project Structure

- `app/`: Next.js App Router (Pages, API, SEO).
- `components/`: shadcn/ui and custom feature components.
- `lib/`: Core logic (WP API, Database, Auth).
- `site.config.ts`: Central site metadata.
- `menu.config.ts`: Navigation configuration.

---

## License

This project is licensed under the [MIT License](LICENSE).

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) to foster a welcoming community.

## Contributing

Mainly maintained for the use of my team at CVHowlader, but external issues and PRs are always welcome!  
Please review [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before submitting changes.

Built with ❤️ by [CVHowlader](https://cvhowlader.com).
