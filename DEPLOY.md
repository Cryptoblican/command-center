# Deployment Guide: Railway.app

This guide walks you through deploying the Command Center Dashboard to Railway.app.

## Prerequisites

- GitHub account with the `command-center` repo pushed
- Railway.app account (free tier available)
- Node.js 16+ (for local testing before deployment)

## Step 1: Set Up GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
cd /Users/brettnielsen/.openclaw/workspace/command-center

# Authenticate with GitHub (first time only)
gh auth login

# Create the repository
gh repo create command-center --source=. --remote=origin --push --private
```

### Option B: Manual GitHub Setup

1. Go to [github.com](https://github.com) and create a new repository called `command-center`
2. Add remote and push:

```bash
cd /Users/brettnielsen/.openclaw/workspace/command-center
git remote add origin https://github.com/YOUR_USERNAME/command-center.git
git branch -M main
git push -u origin main
```

## Step 2: Prepare Project for Railway

The project is already configured with:
- ✅ `package.json` with all dependencies
- ✅ `Procfile` for Railway (runs `node server.js`)
- ✅ `.env.example` with required variables
- ✅ Frontend built and served from Express

No additional configuration needed!

## Step 3: Deploy to Railway

### Option A: Railway Dashboard (Visual)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"Create New Project"** → **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select `YOUR_USERNAME/command-center`
6. Railway automatically detects `package.json` and creates the project
7. Click **"Deploy"**

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Deploy from project directory
cd /Users/brettnielsen/.openclaw/workspace/command-center
railway init
railway up
```

## Step 4: Configure Environment Variables

In Railway dashboard:

1. Go to your project → **Variables**
2. Set the following:

```
PORT=3000
NODE_ENV=production
DATABASE_URL=./data/command-center.db
```

Optional (if using Google OAuth later):
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

3. Click **"Save"** → Railway redeploys automatically

## Step 5: Access Your Deployment

After deployment completes:

1. Go to **Deployments** → Your latest deployment
2. Click **"Open app"** or find the public URL like:
   ```
   https://command-center-abc123.railway.app
   ```

3. Bookmark this URL! This is your live dashboard.

## Troubleshooting Deployment

### Build fails with "node: command not found"

**Solution**: Railway doesn't have Node.js installed. Add a runtime:

In Railway dashboard → Settings:
```
Runtime: nodejs:18
```

### Port already in use

**Solution**: Railway manages ports automatically. Ignore local port conflicts.

### Database not creating

**Solution**: Railway provides ephemeral storage (files deleted on redeploy). For persistent data:

1. Upgrade to Railway's Postgres plugin (recommended)
2. Or use Railway's "Volumes" feature to persist `/data` directory

For now, if you just want to test:
- Database is created on first run
- Data persists until you redeploy (which clears `/data`)

**Better solution**: Switch to PostgreSQL

In Railway dashboard:
1. Click **"+" → "Add Service"**
2. Select **"PostgreSQL"**
3. Connect it to your app
4. Update code to use `DATABASE_URL` environment variable

### App crashes on startup

Check logs in Railway dashboard:
1. Go to **Logs**
2. Look for error messages
3. Ensure all dependencies installed: `npm install`
4. Verify `server.js` syntax: `node server.js` (local test)

## Post-Deployment: Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main

# Railway detects push and redeploys automatically (2-5 minutes)
# Check deployment status in Railway dashboard
```

## Rollback to Previous Deployment

In Railway dashboard → Deployments:
1. Find the previous working deployment
2. Click the 3-dot menu → **"Redeploy"**
3. Confirms rollback in 1-2 minutes

## Performance Tips

1. **Enable Railway's compression**:
   - Reduces bundle size (64.5 KB → ~20 KB gzipped)
   - Already configured in Express

2. **Caching**:
   - Browser caches static assets (dist/ files)
   - Database queries cached in SQLite cache table

3. **Monitoring**:
   - Railway shows CPU, memory, and request metrics
   - Free tier: 500 compute hours/month (plenty for MVP)

## Cost Estimate

- **Railway free tier**: 
  - $5 credits/month (enough for 100+ hours)
  - Perfect for MVP phase
  - Zero cost if under 10 hours/month

- **Paid tier** (when needed):
  - ~$5-10/month for small app
  - Upgrade when you need more compute

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Railway (steps above)
3. 📝 Share live URL with team
4. 🧪 Test all features on live URL
5. 📊 Monitor logs and performance
6. 🚀 Iterate and deploy improvements

## Local Testing Before Deploy

Test locally to catch issues early:

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
cd client && npm run build && cd ..

# Run server locally (serves built frontend)
npm start
# OR for development with hot reload:
npm run dev

# Open http://localhost:3000
```

## Monitoring Live App

### Via Railway Dashboard

1. Logs → View real-time server output
2. Metrics → CPU, memory, network usage
3. Alerts → Set up notifications for crashes

### Via CLI

```bash
railway logs
railway env
```

### Manual Health Check

```bash
curl https://your-app.railway.app/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Scaling to Production

When ready to go live:

1. **Add authentication** (currently none)
2. **Use PostgreSQL** instead of SQLite
3. **Enable HTTPS** (Railway does this automatically)
4. **Set up monitoring** (Sentry, DataDog, etc.)
5. **Increase compute** (move from shared to dedicated)
6. **Optimize database** (add indexes, caching layer)

## Support & Docs

- Railway docs: https://railway.app/docs
- GitHub Pages: https://github.com
- Node.js: https://nodejs.org/docs

---

**Last Updated**: April 2026  
**Status**: MVP ready for Railway  
**Next Phase**: Performance optimization + production hardening
