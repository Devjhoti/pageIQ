const { supabase } = require('../config/supabase');
const aiService = require('./ai.service');

const listComments = async (userId, filters = {}) => {
  let query = supabase
    .from('comments')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (filters.sentiment && filters.sentiment !== 'all') {
    query = query.eq('sentiment', filters.sentiment);
  }
  if (filters.alert === 'true') {
    query = query.eq('is_alert', true);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw { status: 400, message: error.message };
  return data || [];
};

const getCommentStats = async (userId) => {
  const { data: allComments, error } = await supabase
    .from('comments')
    .select('sentiment, sentiment_score, status, is_alert')
    .eq('user_id', userId)
    .neq('status', 'deleted');

  if (error) throw { status: 400, message: error.message };

  const total = allComments.length;
  const positive = allComments.filter((c) => c.sentiment === 'positive').length;
  const neutral = allComments.filter((c) => c.sentiment === 'neutral').length;
  const negative = allComments.filter((c) => c.sentiment === 'negative').length;
  const pendingReview = allComments.filter((c) => c.status === 'pending').length;
  const alertsToday = allComments.filter((c) => c.is_alert).length;
  const repliedToday = allComments.filter((c) => c.status === 'replied').length;

  const avgSentimentScore = total > 0
    ? Math.round(allComments.reduce((sum, c) => sum + c.sentiment_score, 0) / total)
    : 0;

  return {
    total,
    positive,
    neutral,
    negative,
    positivePercent: total > 0 ? Math.round((positive / total) * 100) : 0,
    neutralPercent: total > 0 ? Math.round((neutral / total) * 100) : 0,
    negativePercent: total > 0 ? Math.round((negative / total) * 100) : 0,
    avgSentimentScore,
    alertsToday,
    repliedToday,
    pendingReview,
  };
};

const replyToComment = async (commentId, userId, replyText) => {
  let aiReply = replyText;

  if (!aiReply) {
    const { data: comment } = await supabase
      .from('comments')
      .select('comment, sentiment')
      .eq('id', commentId)
      .single();

    if (comment) {
      try {
        const result = await aiService.suggestReply(comment.comment, comment.sentiment);
        aiReply = result.suggestedReply;
      } catch (err) {
        aiReply = 'Thank you for your feedback! We appreciate you reaching out.';
      }
    }
  }

  const { data, error } = await supabase
    .from('comments')
    .update({
      status: 'replied',
      ai_suggested_reply: aiReply,
      replied_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw { status: 400, message: error.message };
  return data;
};

const deleteComment = async (commentId, userId) => {
  const { error } = await supabase
    .from('comments')
    .update({ status: 'deleted' })
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw { status: 400, message: error.message };
  return { message: 'Comment deleted' };
};

module.exports = { listComments, getCommentStats, replyToComment, deleteComment };
