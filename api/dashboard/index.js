import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const [reportsResult, profileResult] = await Promise.all([
    supabase
      .from('reports')
      .select('id, brand_name, score, status, analysis_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single(),
  ])

  res.json({
    recentReports: reportsResult.data || [],
    profile: profileResult.data || null,
    stats: {
      totalReports: reportsResult.data?.length || 0,
    },
  })
}

