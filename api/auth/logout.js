import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try { await supabase.auth.admin.signOut(token) } catch {}
  }
  res.json({ message: 'Logged out' })
}
