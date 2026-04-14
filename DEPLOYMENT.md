# HeartLogs — Deployment Guide

## Stack
- **App**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: MySQL 8 (runs in the existing `wix-and-wax-mysql` Docker container on EC2)
- **Auth**: NextAuth v5 — Credentials + Google OAuth
- **Process manager**: PM2
- **Reverse proxy**: Nginx + Let's Encrypt SSL
- **Server**: AWS EC2 t3.small (`13.205.92.146`), Ubuntu
- **Domain**: heartlogs.com

---

## Infrastructure Overview

```
heartlogs.com / www.heartlogs.com
        │
     Nginx (port 443, SSL via Certbot)
        │
   PM2 → next start (port 3000)
        │
   MySQL at 172.19.0.2:3306  ← Docker container: wix-and-wax-mysql
   Database: heartlogs
   User: heartlogs
```

> **Note**: `172.19.0.2` is the Docker container IP. If the MySQL container is ever recreated, re-run:
> ```bash
> docker inspect wix-and-wax-mysql --format '{{json .NetworkSettings.Networks}}'
> ```
> and update `DATABASE_URL` in `/home/ubuntu/heartlogs/.env.production`.

---

## Environment Variables

### Local (`.env.local`)
```env
DATABASE_URL="mysql://heartlogs:<password>@localhost:3306/heartlogs"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="<secret>"
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
```

### Production (`/home/ubuntu/heartlogs/.env.production` on EC2)
```env
DATABASE_URL="mysql://heartlogs:<password>@172.19.0.2:3306/heartlogs"
NEXTAUTH_URL="https://heartlogs.com"
AUTH_SECRET="<same secret as local>"
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
NODE_ENV=production
```

---

## First-Time Server Setup

### 1. Create MySQL database and user
SSH into EC2 and run:
```bash
docker exec wix-and-wax-mysql mysql -uroot -p<root-password> -e "
  CREATE DATABASE IF NOT EXISTS heartlogs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'heartlogs'@'%' IDENTIFIED BY '<password>';
  GRANT ALL PRIVILEGES ON heartlogs.* TO 'heartlogs'@'%';
  FLUSH PRIVILEGES;
"
```

### 2. Install PM2 globally
```bash
sudo npm install -g pm2
```

### 3. Add Nginx config
Create `/etc/nginx/sites-available/heartlogs`:
```nginx
server {
    listen 80;
    server_name heartlogs.com www.heartlogs.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```
```bash
sudo ln -sf /etc/nginx/sites-available/heartlogs /etc/nginx/sites-enabled/heartlogs
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Issue SSL certificate
```bash
sudo certbot --nginx -d heartlogs.com -d www.heartlogs.com --non-interactive --agree-tos -m <email>
```

### 5. Set up PM2 auto-start on reboot
```bash
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

---

## Deploy (Rsync Source → Build on Server)

> **Always build on the server**, not locally. The `.next` build embeds platform-specific
> Prisma client binaries — a Mac build will fail on Linux with a module-not-found error.
> The t3.small handles the build fine with a 1.5GB Node.js memory cap.

### Step 1 — Rsync source to server (exclude build artifacts)
```bash
rsync -avz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='.next' \
  --exclude='prisma/dev.db' \
  -e "ssh -i ~/.ssh/portfolio-parser-key.pem" \
  ./ ubuntu@13.205.92.146:/home/ubuntu/heartlogs/
```

### Step 2 — On the server: install, generate, migrate, build, restart
```bash
ssh -i ~/.ssh/portfolio-parser-key.pem ubuntu@13.205.92.146 "
  cd /home/ubuntu/heartlogs &&
  npm install &&
  npx prisma generate &&
  DATABASE_URL='mysql://heartlogs:<password>@172.19.0.2:3306/heartlogs' npx prisma migrate deploy &&
  NODE_OPTIONS='--max-old-space-size=1536' npm run build &&
  pm2 restart heartlogs
"
```

---

## Schema Changes

Always use migrations — never `db push` in production:

```bash
# Locally: create migration after editing prisma/schema.prisma
npx prisma migrate dev --name <description>

# This generates prisma/migrations/<timestamp>_<description>/migration.sql
# Commit it, then on next deploy Step 3 runs migrate deploy automatically
```

---

## Google OAuth Setup

In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth client:

- **Authorized JavaScript origins**: `https://heartlogs.com`
- **Authorized redirect URIs**: `https://heartlogs.com/api/auth/callback/google`

For local dev also add:
- Origin: `http://localhost:3000`
- Redirect: `http://localhost:3000/api/auth/callback/google`

---

## Useful Commands on Server

```bash
# View live logs
pm2 logs heartlogs

# Restart app
pm2 restart heartlogs

# Check status
pm2 status

# Connect to MySQL
mysql -u heartlogs -p<password> -h 172.19.0.2 -P 3306 heartlogs

# Check Nginx
sudo nginx -t
sudo systemctl reload nginx

# Renew SSL (auto, but manual if needed)
sudo certbot renew
```
