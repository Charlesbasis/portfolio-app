---
description: How to build locally using Docker and deploy to a VPS using Git
---

# Professional Development & Deployment Workflow

This workflow follows the latest LTS (Node 22) and professional best practices for a Next.js + WordPress + MariaDB stack.

## 1. Local Development (Docker-first)

Professional developers use Docker to ensure "it works on my machine" translates to "it works on the server".

**Step 1: Environment Setup**
Ensure you have a `.env` file based on `.env.example`.
```bash
cp .env.example .env
```

**Step 2: Start the Stack**
// turbo
```bash
docker compose up -d
```
- **Next.js App**: http://localhost:3000
- **WordPress CMS**: http://localhost:8080 (Login: `root` / `password` if using default db creds)

## 2. Building Locally for Production

Before pushing, verify the production Docker image builds correctly.

**Build the Image**
// turbo
```bash
docker build -t portfolio-prod .
```

**Test the Production Image**
// turbo
```bash
docker run -p 3005:3000 --env-file .env portfolio-prod
```
Check http://localhost:3005 to ensure the production build works.

## 3. Deploying to VPS via Git (Professional Simplest Approach)

Instead of manual FTP or complex CI/CD, we use a **Git Bare Repository** with a **Post-Receive Hook** on the VPS.

### A. VPS Preparation (One-time only)
On your VPS (e.g., Ubuntu):
```bash
# 1. Install Docker & Git
sudo apt update && sudo apt install -y docker.io docker-compose git

# 2. Create the deployment folder
mkdir -p ~/apps/portfolio-app
cd ~/apps/portfolio-app

# 3. Create a Git Bare Repository
mkdir repo.git && cd repo.git
git init --bare
```

### B. Setup Automation Hook
On the VPS, create the file `~/apps/portfolio-app/repo.git/hooks/post-receive`:
```bash
#!/bin/bash
TARGET="/home/$(whoami)/apps/portfolio-app/source"
GIT_DIR="/home/$(whoami)/apps/portfolio-app/repo.git"

mkdir -p $TARGET
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f

cd $TARGET
docker compose up -d --build
```
Make it executable:
```bash
chmod +x ~/apps/portfolio-app/repo.git/hooks/post-receive
```

### C. Deploy from Local
On your local machine, add the VPS as a remote:
```bash
git remote add vps user@your-vps-ip:~/apps/portfolio-app/repo.git

# Push and Deploy!
git push vps main
```

## Summary of Best Practices used:
- **Node 22 LTS (Alpine)**: Uses the slim, secure, and current LTS version.
- **Standalone Build**: Next.js `output: 'standalone'` minimizes the Docker image size.
- **Multi-stage Docker**: Separates dependencies, build, and runtime for security and performance.
- **Non-root User**: The Docker container runs as `nextjs` user, not `root`.
- **Git Hooks**: Automates deployment directly from your CLI without third-party services.
