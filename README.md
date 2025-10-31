# 🎬 SnuggleFlix - Netflix-like Streaming Website

A beautiful, modern streaming website built with **Catppuccin Mocha** theme and powered by **TMDB API**.

🌐 **Live at:** [snuggleflix.xyz](https://snuggleflix.xyz)

![Catppuccin Theme](https://img.shields.io/badge/theme-catppuccin-mauve)

## ✨ Features

- 🎨 Beautiful Catppuccin Mocha color scheme
- 🎬 Real movie data from TMDB API
- 🔍 Search functionality
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions
- 🎯 Multiple content categories (Trending, Top 10, Sci-Fi, Drama, Action, Anime)
- 📽️ Detailed movie modals with cast, director, and runtime info
- 🖼️ High-quality movie posters and backdrops
- ⌨️ Keyboard navigation support

## 🚀 Setup Instructions

### Step 1: Get Your Free TMDB API Read Access Token

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or log in
3. Go to your account settings: https://www.themoviedb.org/settings/api
4. Request an API key (choose "Developer" option)
5. Fill out the form (you can use personal/educational purpose)
6. **Copy your API Read Access Token** (the LONG Bearer token, not the short API key!)

### Step 2: Add Your API Read Access Token

1. Open `script.js` in a text editor
2. Find this line at the top:
   ```javascript
   const TMDB_API_READ_ACCESS_TOKEN = "YOUR_API_READ_ACCESS_TOKEN_HERE";
   ```
3. Replace `YOUR_API_READ_ACCESS_TOKEN_HERE` with your actual Bearer token:
   ```javascript
   const TMDB_API_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9..."; // Your long token here
   ```
4. Save the file

> **⚠️ Important:** Use the **API Read Access Token** (long Bearer token), NOT the short API key!

### Step 3: Run the Website

Simply open `index.html` in your web browser!

## 🎨 Catppuccin Colors Used

This project uses the **Catppuccin Mocha** palette:

- **Base**: `#1e1e2e` - Dark background
- **Mantle**: `#181825` - Darker background
- **Crust**: `#11111b` - Darkest background
- **Mauve**: `#cba6f7` - Primary accent
- **Lavender**: `#b4befe` - Secondary accent
- **Pink**: `#f5c2e7` - Tertiary accent
- **Blue**: `#89b4fa` - Info color
- **Text**: `#cdd6f4` - Primary text

## 📁 Project Structure

```
snuggleflix/
├── index.html          # Main HTML structure
├── styles.css          # Catppuccin-themed styles
├── script.js           # TMDB API integration & interactivity
└── README.md           # This file
```

## 🎯 API Endpoints Used

- `/trending/all/week` - Trending content
- `/movie/top_rated` - Top rated movies
- `/discover/movie` - Discover movies by genre
- `/search/multi` - Search functionality
- `/movie/{id}` - Movie details
- `/movie/{id}/credits` - Cast and crew info

## 🎮 Usage

### Navigation
- **Scroll** through different content categories
- **Click** on any movie card to see details
- **Search** for specific titles using the search icon
- **Arrow buttons** to scroll through content rows

### Keyboard Shortcuts
- `Arrow Left/Right` - Navigate between cards
- `Enter` - Open movie details
- `Escape` - Close modal

## 🌟 Categories

1. **Trending Now** - Most popular content this week
2. **Top 10** - Top rated movies with rank numbers
3. **Sci-Fi Adventures** - Science fiction films
4. **Award-Winning Drama** - Highly rated dramas
5. **Action & Thrillers** - High-octane action movies
6. **Popular Anime** - Animated films and series

## 🔧 Customization

### Change Theme Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --ctp-base: #1e1e2e;
    --ctp-mauve: #cba6f7;
    /* ... other colors */
}
```

### Add More Categories
In `script.js`, add to the `categories` array in `populateRows()`:
```javascript
{
    selector: "horror",
    endpoint: "/discover/movie",
    params: "&with_genres=27&sort_by=popularity.desc"
}
```

Then add the corresponding HTML row in `index.html`.

## 🐛 Troubleshooting

### Movies not loading?
- Check if your API Read Access Token is correctly set in `script.js`
- Open browser console (F12) to see error messages
- Verify your internet connection

### API Token Error?
- Make sure you're using the **API Read Access Token** (long Bearer token), not the short API key
- Check that there are no extra spaces in the token string
- Verify your TMDB account is activated
- The token should start with "eyJh..." and be very long

## 📝 License

SnuggleFlix is a personal project for educational purposes. 
Movie data and images are provided by [TMDB](https://www.themoviedb.org/).

**Domain:** snuggleflix.xyz

---

Made with 💜 by SnuggleFlix using [Catppuccin](https://github.com/catppuccin/catppuccin) theme