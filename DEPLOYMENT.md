# 🚀 SnuggleFlix Deployment Guide

Complete guide to deploy SnuggleFlix to Vercel using GitHub.

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (free tier is fine)
- [x] Git installed on your computer
- [x] TMDB API Read Access Token

---

## 🎯 Step 1: Prepare Your TMDB API Key

1. Go to [TMDB Settings](https://www.themoviedb.org/settings/api)
2. Copy your **API Read Access Token** (the long Bearer token)
3. Keep it handy - you'll need it for Vercel

---

## 📦 Step 2: Push to GitHub

### Option A: Using Git Command Line

1. **Open terminal/command prompt** in your project folder:
   ```bash
   cd "F:\Useful tools and software\Fun Stuff\AI STUFF"
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Commit your changes:**
   ```bash
   git commit -m "Initial commit - SnuggleFlix 🎬"
   ```

5. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `snuggleflix`
   - Description: `🎬 Netflix-like streaming site with Catppuccin theme`
   - Make it **Public** or **Private** (your choice)
   - **DON'T** initialize with README, .gitignore, or license
   - Click **Create repository**

6. **Connect to GitHub and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/snuggleflix.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Option B: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. Click **File** → **Add Local Repository**
4. Choose your project folder
5. Click **Publish repository**
6. Name it `snuggleflix`
7. Click **Publish Repository**

---

## 🌐 Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**

2. **Sign in/Sign up:**
   - Click "Sign Up" if you don't have an account
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub

3. **Create New Project:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find your `snuggleflix` repository
   - Click "Import"

4. **Configure Project:**
   - **Project Name:** `snuggleflix` (or whatever you want)
   - **Framework Preset:** Leave as "Other"
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** Leave empty

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - **Name:** `TMDB_API_READ_ACCESS_TOKEN`
   - **Value:** Paste your TMDB API Read Access Token
   - Click "Add"

6. **Deploy:**
   - Click "Deploy"
   - Wait 30-60 seconds
   - Your site is live! 🎉

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd "F:\Useful tools and software\Fun Stuff\AI STUFF"
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **snuggleflix**
   - Which directory? **./
   - Want to override settings? **N**

5. **Add environment variable:**
   ```bash
   vercel env add TMDB_API_READ_ACCESS_TOKEN
   ```
   - Choose **Production**
   - Paste your TMDB API token
   - Press Enter

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🔗 Step 4: Connect Custom Domain (snuggleflix.xyz)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter: `snuggleflix.xyz`
   - Click "Add"

2. **Configure DNS (at your domain registrar):**
   
   Vercel will show you DNS records to add. You'll need to add:

   **For root domain (snuggleflix.xyz):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Alternative - Use Vercel Nameservers (Easier):**
   - Vercel will provide nameservers like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - Go to your domain registrar (where you bought snuggleflix.xyz)
   - Change nameservers to Vercel's nameservers
   - Wait 24-48 hours for DNS propagation

4. **Verify:**
   - Once DNS propagates, visit `https://snuggleflix.xyz`
   - Your site should load with SSL! 🎉

---

## 🔄 Updating Your Site

### After making changes:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```

2. **Vercel auto-deploys!**
   - Vercel automatically detects the push
   - Builds and deploys your changes
   - Takes ~30 seconds
   - Check your site at snuggleflix.xyz

---

## ⚙️ Important: Update API Key in Code

Before deploying, make sure your `script.js` has the API token placeholder:

```javascript
const TMDB_API_READ_ACCESS_TOKEN = "YOUR_API_READ_ACCESS_TOKEN_HERE";
```

**DO NOT** commit your actual API key to GitHub! 

Instead:
1. Keep the placeholder in GitHub
2. Add the real token as environment variable in Vercel
3. Or update `script.js` to read from environment (requires build step)

---

## 🎨 Vercel Dashboard Features

- **Analytics:** See visitor stats
- **Logs:** Debug issues
- **Deployments:** View history, rollback
- **Domains:** Manage custom domains
- **Environment Variables:** Update API keys
- **Preview Deployments:** Each PR gets a preview URL

---

## 🐛 Troubleshooting

### Movies not loading?
- Check Vercel logs for API errors
- Verify TMDB API token is correct
- Make sure token has "read" permissions

### Domain not working?
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Try clearing browser cache
- Visit https://dnschecker.org to check propagation

### Build failed?
- Check if all files are committed
- Verify vercel.json is present
- Check Vercel logs for specific errors

### Video not playing?
- This is normal - vidsrc.to availability varies by title
- Try different sources using "Change Source" button
- Some movies may not be available

---

## 📊 Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] Movies load from TMDB API
- [ ] Custom domain connected (snuggleflix.xyz)
- [ ] SSL certificate active (https://)
- [ ] Video player works
- [ ] Settings modal works
- [ ] Profile modal works
- [ ] Mobile responsive
- [ ] Search functionality works

---

## 🎉 You're Live!

Your SnuggleFlix site is now live at:
- **Vercel URL:** `https://snuggleflix.vercel.app`
- **Custom Domain:** `https://snuggleflix.xyz`

Share it with friends and enjoy! 🍿

---

## 📝 Quick Commands Reference

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/snuggleflix.git

# Make changes
git add .
git commit -m "Your change description"
git push

# Deploy with Vercel CLI
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls
```

---

## 💡 Tips

1. **Free Tier Limits:**
   - Vercel free tier: Unlimited bandwidth
   - No credit card required
   - Perfect for personal projects

2. **Automatic Deployments:**
   - Every push to `main` branch auto-deploys
   - Pull requests get preview URLs
   - Easy rollback if something breaks

3. **Performance:**
   - Vercel has global CDN
   - Fast loading worldwide
   - Automatic SSL/HTTPS

4. **Updates:**
   - Push to GitHub → Auto-deploy in 30 seconds
   - No manual upload needed

---

Made with 💜 by SnuggleFlix