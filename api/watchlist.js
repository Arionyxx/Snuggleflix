import { dbQueries } from './db.js'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' })
    }

    // GET - Get user's watchlist
    if (req.method === 'GET') {
      const watchlist = await dbQueries.getWatchlist(parseInt(userId))
      return res.status(200).json({ watchlist })
    }

    // POST - Add to watchlist
    if (req.method === 'POST') {
      const { movieId, movieType, title, posterPath } = req.body

      if (!movieId || !movieType) {
        return res.status(400).json({ error: 'Movie ID and type required' })
      }

      const item = await dbQueries.addToWatchlist(
        parseInt(userId),
        movieId,
        movieType,
        title,
        posterPath
      )

      return res.status(201).json({ item })
    }

    // DELETE - Remove from watchlist
    if (req.method === 'DELETE') {
      const { movieId, movieType } = req.body

      if (!movieId || !movieType) {
        return res.status(400).json({ error: 'Movie ID and type required' })
      }

      await dbQueries.removeFromWatchlist(
        parseInt(userId),
        movieId,
        movieType
      )

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Watchlist API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
