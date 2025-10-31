# 📸 How to Generate OG Image for SnuggleFlix

Since social media platforms don't support SVG images for embeds, we need to create a PNG version of the OG image.

## 🎯 Quick Method: Using Browser Screenshot

### Option 1: Browser Screenshot (Easiest)

1. **Open the OG image HTML:**
   - Open `og-image.html` in your browser
   - The page is already sized to 1200x630px

2. **Take a screenshot:**
   
   **Windows (Edge/Chrome):**
   - Press `F12` to open DevTools
   - Press `Ctrl + Shift + P`
   - Type "screenshot"
   - Select "Capture full size screenshot"
   - Save as `og-image.png`

   **Firefox:**
   - Press `Shift + F2`
   - Type `screenshot --fullpage og-image.png`
   - Press Enter

3. **Save the file:**
   - Rename to `og-image.png`
   - Place it in the same folder as `index.html`

---

## 🖥️ Option 2: Online Screenshot Tool

1. **Go to:** https://www.screely.com/ or https://screenshotone.com/
2. **Upload** `og-image.html` or enter the local file path
3. **Download** as PNG (1200x630)
4. **Save** as `og-image.png`

---

## 🚀 Option 3: Use Cloudinary/Imgur (Fastest)

If you don't want to create the image yourself:

1. **Use a placeholder service temporarily:**
   - Update `index.html` meta tags to use:
   ```html
   <meta property="og:image" content="https://via.placeholder.com/1200x630/1e1e2e/cba6f7?text=SnuggleFlix+%E2%98%95" />
   ```

2. **Or use Imgur:**
   - Upload any image to https://imgur.com/
   - Use the direct link in meta tags

---

## ✅ After Creating PNG:

1. **Add to git:**
   ```bash
   git add og-image.png
   git commit -m "Add OG image for social media embeds"
   git push
   ```

2. **Update meta tags in index.html:**
   - Change from `og-image.svg` to `og-image.png`
   - Already done! ✅

3. **Test the embed:**
   - Share your URL on Discord
   - Use: https://www.opengraph.xyz/ to preview
   - Or use Discord's embed tester

---

## 🎨 Quick Fix: Use GitHub Raw Link

Since you have `og-image.html`, you can:

1. Push `og-image.html` to GitHub
2. Use GitHub Pages or:
3. Take screenshot locally and upload `og-image.png`

---

## 📝 Current Status:

- ✅ `og-image.html` - Ready to screenshot
- ✅ `og-image.svg` - Not supported by social media
- ⏳ `og-image.png` - Needs to be created (follow steps above)

---

## 🔧 Alternative: Use Vercel OG Image Generation

Create `api/og.jsx` (if you want dynamic):

```javascript
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div style={{ /* your styles */ }}>
        SnuggleFlix
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

But for now, **just screenshot `og-image.html`** and save as PNG! 📸