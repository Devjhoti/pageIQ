import { exchangeCodeForToken, getLongLivedToken } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { code, state, error } = req.query
  const clientUrl = process.env.CORS_ORIGIN || 'http://localhost:5175'

  if (error) {
    return res.redirect(`${clientUrl}/dashboard/new?fb_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return res.redirect(`${clientUrl}/dashboard/new?fb_error=no_code`)
  }

  try {
    const tokenData = await exchangeCodeForToken(
      code,
      process.env.FB_APP_ID,
      process.env.FB_APP_SECRET,
      process.env.FB_REDIRECT_URI
    )

    const longLivedToken = await getLongLivedToken(
      tokenData.access_token,
      process.env.FB_APP_ID,
      process.env.FB_APP_SECRET
    )

    res.redirect(
      `${clientUrl}/dashboard/new?fb_connected=true&fb_token=${encodeURIComponent(longLivedToken)}&state=${state}`
    )
  } catch (err) {
    console.error('FB OAuth callback error:', err.message)
    res.redirect(`${clientUrl}/dashboard/new?fb_error=token_exchange_failed`)
  }
}
