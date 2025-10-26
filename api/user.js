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
    // POST - Create or update user
    if (req.method === 'POST') {
      const { clerkId, email } = req.body

      if (!clerkId) {
        return res.status(400).json({ error: 'Clerk ID required' })
      }

      const user = await dbQueries.createUser(clerkId, email)
      return res.status(200).json({ user })
    }

    // GET - Get user by Clerk ID
    if (req.method === 'GET') {
      const { clerkId } = req.query

      if (!clerkId) {
        return res.status(400).json({ error: 'Clerk ID required' })
      }

      const user = await dbQueries.getUserByClerkId(clerkId)
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({ user })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('User API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
