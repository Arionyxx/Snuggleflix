import { neon } from '@neondatabase/serverless'

// Initialize Neon connection
export const sql = neon(process.env.DATABASE_URL)

// Database queries
export const dbQueries = {
  // Create tables if they don't exist
  async initTables() {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS watchlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        movie_type TEXT NOT NULL,
        title TEXT,
        poster_path TEXT,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, movie_id, movie_type)
      )
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        movie_type TEXT NOT NULL,
        title TEXT,
        poster_path TEXT,
        progress INTEGER DEFAULT 0,
        last_watched TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, movie_id, movie_type)
      )
    `
  },

  // User operations
  async createUser(clerkId, email) {
    const result = await sql`
      INSERT INTO users (clerk_id, email)
      VALUES (${clerkId}, ${email})
      ON CONFLICT (clerk_id) DO UPDATE SET email = ${email}
      RETURNING *
    `
    return result[0]
  },

  async getUserByClerkId(clerkId) {
    const result = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `
    return result[0]
  },

  // Watchlist operations
  async addToWatchlist(userId, movieId, movieType, title, posterPath) {
    const result = await sql`
      INSERT INTO watchlist (user_id, movie_id, movie_type, title, poster_path)
      VALUES (${userId}, ${movieId}, ${movieType}, ${title}, ${posterPath})
      ON CONFLICT (user_id, movie_id, movie_type) DO NOTHING
      RETURNING *
    `
    return result[0]
  },

  async removeFromWatchlist(userId, movieId, movieType) {
    await sql`
      DELETE FROM watchlist 
      WHERE user_id = ${userId} 
      AND movie_id = ${movieId} 
      AND movie_type = ${movieType}
    `
  },

  async getWatchlist(userId) {
    const result = await sql`
      SELECT * FROM watchlist 
      WHERE user_id = ${userId}
      ORDER BY added_at DESC
    `
    return result
  },

  async isInWatchlist(userId, movieId, movieType) {
    const result = await sql`
      SELECT id FROM watchlist 
      WHERE user_id = ${userId} 
      AND movie_id = ${movieId} 
      AND movie_type = ${movieType}
    `
    return result.length > 0
  },

  // Watch history operations
  async updateWatchProgress(userId, movieId, movieType, title, posterPath, progress) {
    const result = await sql`
      INSERT INTO watch_history (user_id, movie_id, movie_type, title, poster_path, progress)
      VALUES (${userId}, ${movieId}, ${movieType}, ${title}, ${posterPath}, ${progress})
      ON CONFLICT (user_id, movie_id, movie_type) 
      DO UPDATE SET progress = ${progress}, last_watched = NOW()
      RETURNING *
    `
    return result[0]
  },

  async getWatchHistory(userId) {
    const result = await sql`
      SELECT * FROM watch_history 
      WHERE user_id = ${userId}
      ORDER BY last_watched DESC
      LIMIT 20
    `
    return result
  },

  async getContinueWatching(userId) {
    const result = await sql`
      SELECT * FROM watch_history 
      WHERE user_id = ${userId} AND progress < 90
      ORDER BY last_watched DESC
      LIMIT 10
    `
    return result
  }
}
