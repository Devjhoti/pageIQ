const { supabase } = require('../config/supabase');

const getDashboardStats = async (userId) => {
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('score')
    .eq('user_id', userId);

  if (reportsError) throw { status: 400, message: reportsError.message };

  const totalReports = reports.length;
  const avgBrandScore = totalReports > 0
    ? Math.round(reports.reduce((sum, r) => sum + (r.score || 0), 0) / totalReports)
    : 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count: reportsThisMonth } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo);

  const { count: totalCompetitors } = await supabase
    .from('competitors')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: pendingComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  return {
    totalReports,
    pagesAnalyzed: totalReports,
    avgBrandScore,
    reportsThisMonth: reportsThisMonth || 0,
    totalCompetitors: totalCompetitors || 0,
    pendingComments: pendingComments || 0,
  };
};

module.exports = { getDashboardStats };
