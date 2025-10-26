# 🛠️ Snuggleflix Setup Guide

## Step-by-Step Setup Instructions

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

### 2. Installation

```bash
# Clone or download the repository
cd Snuggleflix

# Install dependencies
npm install
```

### 3. Get Your TMDB API Key

**TMDB (The Movie Database)** provides all the movie and TV show data.

1. Go to [TMDB Website](https://www.themoviedb.org/)
2. Create a free account (click "Join TMDB")
3. Verify your email
4. Go to [API Settings](https://www.themoviedb.org/settings/api)
5. Click "Create" under "Request an API Key"
6. Select "Developer"
7. Accept the terms
8. Fill in the application form:
   - **Type**: Website
   - **URL**: http://localhost:3000
   - **Description**: Personal project for learning
9. Submit and copy your API Key (v3 auth)

### 4. Configure the API Key

Open `src/services/api.js` and replace the placeholder:

```javascript
// Find this line:
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'

// Replace with your actual key:
const TMDB_API_KEY = 'abcd1234efgh5678ijkl9012mnop3456'
```

### 5. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🔐 Real-Debrid Setup (Optional)

Real-Debrid provides premium, ad-free streaming links.

### What is Real-Debrid?

Real-Debrid is a premium downloader service that:
- Converts links to direct streaming/download links
- Removes speed limits
- Provides ad-free experience
- Offers better video quality

### Setup Real-Debrid

1. **Get a Real-Debrid Account**
   - Visit [real-debrid.com](https://real-debrid.com/)
   - Sign up for an account
   - Subscribe to a plan (starts at ~€3/month)

2. **Get Your API Token**
   - Log in to Real-Debrid
   - Go to [API Token Page](https://real-debrid.com/apitoken)
   - Click "Generate" if you don't have a token
   - Copy your API token

3. **Add Token in Snuggleflix**
   - Open any movie in Snuggleflix
   - Click "Setup Real-Debrid" button
   - Paste your API token
   - Click "Save Token"
   - The token is saved locally in your browser

### Using Real-Debrid with Snuggleflix

**Method 1: Direct Streaming**
- The app will automatically use Real-Debrid if configured
- Better quality and no ads

**Method 2: Copy Stream URL**
1. Open any movie
2. Click "Copy Stream URL"
3. Use the URL with:
   - Real-Debrid's "Unrestrict Link" feature
   - VLC Media Player
   - Any video player that supports streaming

## 🎬 Streaming Sources Explained

### Free Sources (No Account Needed)

1. **VidSrc** (Default)
   - Good quality
   - May have ads
   - Usually reliable

2. **VidSrc Pro**
   - Alternative VidSrc server
   - Good backup option

3. **SuperEmbed**
   - Multi-source aggregator
   - Tries multiple sources automatically

4. **2Embed**
   - Reliable backup
   - Wide content library

### Premium Sources (With Real-Debrid)

- Ad-free streaming
- Better quality (up to 1080p/4K)
- Faster loading
- More reliable

## 🔧 Advanced Configuration

### Adding Custom Streaming Sources

Edit `src/services/api.js`:

```javascript
export const getAlternativeStreamUrls = (movie) => {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const id = movie.id
  
  return [
    // Add your custom source here:
    {
      name: 'My Source',
      url: `https://my-streaming-site.com/embed/${type}/${id}`
    },
    // ... existing sources
  ]
}
```

### Customizing Colors

Edit CSS files to change the color scheme:

**Main Colors** (src/index.css):
```css
/* Primary pink */
--primary-color: #ff6b9d;

/* Secondary purple */
--secondary-color: #c06cff;

/* Accent blue */
--accent-color: #6cd8ff;

/* Background */
--bg-color: #1a1a2e;
```

### Changing Port

Edit `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Change to your preferred port
    open: true
  }
})
```

## 🐛 Troubleshooting

### Issue: No movies showing up

**Solution:**
- Verify TMDB API key is correct
- Check browser console for errors
- Make sure you have internet connection

### Issue: Videos not playing

**Solution:**
- Try different streaming sources
- Check if your region blocks certain sources
- Use VPN if needed
- Clear browser cache

### Issue: Search not working

**Solution:**
- Type at least 2 characters
- Wait a moment for results
- Check TMDB API key

### Issue: Real-Debrid not connecting

**Solution:**
- Verify API token is correct
- Check Real-Debrid subscription is active
- Try regenerating the token

### Issue: Build errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Setup

The app is fully responsive and works on mobile devices:

1. Run the dev server: `npm run dev`
2. Get your local IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
3. Access from mobile: `http://YOUR_IP:3000`

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npm run build
vercel --prod
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

**Note:** Remember to add your TMDB API key in the deployed environment!

## 💡 Tips

- **Bookmark Your Favorites**: Use browser bookmarks for quick access
- **Keyboard Shortcuts**: Most video players support spacebar for play/pause
- **Quality Settings**: Available in the video player controls
- **Subtitles**: Many sources provide subtitle options
- **Fullscreen**: Press F11 or use the fullscreen button

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [Real-Debrid API](https://api.real-debrid.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the README.md
3. Check browser console for errors
4. Verify all setup steps were completed

## 🎉 You're All Set!

Enjoy your cozy movie nights with Snuggleflix! 🍿✨
