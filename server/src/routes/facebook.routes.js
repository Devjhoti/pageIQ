const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const fbService = require('../services/facebook.service');
const env = require('../config/env');

const router = Router();

router.get('/oauth-url', authenticate, (req, res) => {
  const { state } = req.query;
  const url = fbService.getFacebookOAuthUrl(
    env.FB_APP_ID,
    env.FB_REDIRECT_URI,
    state || req.user.id
  );
  res.json({ url });
});

router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${env.CORS_ORIGIN}/dashboard/new?fb_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${env.CORS_ORIGIN}/dashboard/new?fb_error=no_code`);
  }

  try {
    const tokenData = await fbService.exchangeCodeForToken(
      code,
      env.FB_APP_ID,
      env.FB_APP_SECRET,
      env.FB_REDIRECT_URI
    );

    const longLivedToken = await fbService.getLongLivedToken(
      tokenData.access_token,
      env.FB_APP_ID,
      env.FB_APP_SECRET
    );

    res.redirect(
      `${env.CORS_ORIGIN}/dashboard/new?fb_connected=true&fb_token=${encodeURIComponent(longLivedToken)}&state=${state}`
    );

  } catch (err) {
    console.error('FB OAuth callback error:', err.message);
    res.redirect(`${env.CORS_ORIGIN}/dashboard/new?fb_error=token_exchange_failed`);
  }
});

router.post('/pages', authenticate, async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' });

  try {
    const pages = await fbService.fetchUserPages(accessToken);
    res.json({ pages });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
