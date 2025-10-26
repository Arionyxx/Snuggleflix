import { dbQueries } from './db.js'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
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

    // GET - Get watch history or continue watching
    if (req.method === 'GET') {
      const { type } = req.query

      if (type === 'continue') {
        const continueWatching = await dbQueries.getContinueWatching(parseInt(userId))
        return res.status(200).json({ continueWatching })
      }

      const history = await dbQueries.getWatchHistory(parseInt(userId))
      return res.status(200).json({ history })
    }

    // POST - Update watch progress
    if (req.method === 'POST') {
      const { movieId, movieType, title, posterPath, progress } = req.body

      if (!movieId || !movieType || progress === undefined) {
        return res.status(400).json({ error: 'Movie ID, type, and progress required' })
      }

      const item = await dbQueries.updateWatchProgress(
        parseInt(userId),
        movieId,
        movieType,
        title,
        posterPath,
        progress
      )

      return res.status(200).json({ item })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('History API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
