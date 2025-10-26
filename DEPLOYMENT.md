# 🚀 Deployment Guide - Snuggleflix

Complete guide to deploy Snuggleflix on **Vercel** with **NeonDB** and custom domain **snuggleflix.xyz**

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] NeonDB account (free)
- [ ] Clerk account for auth (free)
- [ ] Domain: snuggleflix.xyz
- [ ] TMDB API key

## Step 1: Set Up NeonDB

### 1.1 Create Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Click "Create Project"
4. Name it: `snuggleflix`
5. Choose region (closest to your users)
6. Copy the connection string

### 1.2 Connection String Format

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/snuggleflix?sslmode=require
```

Save this for later!

## Step 2: Set Up Clerk Authentication

### 2.1 Create Application

1. Go to [clerk.com](https://clerk.com)
2. Sign up / Log in
3. Create new application: "Snuggleflix"
4. Choose authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)

### 2.2 Get API Keys

1. Go to API Keys section
2. Copy:
   - Publishable Key (starts with `pk_`)
   - Secret Key (starts with `sk_`)

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `Arionyxx/Snuggleflix`
4. Click "Import"

### 3.2 Configure Project

**Framework Preset**: Vite
**Root Directory**: `./`
**Build Command**: `npm run build`
**Output Directory**: `dist`

### 3.3 Add Environment Variables

In Vercel project settings, add:

```bash
# TMDB API
VITE_TMDB_API_KEY=your_tmdb_key_here

# NeonDB
DATABASE_URL=postgresql://user:pass@host/snuggleflix?sslmode=require

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 3.4 Deploy

Click "Deploy" and wait for build to complete!

## Step 4: Configure Custom Domain

### 4.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add domain: `snuggleflix.xyz`
3. Add subdomain: `www.snuggleflix.xyz` (optional)

### 4.2 Update DNS Records

Go to your domain provider (where you bought snuggleflix.xyz) and add:

**For Root Domain (snuggleflix.xyz):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait 5-60 minutes for DNS propagation**

## Step 5: Initialize Database

### 5.1 Create Tables

Once deployed, visit:
```
https://snuggleflix.xyz/api/init-db
```

You should see:
```json
{
  "success": true,
  "message": "Database tables initialized successfully"
}
```

### 5.2 Verify Tables

The following tables should be created:
- `users` - User accounts
- `watchlist` - User watchlists
- `watch_history` - Viewing history & progress

## Step 6: Test Everything

### 6.1 Test Homepage
Visit: https://snuggleflix.xyz

Should show:
- ✅ Movies loading
- ✅ Search working
- ✅ Video player opening

### 6.2 Test Authentication
- ✅ Sign up button working
- ✅ Login working
- ✅ User profile showing

### 6.3 Test Features
- ✅ Add to watchlist
- ✅ Watch a movie
- ✅ Continue watching appears
- ✅ Watch history tracking

## 🎯 Quick Deployment Commands

### Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔧 Troubleshooting

### Build Fails

**Issue**: Build fails with module errors

**Solution**:
```bash
# Locally test build
npm run build

# If successful, push to trigger redeploy
git push origin main
```

### Database Connection Fails

**Issue**: Cannot connect to NeonDB

**Solution**:
- Verify `DATABASE_URL` in Vercel env vars
- Check if IP is whitelisted in NeonDB
- Ensure `?sslmode=require` is in connection string

### Domain Not Working

**Issue**: Domain shows 404 or not found

**Solution**:
- Wait for DNS propagation (up to 48h, usually 5-60 min)
- Verify DNS records are correct
- Check Vercel domain status

### API Routes Not Working

**Issue**: `/api/*` routes return 404

**Solution**:
- Ensure `vercel.json` exists in root
- Check `api/` folder is committed to git
- Redeploy from Vercel dashboard

### Environment Variables Not Loading

**Issue**: Features not working, API errors

**Solution**:
1. Go to Vercel → Project Settings → Environment Variables
2. Verify all variables are set
3. Redeploy (important - changes require redeploy)

## 📊 Post-Deployment Checklist

- [ ] Homepage loads at snuggleflix.xyz
- [ ] Movies display correctly
- [ ] Search functionality works
- [ ] Video player opens and plays
- [ ] Authentication works
- [ ] Watchlist can be added/removed
- [ ] Continue watching appears
- [ ] Database tables created
- [ ] All API routes respond
- [ ] Mobile responsive
- [ ] HTTPS certificate valid
- [ ] Custom domain working

## 🎨 Optional Enhancements

### Analytics
Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

### Performance
- Enable Vercel Speed Insights
- Add caching headers
- Optimize images

### Monitoring
- Set up Vercel monitoring
- Add error tracking (Sentry)
- Monitor database usage

## 🔄 Continuous Deployment

Every push to `main` branch will automatically:
1. ✅ Build the project
2. ✅ Run tests (if configured)
3. ✅ Deploy to production
4. ✅ Update snuggleflix.xyz

## 💰 Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month (Free)
- **NeonDB**: 0.5GB storage, 10GB data transfer (Free)
- **Clerk**: 5,000 MAU (Free)

### Paid Options (If Needed):
- **Vercel Pro**: $20/month - More bandwidth
- **NeonDB Pro**: $19/month - More storage
- **Clerk Pro**: $25/month - More users

## 📝 Environment Variables Reference

### Production (.env.production)
```bash
VITE_TMDB_API_KEY=xxx
DATABASE_URL=postgresql://xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
VITE_API_URL=https://snuggleflix.xyz/api
```

### Development (.env)
```bash
VITE_TMDB_API_KEY=xxx
DATABASE_URL=postgresql://xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
VITE_API_URL=http://localhost:3000/api
```

## 🎉 Success!

Your Snuggleflix app is now live at:
🌐 **https://snuggleflix.xyz**

Enjoy your cozy movie nights! 🍿💖

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review NeonDB connection status
3. Verify all environment variables
4. Check browser console for errors

Happy deploying! ✨
