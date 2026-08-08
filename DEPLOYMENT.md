# HeartLogs — Deployment Guide

## Stack
- **App**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: MySQL 8 (runs in the existing `wix-and-wax-mysql` Docker container on EC2)
- **Auth**: NextAuth v5 — Credentials + Google OAuth
- **Process manager**: PM2
- **Reverse proxy**: Nginx + Let's Encrypt SSL
- **Server**: AWS EC2 t3.micro (`3.7.207.83`), Ubuntu — AWS account `222034741989`
- **Domain**: heartlogs.com
- **SSH key**: `~/.ssh/heartlogs-key.pem`

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
AUTH_TRUST_HOST=true
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

## Deploy (Build Locally → Rsync Build → Install/Migrate/Restart on Server)

> **Build locally, not on the server.** The t3.micro has crashed/hung (sshd became unresponsive
> during banner exchange) from OOM while running `next build` under load — recovering requires
> an EC2 reboot (see Troubleshooting below). `prisma/schema.prisma` sets
> `binaryTargets = ["darwin-arm64", "debian-openssl-3.0.x"]`, so a local (Mac) `prisma generate`
> already produces a Linux-compatible query engine — a local build is safe to ship as-is.
> Do not remove `debian-openssl-3.0.x` from `binaryTargets`, or this breaks again.

### Step 1 — Build locally
```bash
npm run build
```

### Step 2 — Rsync source + build to server (exclude node_modules/env/dev db)
```bash
rsync -avz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='prisma/dev.db' \
  --exclude='public/uploads' \
  -e "ssh -i ~/.ssh/heartlogs-key.pem" \
  ./ ubuntu@3.7.207.83:/home/ubuntu/heartlogs/
```
(Note: `.next` is **not** excluded here — the local build output ships as-is. `public/uploads` **is**
excluded — it holds user-uploaded diary entry images that live only on the server; rsync has no
`--delete` flag so it wouldn't wipe them either way, but excluding it avoids ever pushing local test
uploads over real user data.)

### Step 3 — On the server: install, generate client, migrate, restart
```bash
ssh -i ~/.ssh/heartlogs-key.pem ubuntu@3.7.207.83 "
  cd /home/ubuntu/heartlogs &&
  npm install &&
  npx prisma generate &&
  set -a && source .env.production && set +a &&
  npx prisma migrate deploy &&
  pm2 restart heartlogs --update-env
"
```
`npx prisma generate` here only regenerates the query engine binaries into
`node_modules/@prisma/client` for the `debian-openssl-3.0.x` target already produced locally —
it does not run a Next.js build, so it's cheap on the t3.micro's memory.

### Verify
```bash
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://heartlogs.com
ssh -i ~/.ssh/heartlogs-key.pem ubuntu@3.7.207.83 "pm2 status"
```

---

## Troubleshooting: Server Unresponsive / SSH Hangs on Banner Exchange

Symptom: `nc -zv 3.7.207.83 22` succeeds (port open) but `ssh` hangs and times out during
banner exchange. This means the box is up at the network level but sshd/the OS is
CPU/memory-thrashed (typically from a `next build` run directly on the server) — a normal
network/auth issue would fail immediately, not hang.

Fix — reboot via AWS CLI (do **not** delete/recreate the instance):
```bash
# Confirm you're on account 222034741989 (profile `myaccount`, not `default`)
aws sts get-caller-identity --profile myaccount

# Find the instance (Elastic IP is static: 3.7.207.83, so this doesn't change)
aws ec2 describe-instances --profile myaccount \
  --filters "Name=ip-address,Values=3.7.207.83" \
  --query 'Reservations[].Instances[].{ID:InstanceId,State:State.Name}' --output table

# Reboot (instance id: i-0a4f3092b695bfa76)
aws ec2 reboot-instances --profile myaccount --instance-ids i-0a4f3092b695bfa76
```
SSH typically comes back within a few minutes. Poll with:
```bash
until ssh -i ~/.ssh/heartlogs-key.pem -o ConnectTimeout=5 -o BatchMode=yes ubuntu@3.7.207.83 "echo up"; do sleep 5; done
```
PM2's systemd startup hook auto-restarts the `heartlogs` process and the `wix-and-wax-mysql`
Docker container auto-restarts on boot, so no manual app/DB restart is needed after reboot —
just re-run the deploy steps above once SSH is back.

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

## Publishing a Blog Post (no deploy needed)

Blog posts are stored in the `BlogPost` table (`src/lib/blog.ts` reads them; `/blog` and
`/blog/[slug]` revalidate every 60s), not compiled into the app. Publishing a new post is a
direct DB insert on the server — no `next build`, rsync, or `pm2 restart` required.

1. Write the post as JSON (see `scripts/publish-blog-post.ts` for the shape: `slug`, `title`,
   `description`, `content` (markdown-ish, matches the existing posts' style), `tags`, optional
   `author`/`date`).
2. Copy it to the server and run the publish script there (it uses `.env.production`):
```bash
scp -i ~/.ssh/heartlogs-key.pem post.json ubuntu@3.7.207.83:/home/ubuntu/heartlogs/post.json
ssh -i ~/.ssh/heartlogs-key.pem ubuntu@3.7.207.83 "
  cd /home/ubuntu/heartlogs &&
  set -a && source .env.production && set +a &&
  npx tsx scripts/publish-blog-post.ts post.json
"
```
3. It appears at `/blog/<slug>` within ~60s (revalidation window) — no restart needed.

Re-running the script with the same `slug` updates that post in place (upsert).

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

# Check memory / swap
free -m

# SSH into server
ssh -i ~/.ssh/heartlogs-key.pem ubuntu@3.7.207.83
```
