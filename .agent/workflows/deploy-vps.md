---
description: How to deploy to a VPS with Apache, PHP, and Node.js (No Docker)
---

# Professional VPS Deployment Workflow (Standard Stack)

This guide provides the simplest, professionally recommended "Push-to-Deploy" workflow for a **Next.js + WordPress** stack on a standard VPS (Apache, PHP, MariaDB, Node 22) without using Docker.

## 1. Prerequisites (Server-side)

Log in to your VPS and ensure the following are installed:
- **Node.js 22 LTS**
- **Git**
- **PM2** (Process Manager for Node): `npm install -g pm2`
- **pnpm**: `npm install -g pnpm`
- **Apache** with `mod_proxy` enabled:
  ```bash
  sudo a2enmod proxy proxy_http rewrite ssl
  sudo systemctl restart apache2
  ```

## 2. Server Structure Setup

Create a directory for your app and a bare Git repository:

```bash
mkdir -p ~/apps/portfolio && cd ~/apps/portfolio
mkdir repo.git && cd repo.git
git init --bare
```

## 3. The "Push-to-Deploy" Hook

Create the magic automation script on your VPS:

**File:** `~/apps/portfolio/repo.git/hooks/post-receive`

```bash
#!/bin/bash
# Configuration
TARGET="/home/$(whoami)/apps/portfolio/source"
GIT_DIR="/home/$(whoami)/apps/portfolio/repo.git"

# 1. Extract the code
mkdir -p $TARGET
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f

# 2. Setup environment variables
# Ensure you have a .env file created manually at ~/apps/portfolio/.env
cp /home/$(whoami)/apps/portfolio/.env $TARGET/.env

# 3. Build & Deploy Next.js
cd $TARGET
pnpm install --frozen-lockfile
pnpm run build

# 4. Restart PM2 process
pm2 restart portfolio-app || pm2 start pnpm --name "portfolio-app" -- start


# 4. Sync WordPress Theme/Plugins (Optional)
# If your Apache root is elsewhere, symlink or copy them:
# cp -r $TARGET/wordpress/theme /var/www/html/wp-content/themes/my-theme
```

**Make it executable:**
```bash
chmod +x ~/apps/portfolio/repo.git/hooks/post-receive
```

## 4. Apache Configuration (Reverse Proxy)

Configure Apache to lead traffic to Next.js (port 3000) and WordPress.

**File:** `/etc/apache2/sites-available/portfolio.conf`

```apache
<VirtualHost *:80>
    ServerName yourdomain.com

    # Reverse Proxy for Next.js
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Handle WordPress/PHP files specifically if needed
    # Or use a subdirectory like /cms for WordPress
    Alias /cms /var/www/html/wordpress
    <Directory /var/www/html/wordpress>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite portfolio.conf
sudo systemctl reload apache2
```

## 5. Local Setup & Deployment

On your **local machine**, add the VPS as a remote and push:

```bash
# Add the remote
git remote add production user@your-vps-ip:~/apps/portfolio/repo.git

# Deploy!
git push production main
```

## Summary of Best Practices
1. **PM2**: Ensures your Next.js app stays alive and restarts on crash or reboot.
2. **Post-Receive Hook**: Automates build and deployment without manual file transfers.
3. **pnpm**: Uses fast, disk-efficient package management.
4. **Apache Reverse Proxy**: Securely exposes your Node app on the web.
5. **No Docker**: Leverages the server's native performance and existing PHP/Apache stack.
