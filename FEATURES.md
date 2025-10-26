# ✨ Snuggleflix Features

## 🎬 Core Features

### Browse Movies & TV Shows
- **Trending Now** - Weekly trending movies
- **Popular TV Shows** - Most popular series
- **Popular Movies** - Top-rated films
- **Beautiful Cards** - Hover effects with glowing borders
- **Ratings & Year** - Quick info at a glance

### Search
- **Real-time Search** - Instant results as you type
- **Multi-content** - Search both movies and TV shows
- **Grid Layout** - Beautiful search results display
- **No Results Message** - Helpful when nothing found

### Video Player
- **Embedded Player** - Watch directly in the app
- **Multiple Sources** - 4 free streaming options:
  - VidSrc (primary)
  - VidSrc Pro (backup)
  - SuperEmbed (multi-source)
  - 2Embed (reliable)
- **Source Switching** - Try different sources instantly
- **Copy Stream URL** - Share with Real-Debrid or external players
- **Open in New Tab** - Watch in full browser
- **Real-Debrid Integration** - Premium streaming support

### Watchlist 💖
- **Heart Button** - Click to add/remove from watchlist
- **Hover to Show** - Heart appears on card hover
- **Always Visible** - Heart stays visible when movie is in watchlist
- **Quick Access** - Button in navbar to view all
- **Beautiful Modal** - Full-screen watchlist view
- **Remove Option** - Easy removal from watchlist
- **Local Storage** - Saved in your browser
- **Persistent** - Survives browser refresh

### Continue Watching ⏯️
- **Auto-tracking** - Every movie you watch is tracked
- **Progress Saved** - Remembers where you left off
- **Smart Row** - Appears only when you have progress
- **< 90% Rule** - Shows movies you haven't finished
- **Latest First** - Most recent at the top
- **Seamless** - Click to continue exactly where you left off

### Watch History 📊
- **Automatic** - Every watch is logged
- **Last 50 Items** - Recent viewing history
- **Timestamp** - When you watched each item
- **Progress Tracking** - How far you watched (0-100%)
- **Quick Restart** - Click to watch again

## 🎨 Design Features

### Cozy Aesthetic
- **Color Palette**:
  - Pink: `#ff6b9d` (Primary)
  - Purple: `#c06cff` (Secondary)
  - Blue: `#6cd8ff` (Accent)
  - Dark gradients for backgrounds
- **Soft Gradients** - Beautiful blended colors
- **Glowing Effects** - Subtle animations on hover
- **Smooth Transitions** - Butter-smooth animations
- **Custom Scrollbar** - Themed pink scrollbar

### Animations
- **Fade-in** - Content gracefully appears
- **Slide-in** - Rows slide into view
- **Hover Effects**:
  - Cards scale and lift (3D effect)
  - Glowing borders appear
  - Play button emerges
  - Heart button shows
- **Glow Animation** - Logo pulses gently
- **Rotate on Hover** - Settings gear spins

### Movie Cards
- **3D Transform** - Scales 1.08x and lifts 10px
- **Glowing Border** - Pink glow on hover
- **Overlay** - Gradient overlay with play button
- **Heart Button** - Top-right corner, circular
- **Poster Image** - High-quality from TMDB
- **Rating Star** - Gold star with score
- **Year Badge** - Release/air date
- **Responsive** - Adapts to screen size

### Hero Section
- **Full-width Banner** - Featured movie backdrop
- **Random Selection** - Different movie each visit
- **Gradient Overlay** - Text readable over image
- **Play Button** - Large, prominent CTA
- **Info Button** - More details (coming soon)
- **Rating Display** - Star rating with year
- **Truncated Description** - Max 300 characters

### Navbar
- **Sticky Header** - Always visible on scroll
- **Glassmorphism** - Blur effect behind navbar
- **Search Bar** - Center position, prominent
- **Watchlist Button** - Quick access to saved movies
- **Settings Button** - Configuration options
- **Logo Animation** - Glowing heart icon
- **Mobile Friendly** - Collapses on small screens

## 🛠️ Technical Features

### Performance
- **Vite Build** - Lightning-fast development
- **React 18+** - Latest React features
- **Code Splitting** - Potential for optimization
- **Lazy Loading** - Can be added for images
- **Smooth Scrolling** - Hardware-accelerated CSS
- **Optimized Images** - TMDB CDN delivery

### Responsive Design
- **Mobile First** - Works on all devices
- **Breakpoints**:
  - Desktop: 1024px+
  - Tablet: 768px-1023px
  - Mobile: < 768px
- **Touch Friendly** - Large buttons, easy taps
- **Swipe Scrolling** - Natural on mobile
- **Adaptive Grid** - Auto-adjusts card sizes

### Data Management
- **Local Storage** - Browser-based persistence
- **User Service** - Centralized data management
- **Auto-save** - Changes saved immediately
- **Guest Mode** - No account needed
- **Privacy First** - Data stays on your device

### API Integration
- **TMDB API** - Movie and TV data
- **Multiple Endpoints**:
  - Trending movies
  - Trending TV shows
  - Popular movies
  - Multi-search
  - Images (posters, backdrops)
- **Error Handling** - Graceful failures
- **Fallback Images** - Placeholder when no poster

### Streaming
- **Multiple Providers** - 4 free sources built-in
- **Source Switching** - One-click change
- **Copy URL Feature** - For external use
- **Real-Debrid Ready** - Premium integration
- **Iframe Embedding** - Standard player
- **Fullscreen Support** - Native browser fullscreen

## 🔮 Future Features (Potential)

### User Accounts (Optional)
- [ ] Clerk authentication
- [ ] User profiles
- [ ] Cloud sync watchlist
- [ ] Cross-device progress
- [ ] Social features

### Enhanced Discovery
- [ ] Recommendations based on history
- [ ] Similar movies section
- [ ] Genre filters
- [ ] Sort options
- [ ] Advanced search filters

### Video Features
- [ ] Trailer previews
- [ ] Multiple quality options
- [ ] Subtitle support
- [ ] Picture-in-picture
- [ ] Keyboard shortcuts

### TV Show Specific
- [ ] Season/episode selection
- [ ] Next episode auto-play
- [ ] Episode progress tracking
- [ ] Binge-watching mode

### Social Features
- [ ] Share watchlist with friends
- [ ] Watch party mode
- [ ] Comments/reviews
- [ ] Ratings

### Content Features
- [ ] Cast & crew information
- [ ] Movie details page
- [ ] Reviews aggregation
- [ ] Related content
- [ ] Top 10 lists

### Technical Improvements
- [ ] PWA support (offline mode)
- [ ] Dark/light theme toggle
- [ ] Accessibility improvements
- [ ] Analytics integration
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

## 📊 Current Stats

- **Components**: 7 React components
- **Services**: 3 (API, Real-Debrid, User)
- **API Routes**: 4 (ready for backend)
- **Streaming Sources**: 4 free providers
- **Storage**: LocalStorage (client-side)
- **Authentication**: Guest mode (account-ready)
- **Database**: Schema ready for NeonDB

## 💪 What Makes It Special

### 1. Cozy Aesthetic
Unlike other streaming clones, Snuggleflix has a unique pink/purple theme perfect for movie nights. It's warm, inviting, and designed for comfort.

### 2. Copy Stream URL
Unique feature that lets you copy streaming URLs for use with:
- Real-Debrid
- VLC Player
- External video players
- Download managers

### 3. No Account Required
Works perfectly without signup. Your watchlist and history are saved locally. Account features are optional for cloud sync.

### 4. Multiple Sources
Built-in fallbacks if one source fails. Just click to switch providers.

### 5. Beautiful UI
Every detail designed for delight:
- Smooth animations
- 3D card effects
- Glowing borders
- Perfect spacing
- Thoughtful interactions

### 6. Privacy Focused
- No tracking
- No ads
- Data stays local
- Optional cloud sync
- No third-party analytics (unless you add them)

## 🎯 Use Cases

### Perfect For:
1. **Movie Night with BF/GF** 💑
   - Romantic aesthetic
   - Easy browsing together
   - Watchlist for planning

2. **Friend Group Parties** 👯
   - Quick movie discovery
   - Multiple streaming sources
   - Easy URL sharing

3. **Solo Binge-watching** 🛋️
   - Continue watching feature
   - Personal watchlist
   - Progress tracking

4. **Content Discovery** 🔍
   - Trending content
   - Search functionality
   - Ratings at a glance

5. **Learning Project** 🎓
   - React best practices
   - API integration
   - Responsive design
   - State management

## 🚀 Getting Started

See `README.md` for quick start  
See `SETUP.md` for detailed guide  
See `DEPLOYMENT.md` for production deploy  
See `QUICK_DEPLOY.md` for fastest deploy  

Enjoy your cozy movie nights! 🍿💖
