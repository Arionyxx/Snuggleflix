# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### TMDB API (Required)
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```
Get your key from: https://www.themoviedb.org/settings/api

### NeonDB Database (For user features)
```
DATABASE_URL=postgresql://user:password@your-neon-db.neon.tech/snuggleflix?sslmode=require
```
Get from: https://neon.tech

### Clerk Authentication (For user accounts)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
```
Get from: https://clerk.com

## Vercel Setup

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable above
4. Deploy!

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in your actual keys
3. Run `npm run dev`

## Testing Database

After deployment, visit:
```
https://snuggleflix.xyz/api/init-db
```

This will create the necessary database tables.
