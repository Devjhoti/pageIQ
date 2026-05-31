import { handleCors } from '../../_lib/cors.js'
import { supabase } from '../../_lib/supabase.js'
import { requireAuth } from '../../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  const { data, error } = await supabase
    .from('analysis_queue')
    .select('*, reports!report_id(id, brand_name, score, status, analysis_type)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return res.status(404).json({ error: 'Analysis not found' })
  res.json(data)
}
