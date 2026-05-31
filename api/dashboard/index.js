import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const [reportsResult, profileResult, countResult] = await Promise.all([
    supabase
      .from('reports')
      .select('id, brand_name, score, status, analysis_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const reports = reportsResult.data || []

  res.json({
    recentReports: reports,
    profile: profileResult.data || null,
    stats: {
      totalReports: countResult.count || 0,
      reportsThisMonth: reports.filter(r => {
        const d = new Date(r.created_at)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length || 0,
      avgScore: reports.length
        ? Math.round(reports.reduce((a, r) => a + (r.score || 0), 0) / reports.length)
        : 0,
    },
  })
}

