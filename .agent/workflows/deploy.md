---
description: How to build and deploy to a VPS without Docker
---

# Professional VPS Deployment Workflow (Standard Stack)

This guide provides the simplest, professionally recommended "Push-to-Deploy" workflow for a **Next.js + WordPress** stack on a standard VPS (Nginx/Apache, PHP, MariaDB, Node 22) without using Docker.

## 1. Prerequisites (Server-side)

Log in to your VPS and ensure the following are installed:
- **Node.js 22 LTS**
- **Git**
- **PM2**: `npm install -g pm2`
- **pnpm**: `npm install -g pnpm`
- **Nginx** (Recommended) or **Apache**:
  - **Nginx**: `sudo apt install nginx`
  - **Apache**: `sudo a2enmod proxy proxy_http rewrite ssl`

## 2. Server Structure Setup

```bash
mkdir -p ~/apps/portfolio-app && cd ~/apps/portfolio-app
mkdir repo.git && cd repo.git
git init --bare
```

## 3. The "Push-to-Deploy" Hook

Create the magic automation script:
**File:** `~/apps/portfolio-app/repo.git/hooks/post-receive`

```bash
#!/bin/bash
TARGET="/home/$(whoami)/apps/portfolio-app/source"
GIT_DIR="/home/$(whoami)/apps/portfolio-app/repo.git"

mkdir -p $TARGET
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f

if [ -f "/home/$(whoami)/apps/portfolio-app/.env" ]; then
    cp /home/$(whoami)/apps/portfolio-app/.env $TARGET/.env
fi

cd $TARGET
pnpm install --frozen-lockfile
pnpm run build

# Restart PM2
pm2 restart portfolio-app || pm2 start pnpm --name "portfolio-app" -- start
```
`chmod +x ~/apps/portfolio-app/repo.git/hooks/post-receive`

## 4. Web Server Configuration (Reverse Proxy)

### Option A: Nginx (Recommended)
**File:** `/etc/nginx/sites-available/portfolio`
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
`sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/`
`sudo nginx -t && sudo systemctl restart nginx`

### Option B: Apache
**File:** `/etc/apache2/sites-available/portfolio.conf`
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```
`sudo a2ensite portfolio.conf && sudo systemctl reload apache2`

## 5. Local Setup & Deployment

```bash
git remote add vps user@your-vps-ip:~/apps/portfolio-app/repo.git
git push vps main
```
