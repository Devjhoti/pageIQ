const { supabase } = require('../config/supabase');
const aiService = require('./ai.service');
const fbService = require('./facebook.service');

const startAnalysis = async (userId, pageUrl, brandName, analysisType = 'general', fbAccessToken = null) => {
  const { data: queueItem, error: queueError } = await supabase
    .from('analysis_queue')
    .insert({
      user_id: userId,
      page_url: pageUrl,
      status: 'queued',
      progress: 0,
      analysis_type: analysisType,
    })
    .select()
    .single();

  if (queueError) throw { status: 400, message: queueError.message };

  processAnalysis(queueItem.id, userId, pageUrl, brandName, analysisType, fbAccessToken)
    .catch((err) => console.error('Background analysis failed:', err));

  return queueItem;
};

const processAnalysis = async (queueId, userId, pageUrl, brandName, analysisType, fbAccessToken) => {
  try {
    await updateQueue(queueId, { status: 'processing', progress: 10 });

    let reportData;
    let fbPageData = null;
    let fbPageId = null;

    if (analysisType === 'comprehensive' && fbAccessToken) {
      await updateQueue(queueId, { progress: 20 });

      const pageSlug = fbService.extractPageSlug(pageUrl);
      if (!pageSlug) throw new Error('Could not extract page identifier from URL');

      fbPageData = await fbService.fetchPublicPageData(pageSlug, fbAccessToken);
      fbPageId = fbPageData.id;

      await updateQueue(queueId, { progress: 40 });

      const posts = await fbService.fetchPagePosts(fbPageId, fbAccessToken);
      await updateQueue(queueId, { progress: 55 });

      const insights = await fbService.fetchPageInsights(fbPageId, fbAccessToken);
      await updateQueue(queueId, { progress: 65 });

      reportData = await aiService.generateComprehensiveReport(pageUrl, brandName, fbPageData, posts, insights);
      await updateQueue(queueId, { progress: 85 });
    } else {
      await updateQueue(queueId, { progress: 30 });
      reportData = await aiService.generateGeneralReport(pageUrl, brandName);
      await updateQueue(queueId, { progress: 85 });
    }

    const slug = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        brand_name: brandName,
        brand_slug: slug,
        page_url: pageUrl,
        industry: reportData.brand?.industry || '',
        score: reportData.score || reportData.brandScore || 0,
        status: 'completed',
        report_data: reportData,
        analysis_type: analysisType,
        fb_page_id: fbPageId,
        fb_access_token: null,
      })
      .select()
      .single();

    if (reportError) throw reportError;

    await updateQueue(queueId, {
      status: 'completed',
      progress: 100,
      report_id: report.id,
    });

    return report;
  } catch (error) {
    console.error('Analysis error:', error);
    await updateQueue(queueId, {
      status: 'failed',
      error_message: error.message || 'Analysis failed',
    });
    throw error;
  }
};

const getAnalysisStatus = async (queueId, userId) => {
  const { data, error } = await supabase
    .from('analysis_queue')
    .select('*, reports!report_id(id, brand_name, score, status, analysis_type)')
    .eq('id', queueId)
    .eq('user_id', userId)
    .single();

  if (error) throw { status: 404, message: 'Analysis not found' };
  return data;
};

async function updateQueue(queueId, fields) {
  await supabase.from('analysis_queue').update(fields).eq('id', queueId);
}

module.exports = { startAnalysis, getAnalysisStatus };
