import { handleCors } from '../_lib/cors.js'
import { requireAuth } from '../_lib/auth.js'
import { getFacebookOAuthUrl } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { state } = req.query
  const url = getFacebookOAuthUrl(
    process.env.FB_APP_ID,
    process.env.FB_REDIRECT_URI,
    state || user.id
  )
  res.json({ url })
}
