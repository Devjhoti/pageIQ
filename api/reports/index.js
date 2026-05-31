import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { data, error } = await supabase
    .from('reports')
    .select('id, brand_name, industry, score, status, analysis_type, created_at, page_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}
