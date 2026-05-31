const { supabase } = require('../config/supabase');
const aiService = require('./ai.service');

const listCompetitors = async (userId) => {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) throw { status: 400, message: error.message };
  return data || [];
};

const addCompetitor = async (userId, { pageUrl, pageName, category, followers }) => {
  const { data, error } = await supabase
    .from('competitors')
    .insert({
      user_id: userId,
      page_url: pageUrl,
      page_name: pageName,
      category: category || '',
      followers: followers || 0,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw { status: 400, message: error.message };

  analyzeCompetitor(userId, data.id, pageName).catch((err) => {
    console.error('Background competitor analysis failed:', err);
  });

  return data;
};

const analyzeCompetitor = async (userId, competitorId, competitorName) => {
  try {
    await supabase
      .from('competitors')
      .update({ status: 'pending' })
      .eq('id', competitorId);

    const { data: userProfile } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    const brandName = userProfile?.name || 'Your Brand';
    const reportData = await aiService.generateCompetitorReport(brandName, competitorName, {});

    await supabase
      .from('competitor_reports')
      .insert({
        competitor_id: competitorId,
        user_id: userId,
        report_data: reportData,
      });

    await supabase
      .from('competitors')
      .update({
        status: 'analyzed',
        overall_sentiment: reportData.commentSentiment?.positive || 50,
        last_analyzed: new Date().toISOString(),
      })
      .eq('id', competitorId);
  } catch (error) {
    console.error('Competitor analysis error:', error);
    await supabase
      .from('competitors')
      .update({ status: 'pending' })
      .eq('id', competitorId);
  }
};

const getCompetitorById = async (competitorId, userId) => {
  const { data: competitor, error: compError } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', competitorId)
    .eq('user_id', userId)
    .single();

  if (compError) throw { status: 404, message: 'Competitor not found' };

  const { data: report } = await supabase
    .from('competitor_reports')
    .select('report_data, created_at')
    .eq('competitor_id', competitorId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { ...competitor, report: report?.report_data || null, reportGeneratedAt: report?.created_at || null };
};

const removeCompetitor = async (competitorId, userId) => {
  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', competitorId)
    .eq('user_id', userId);

  if (error) throw { status: 400, message: error.message };
  return { message: 'Competitor removed' };
};

module.exports = { listCompetitors, addCompetitor, getCompetitorById, removeCompetitor };
