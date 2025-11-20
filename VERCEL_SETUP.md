# Vercel Deployment Guide (Simplest Option)

Deploy your Movie Trailers app to Vercel in 5 minutes!

## Step 1: Sign Up & Import

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up** and choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub account
4. Click **Add New** → **Project**
5. Find and select `Komsomol/Movie-Trailers`
6. Click **Import**

## Step 2: Configure Build Settings

Vercel will auto-detect your project. Verify these settings:

- **Framework Preset**: Other (or leave auto-detected)
- **Root Directory**: `./` (leave default)
- **Build Command**: Leave default (uses `vercel.json` settings)
- **Output Directory**: Leave default (uses `vercel.json` settings)
- **Install Command**: Leave default

## Step 3: Add Environment Variables

Before deploying, add your API key:

1. Scroll down to **Environment Variables**
2. Add:
   - **Name**: `YT_API_KEY`
   - **Value**: `AIzaSyANhlrpOH4YYuAobARwnCx09A3sMGpO5sw`
   - **Environment**: Production, Preview, Development (select all)
3. Click **Add**

## Step 4: Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes while Vercel:
   - Installs dependencies
   - Builds your Vue frontend
   - Sets up the API backend
3. 🎉 Your site will be live!

## Step 5: Get Your URL

After deployment completes:

1. You'll see: **"Congratulations! Your project has been deployed"**
2. Your URL: `https://movie-trailers-[random-id].vercel.app`
3. Click **Visit** to see your site

## Step 6: (Optional) Add Custom Domain

To use `trailers.voidkat.com`:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **Add**
3. Enter: `trailers.voidkat.com`
4. Vercel will show DNS records to add:
   - Type: `CNAME`
   - Name: `trailers`
   - Value: `cname.vercel-dns.com`
5. Add these records in your domain registrar (where you manage voidkat.com)
6. Wait a few minutes for DNS propagation
7. Vercel will auto-configure HTTPS!

## Auto-Deploy

Every time you push to GitHub, Vercel automatically redeploys:

```bash
git add .
git commit -m "update trailers"
git push
```

Vercel will:
- Detect the push
- Build and deploy automatically
- Notify you when complete

## Troubleshooting

### Deployment Failed
- Check build logs in Vercel dashboard
- Verify `YT_API_KEY` is set correctly
- Ensure no syntax errors in recent commits

### Trailers Not Loading
1. Visit `https://your-vercel-url.vercel.app/api` directly
2. You should see JSON data
3. If not, check:
   - Environment variable is set
   - API quota not exceeded (10,000 calls/day)

### CORS Errors
- Already configured for `komsomol.github.io`
- Vercel domains should work automatically

## Cost

- **Free tier**: Perfect for this project
- Includes:
  - Unlimited deployments
  - Automatic HTTPS
  - 100GB bandwidth/month
  - Serverless functions

## Managing Your Deployment

### View Logs
1. Vercel Dashboard → Your Project → **Deployments**
2. Click any deployment → **View Function Logs**

### Rollback
1. Go to **Deployments**
2. Find previous working version
3. Click **•••** → **Promote to Production**

### Environment Variables
1. **Settings** → **Environment Variables**
2. Edit or add new variables
3. Click **Save**
4. Redeploy for changes to take effect

## Next Steps

✅ Your app is live!
✅ Auto-deploys on every push
✅ HTTPS enabled automatically
✅ Optional: Add custom domain

**Share your trailer site**: Send friends your Vercel URL!

---

**Need help?** Check Vercel's docs at [vercel.com/docs](https://vercel.com/docs)
