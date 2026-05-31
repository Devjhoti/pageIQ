import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Report not found' })
    return res.json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return res.status(400).json({ error: error.message })
    return res.json({ message: 'Report deleted' })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
