import { handleCors } from '../_lib/cors.js'
import { requireAuth } from '../_lib/auth.js'
import { fetchUserPages } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { accessToken } = req.body
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' })

  try {
    const pages = await fetchUserPages(accessToken)
    res.json({ pages })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
