import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })

  if (error) return res.status(400).json({ error: error.message })

  res.json({
    user: { id: data.user.id, name, email: data.user.email },
    token: data.session?.access_token || null,
    message: 'Registration successful.',
  })
}
