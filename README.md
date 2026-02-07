# 🚀 Next.js WordPress Starter Kit

A professional-grade, SEO-optimized headless WordPress starter built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Designed for speed, scalability, and ease of use.

## 🛠️ Getting Started

Follow these steps to set up the development environment locally and deploy to your VPS.

### 🔌 Local Development

1. **Clone and Setup Environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your WordPress URL and Database credentials.

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Developing**
   ```bash
   pnpm dev
   ```
   - **Frontend:** [http://localhost:3000](http://localhost:3000)

---

### 🚀 VPS Deployment (Node 22 LTS)

This project is optimized for deployment on a standard VPS with **Node.js 22**, **Apache/Nginx**, and **PM2**.

Follow the detailed instructions in [.agent/workflows/deploy-vps.md](.agent/workflows/deploy-vps.md) for a professional "Push-to-Deploy" setup.

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

### VPS (Self-Hosted)
Follow the guide in [.agent/workflows/deploy-vps.md](.agent/workflows/deploy-vps.md).

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

Built with ❤️ by [CVHowlader](https://cvhowlader.com).