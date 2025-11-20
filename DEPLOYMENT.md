# Deployment Guide for GitHub

## Step 1: Add API Keys to GitHub Secrets

1. Go to your GitHub repository: https://github.com/Komsomol/Movie-Trailers
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add these secrets:

   **Name:** `YT_API_KEY`
   **Value:** `AIzaSyANhlrpOH4YYuAobARwnCx09A3sMGpO5sw`

## Step 2: Choose Deployment Platform

### Option A: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import `Komsomol/Movie-Trailers` repository
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build && npm run client:build`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install && cd client && npm install`
5. Add Environment Variable:
   - **Name:** `YT_API_KEY`
   - **Value:** (paste your API key)
6. Click **Deploy**
7. Your site will be live at: `https://movie-trailers-[random].vercel.app`
8. Optional: Add custom domain `trailers.voidkat.com` in Vercel settings

### Option B: GitHub Actions + GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          cd client && npm install

      - name: Build client
        run: npm run client:build
        env:
          YT_API_KEY: ${{ secrets.YT_API_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist
```

Then:
1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **root**
4. Save

**Note:** GitHub Pages only hosts static files. You'll need a backend elsewhere (see Option C).

### Option C: Full-Stack on Railway/Render

#### Railway.app:
1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `Komsomol/Movie-Trailers`
4. Add environment variable: `YT_API_KEY`
5. Railway will auto-detect Node.js and deploy
6. Get your URL: `https://movie-trailers-production.up.railway.app`

#### Render.com:
1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect `Komsomol/Movie-Trailers` repo
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:improved`
5. Add Environment Variable: `YT_API_KEY`
6. Deploy

### Option D: Your VPS (voidkat.com server)

If voidkat.com is on your own server:

1. **SSH into your server:**
```bash
ssh user@voidkat.com
```

2. **Clone the repo:**
```bash
cd /var/www
git clone https://github.com/Komsomol/Movie-Trailers.git
cd Movie-Trailers
```

3. **Install dependencies:**
```bash
npm install
cd client && npm install && npm run build && cd ..
```

4. **Create .env file:**
```bash
cat > .env << 'EOF'
YT_API_KEY=AIzaSyANhlrpOH4YYuAobARwnCx09A3sMGpO5sw
NODE_ENV=production
PORT=3030
EOF
```

5. **Install PM2 (process manager):**
```bash
npm install -g pm2
pm2 start app.improved.js --name "movie-trailers"
pm2 save
pm2 startup
```

6. **Configure Nginx:**
```nginx
# /etc/nginx/sites-available/trailers.voidkat.com

server {
    listen 80;
    server_name trailers.voidkat.com;

    # Serve static files
    location / {
        root /var/www/Movie-Trailers/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js
    location /api {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/trailers.voidkat.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

8. **Setup SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d trailers.voidkat.com
```

## Step 3: Custom Domain (Optional)

### For Vercel:
1. In Vercel project settings → **Domains**
2. Add domain: `trailers.voidkat.com`
3. Add DNS records in your domain registrar:
   - Type: `CNAME`
   - Name: `trailers`
   - Value: `cname.vercel-dns.com`

### For your own server:
Already configured in nginx above!

## Step 4: Enable GitHub Pages for Docs (Optional)

You can use GitHub Pages to host just the documentation:

1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **master** / **docs** (if you create a docs folder)
4. Your docs will be at: `https://komsomol.github.io/Movie-Trailers/`

## Security Checklist

- [x] `.env` file in `.gitignore` ✅
- [x] API key NOT in git history ✅
- [x] `.env.example` with placeholders ✅
- [ ] Add GitHub Secret `YT_API_KEY`
- [ ] Enable Dependabot security alerts
- [ ] Set up API quota alerts in Google Cloud Console

## Testing Deployment

After deployment, test:
1. Visit your URL
2. Check if trailers load
3. Test studio filter
4. Test pagination
5. Test clicking a trailer (modal opens)
6. Check browser console for errors
7. Verify API calls go to your backend (not directly to YouTube)

## Monitoring

- **Vercel:** Built-in analytics and logs
- **Railway:** View logs in dashboard
- **VPS:** Use `pm2 logs movie-trailers` or check nginx logs

## Updating After Changes

### Vercel:
Just push to GitHub - auto-deploys!

### VPS:
```bash
ssh user@voidkat.com
cd /var/www/Movie-Trailers
git pull
npm install
cd client && npm install && npm run build
pm2 restart movie-trailers
```

---

**Recommended:** Start with Vercel for easiest deployment, then move to your own server later if needed.
