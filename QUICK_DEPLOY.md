# ⚡ Quick Deploy to Vercel - snuggleflix.xyz

## 🎯 Super Fast Deployment (5 minutes)

### Step 1: Get Your TMDB API Key (1 min)
1. Go to https://www.themoviedb.org/settings/api
2. Sign up if needed
3. Request API key (Developer)
4. Copy the API key (v3 auth)

### Step 2: Deploy to Vercel (2 mins)

#### Option A: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `Arionyxx/Snuggleflix` from GitHub
4. Click "Deploy"

#### Option B: Using CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Step 3: Add Environment Variables (1 min)

In Vercel Project Settings → Environment Variables, add:

```bash
VITE_TMDB_API_KEY=your_tmdb_key_here
```

Then redeploy (it will auto-redeploy when you save env vars).

### Step 4: Configure Custom Domain (1 min)

1. In Vercel: Project Settings → Domains
2. Add: `snuggleflix.xyz`
3. Copy the DNS records shown

### Step 5: Update DNS Records

At your domain provider (where you bought snuggleflix.xyz):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME (for www):**
```
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

Wait 5-60 minutes for DNS propagation.

## ✅ That's It!

Your site will be live at: **https://snuggleflix.xyz**

## 🎨 Current Features (Working Locally)

✅ **Movies & TV Shows** - Browse trending content  
✅ **Search** - Find anything instantly  
✅ **Video Player** - Multiple streaming sources  
✅ **Watchlist** - Click hearts to save favorites  
✅ **Continue Watching** - Pick up where you left off  
✅ **Local Storage** - Works without account  

## 📦 Optional: Add Database (Later)

For cloud sync across devices, follow `DEPLOYMENT.md` to add:
- NeonDB database
- Clerk authentication
- Cloud watchlist sync

But the app works perfectly with local storage for now!

## 🔧 Troubleshooting

### Build Failed?
- Check TMDB API key is added to Vercel env vars
- Ensure all files are pushed to GitHub
- Check Vercel build logs

### Movies Not Loading?
- Verify TMDB API key is correct
- Check browser console for errors
- Make sure env var name is `VITE_TMDB_API_KEY` (with VITE_ prefix)

### Domain Not Working?
- Wait for DNS propagation (5-60 mins)
- Verify DNS records are correct
- Check Vercel domains page for status

## 🎉 Success Checklist

- [ ] Vercel deployment successful
- [ ] TMDB API key added
- [ ] Movies loading on deployed site
- [ ] Search works
- [ ] Video player opens
- [ ] Watchlist works (locally)
- [ ] Continue watching appears
- [ ] DNS configured for snuggleflix.xyz
- [ ] Site accessible at your domain

## 💡 Pro Tips

1. **TMDB Key**: Keep it in Vercel env vars only, not in code
2. **Local Testing**: Use `npm run dev` before deploying
3. **Updates**: Just push to GitHub, Vercel auto-deploys
4. **Monitoring**: Check Vercel Analytics for traffic

## 📞 Need Help?

Check:
1. Vercel deployment logs
2. Browser console (F12)
3. Network tab for API errors
4. DEPLOYMENT.md for detailed guide

Enjoy your snuggleflix! 🍿💖
