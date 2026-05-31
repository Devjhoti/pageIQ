import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ error: 'Invalid email or password' })

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  res.json({
    user: {
      id: data.user.id,
      name: profile?.name || data.user.email,
      email: data.user.email,
      plan: profile?.plan || 'free',
      avatarUrl: profile?.avatar_url || null,
    },
    token: data.session.access_token,
  })
}

