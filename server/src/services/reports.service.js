const { supabase } = require('../config/supabase');

const listReports = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('id, brand_name, brand_slug, score, status, industry, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw { status: 400, message: error.message };
  return data || [];
};

const getReportById = async (reportId, userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', userId)
    .single();

  if (error) throw { status: 404, message: 'Report not found' };
  return data;
};

const deleteReport = async (reportId, userId) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)
    .eq('user_id', userId);

  if (error) throw { status: 400, message: error.message };
  return { message: 'Report deleted' };
};

module.exports = { listReports, getReportById, deleteReport };
