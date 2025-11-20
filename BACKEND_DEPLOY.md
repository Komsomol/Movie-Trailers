# Backend Deployment for GitHub Pages Setup

Since GitHub Pages only hosts static files, you need to deploy your backend API separately.

## Quick Setup: Deploy Backend to Railway (Free)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **Login** and sign in with GitHub

### Step 2: Deploy Backend
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `Komsomol/Movie-Trailers`
4. Railway will automatically detect Node.js

### Step 3: Configure Environment Variables
1. In your Railway project, click **Variables**
2. Add: `YT_API_KEY` = `AIzaSyANhlrpOH4YYuAobARwnCx09A3sMGpO5sw`
3. Add: `PORT` = `3030` (optional, Railway auto-assigns)

### Step 4: Configure Start Command
1. Click **Settings** tab
2. Under **Deploy**, set **Start Command** to: `node app.improved.js`
3. Click **Save**

### Step 5: Get Your Backend URL
1. In Railway, click **Settings**
2. Under **Networking**, click **Generate Domain**
3. Copy the URL (e.g., `https://movie-trailers-production.up.railway.app`)
4. **Important**: Copy the full URL including `https://`

### Step 6: Add Backend URL to GitHub Secrets
1. Go to your GitHub repo: https://github.com/Komsomol/Movie-Trailers
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name**: `BACKEND_URL`
5. **Value**: `https://your-railway-url.up.railway.app/api` (add `/api` at the end!)
6. Click **Add secret**

### Step 7: Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

### Step 8: Push to Deploy
Your GitHub Actions workflow will automatically:
1. Build the Vue frontend
2. Configure it to call your Railway backend
3. Deploy to GitHub Pages

Your site will be live at: `https://komsomol.github.io/Movie-Trailers/`

## Testing

1. **Test backend directly**: Visit `https://your-railway-url.up.railway.app/api` - you should see JSON data
2. **Test frontend**: Visit `https://komsomol.github.io/Movie-Trailers/` - trailers should load

## Alternative: Render.com (Also Free)

If Railway doesn't work, you can use Render.com:

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node app.improved.js`
   - **Environment Variables**: Add `YT_API_KEY`
5. Click **Deploy**
6. Copy the URL and add to GitHub Secrets as `BACKEND_URL`

## Troubleshooting

### CORS Errors
If you see CORS errors, update `app.improved.js` to allow your GitHub Pages domain:

```javascript
app.use(cors({
  origin: 'https://komsomol.github.io'
}));
```

### API Not Loading
1. Check Railway logs for errors
2. Verify `YT_API_KEY` is set in Railway
3. Test backend directly by visiting the `/api` endpoint
4. Verify `BACKEND_URL` in GitHub Secrets includes `/api` at the end

## Cost
- **Railway**: 500 hours/month free (plenty for this project)
- **Render**: 750 hours/month free
- **GitHub Pages**: Completely free

## Updating
- **Backend**: Push changes to GitHub, Railway auto-deploys
- **Frontend**: Push changes to GitHub, GitHub Actions auto-deploys
