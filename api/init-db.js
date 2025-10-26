import { dbQueries } from './db.js'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbQueries.initTables()
    return res.status(200).json({ 
      success: true, 
      message: 'Database tables initialized successfully' 
    })
  } catch (error) {
    console.error('Database init error:', error)
    return res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error.message 
    })
  }
}
