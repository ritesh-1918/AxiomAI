# 🚀 AxiomAI Vercel Deployment Guide

## Quick Overview

**Time Required**: ~5 minutes  
**What You'll Deploy**: Frontend dashboard with authentication  
**Final URL**: `https://axiomai1918.vercel.app` (Your deployed site)

---

## Prerequisites

- [x] GitHub account with AxiomAI repository
- [x] Vercel account (free) - [Sign up here](https://vercel.com/signup)
- [x] Supabase project (optional but recommended for auth)

---

## Step 1: Import Repository to Vercel

### 1.1 Go to Vercel Dashboard

Visit: [https://vercel.com/new](https://vercel.com/new)

### 1.2 Import Your GitHub Repository

1. Click **"Add New Project"**
2. Click **"Import Git Repository"**
3. If not connected, click **"Connect GitHub"** and authorize Vercel
4. Find your repository: **`ritesh-1918/AxiomAI`**
5. Click **"Import"**

---

## Step 2: Configure Project Settings

### 2.1 Project Settings

- **Framework Preset**: `Other` (or leave as detected)
- **Root Directory**: `./` (keep default)
- **Build Command**: Leave empty (static site)
- **Output Directory**: `frontend` 
- **Install Command**: Leave empty

### 2.2 Environment Variables (Optional)

If you want to use environment variables:

1. Click **"Environment Variables"**
2. Add these (optional):
   ```
   SUPABASE_URL = https://dtslwolgtskxqtutschk.supabase.co
   SUPABASE_ANON_KEY = sb_publishable_h0HiuuGzwqivU4NhjjGGhA_r7a0SmBo
   ```

**Note**: These are already hardcoded in the frontend, so environment variables are optional.

---

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes for build to complete
3. You'll see: ✅ **"Deployment Successful"**

---

## Step 4: Access Your Deployed Site

### Your URLs

Vercel will provide:
- **Production**: `https://axiom-ai-xxxx.vercel.app`
- **Preview**: Unique URLs for each commit

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Step 5: Verify Deployment

### Test These Pages

1. **Landing Page**: `https://your-site.vercel.app/`
2. **Login**: `https://your-site.vercel.app/login.html`
3. **Dashboard**: `https://your-site.vercel.app/dashboard.html`

### Test API Connection

1. Go to Dashboard
2. Enter a test prompt
3. Click "Route Request"
4. Should connect to: `https://ritesh1918-axiom-backend.hf.space`

---

## Step 6: Configure Auto-Deployments

Vercel automatically deploys when you push to GitHub:

### Main Branch (Production)
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
→ Deploys to production URL

### Preview Deployments
- Every commit gets a unique preview URL
- Perfect for testing before merging

---

## Common Issues & Fixes

### Issue 1: 404 Not Found

**Problem**: Routes not working  
**Solution**: Vercel uses `frontend/` as root. All paths are correct.

### Issue 2: API Connection Failed

**Problem**: Can't connect to backend  
**Solution**: Check `frontend/js/dashboard.js` line 1:
```javascript
const API_URL = 'https://ritesh1918-axiom-backend.hf.space';
```

### Issue 3: Supabase Errors

**Problem**: Authentication not working  
**Solution**: 
1. Verify Supabase URL in `frontend/js/supabase.js`
2. Run database schema in Supabase SQL Editor
3. Check database is online

### Issue 4: Styles Not Loading

**Problem**: CSS missing  
**Solution**: Hard refresh browser (Ctrl + Shift + R)

---

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Login page accessible
- [ ] Dashboard shows after login
- [ ] Prompt routing works
- [ ] Supabase authentication functional
- [ ] Chrome extension connects to API

---

## Update Your Backend CORS (If Needed)

If you get CORS errors, your backend needs to allow your Vercel URL.

The backend already allows:
- `https://axiomai1918.vercel.app`
- `https://*.vercel.app` (all Vercel URLs)

If using a custom domain, update backend configuration.

---

## Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to **Project Settings** → **Analytics**
2. Enable Vercel Analytics
3. View traffic, performance, and vitals

### Custom Analytics

Add to `frontend/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
```

---

## Redeploy After Changes

### Method 1: Git Push (Recommended)
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Method 2: Vercel Dashboard
1. Go to **Deployments**
2. Click **"Redeploy"** on any deployment
3. Confirm

### Method 3: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## Environment Setup for Different Stages

### Development
- Local: `http://localhost:8001`
- Backend: `http://localhost:8000`

### Staging (Preview)
- Frontend: Vercel preview URL
- Backend: Same HuggingFace URL

### Production
- Frontend: `https://your-domain.vercel.app`
- Backend: `https://ritesh1918-axiom-backend.hf.space`

---

## Performance Optimization

### Already Optimized ✅
- Static site (fast CDN delivery)
- Vercel Edge Network
- Automatic image optimization
- Gzip compression

### Optional Improvements
1. **Service Worker**: Add for offline support
2. **Lazy Loading**: For images and charts
3. **Code Splitting**: If adding more JS

---

## Backup & Rollback

### Rollback to Previous Version

1. Go to **Deployments** tab
2. Find working deployment
3. Click **"︙"** → **"Promote to Production"**

### Download Current Deployment

1. Go to deployment
2. Click **"Download Source"**
3. Save as backup

---

## Security Best Practices

✅ **Already Implemented**:
- Supabase anon key (safe for frontend)
- HTTPS by default on Vercel
- CORS configured on backend
- Row-level security in Supabase

⚠️ **Don't Do This**:
- Never commit Supabase service role key to frontend
- Don't hardcode sensitive API keys
- Don't disable HTTPS

---

## Next Steps After Deployment

1. **Share Your Link**: `https://your-site.vercel.app`
2. **Monitor Usage**: Check Vercel Analytics
3. **Get Feedback**: Test with real users
4. **Iterate**: Push updates via GitHub

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **AxiomAI Docs**: See `docs/` folder in repo

---

## Summary

✅ **What You Deployed**:
- Frontend dashboard
- Authentication system
- Analytics interface
- Chrome extension integration

✅ **What's Running**:
- Frontend: Vercel (auto-deployed from GitHub)
- Backend: HuggingFace Spaces
- Database: Supabase

**Your site is LIVE! 🎉**

---

## Questions?

Check the README.md or documentation in the `docs/` folder.

Happy deploying! 🚀
