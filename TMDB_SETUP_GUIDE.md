# 🎬 TMDB API Setup Guide

## Step 1: Get Your TMDB API Key

### Create Account
1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Fill in:
   - Username
   - Password
   - Email
3. Verify your email

### Request API Key
1. Log in to TMDB
2. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
3. Click **"Create"** under "Request an API Key"
4. Choose **"Developer"**
5. Accept the terms
6. Fill in the form:
   - **Application Name**: Snuggleflix
   - **Application URL**: http://localhost:3000 (or your domain)
   - **Application Summary**: Personal Netflix clone for learning
7. Submit
8. Copy your **API Key (v3 auth)**

## Step 2: Add API Key to Your Project

### Option A: Using .env File (Recommended)

Create a `.env` file in the root directory:

```bash
# .env
VITE_TMDB_API_KEY=your_actual_api_key_here
```

**Replace `your_actual_api_key_here` with your real API key!**

Example:
```bash
VITE_TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Option B: Vercel Environment Variables

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: your_actual_api_key
4. Redeploy

## Step 3: Verify It Works

### Check Console
After adding the key, run:
```bash
npm run dev
```

You should see movies loading! If you see warnings:
```
⚠️ TMDB API Key not configured!
```
Then the key isn't set properly.

### Test in Browser
1. Open the app
2. Open browser console (F12)
3. Check for errors
4. You should see movies in the rows!

## Common Issues

### "API Key not configured" Warning
**Problem**: Movies not loading, warning in console

**Solution**:
- Make sure `.env` file is in the root directory (same level as `package.json`)
- File should be named exactly `.env` (not `.env.txt`)
- No spaces around the `=` sign
- Restart the dev server after creating `.env`

### "Invalid API Key" Error
**Problem**: Movies not loading, 401 error

**Solution**:
- Double-check you copied the entire API key
- Make sure there are no extra spaces
- Verify the key is active at TMDB settings

### Movies Still Not Loading
**Problem**: Everything seems right but no movies

**Solution**:
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

## API Key Format

Your API key should look like this:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

- 32 characters long
- Mix of letters and numbers
- All lowercase

## Security Notes

### For Development
- `.env` file is in `.gitignore` (safe)
- Never commit your API key to GitHub!

### For Production (Vercel)
- Add key in Vercel environment variables
- It's automatically secured
- Each environment can have different keys

## Testing the API

Want to test if your key works? Try this in browser:

```
https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY_HERE
```

Replace `YOUR_KEY_HERE` with your actual key. You should see JSON with movies!

## Rate Limits

TMDB Free Tier:
- **40 requests per 10 seconds**
- **Unlimited daily requests**
- More than enough for personal use!

## Example .env File

Complete example:

```bash
# TMDB API Configuration
# Get your key at: https://www.themoviedb.org/settings/api
VITE_TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Optional: Real-Debrid API Token
# Get from: https://real-debrid.com/apitoken
# (Stored in browser, not needed in .env)

# Optional: For future features
# VITE_API_URL=http://localhost:3000
```

## Checklist

- [ ] Created TMDB account
- [ ] Verified email
- [ ] Requested API key (Developer)
- [ ] Copied API key
- [ ] Created `.env` file in root directory
- [ ] Added `VITE_TMDB_API_KEY=your_key`
- [ ] Restarted dev server
- [ ] Movies are loading!

## Still Having Issues?

Check these files are correct:

### src/services/api.js
Should have this line:
```javascript
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'
```

### .env
Should be in root, not in `src/`:
```
Snuggleflix/
├── .env          ← HERE!
├── src/
├── package.json
└── ...
```

## Quick Test

Run this to check if everything is working:

```bash
# In your terminal
npm run dev
```

Then check the console. You should see movies data being fetched!

## Success!

Once working, you'll see:
- ✅ Movies in "Trending Now"
- ✅ TV Shows loading
- ✅ Search working
- ✅ No console errors
- ✅ Movie posters displaying

## Need More Help?

1. Check the console for specific errors
2. Verify your API key at TMDB settings
3. Make sure `.env` file format is correct
4. Try restarting the dev server

---

**Happy Streaming! 🎬✨**
