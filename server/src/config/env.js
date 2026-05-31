const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  GEMINI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  FB_APP_ID: process.env.FB_APP_ID || '',
  FB_APP_SECRET: process.env.FB_APP_SECRET || '',
  FB_REDIRECT_URI: process.env.FB_REDIRECT_URI || 'http://localhost:3001/api/facebook/callback',
};

const OPTIONAL_KEYS = ['GEMINI_API_KEY', 'FB_APP_ID', 'FB_APP_SECRET', 'FB_REDIRECT_URI'];
const missing = Object.entries(env).filter(([k, v]) => !v && v !== 0 && !OPTIONAL_KEYS.includes(k));
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.map(([k]) => k).join(', ')}`);
  process.exit(1);
}

module.exports = env;
