const axios = require('axios');

const FB_GRAPH_BASE = 'https://graph.facebook.com/v19.0';

function extractPageSlug(fbUrl) {
  try {
    const url = new URL(fbUrl.startsWith('http') ? fbUrl : `https://${fbUrl}`);
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'people') return null;
    return parts[0] || null;
  } catch {
    return null;
  }
}

function getFacebookOAuthUrl(appId, redirectUri, state) {
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: [
      'pages_read_engagement',
      'pages_read_user_content',
      'pages_show_list',
      'read_insights',
      'pages_manage_engagement',
    ].join(','),
    response_type: 'code',
    state: state || 'pageiq_oauth',
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

async function exchangeCodeForToken(code, appId, appSecret, redirectUri) {
  const response = await axios.get(`${FB_GRAPH_BASE}/oauth/access_token`, {
    params: {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
  });
  return response.data;
}

async function getLongLivedToken(shortToken, appId, appSecret) {
  const response = await axios.get(`${FB_GRAPH_BASE}/oauth/access_token`, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortToken,
    },
  });
  return response.data.access_token;
}

async function fetchPublicPageData(pageSlug, accessToken) {
  const fields = [
    'id', 'name', 'about', 'category', 'fan_count',
    'followers_count', 'website', 'description',
    'engagement', 'verification_status',
  ].join(',');

  const params = { fields };
  if (accessToken) params.access_token = accessToken;

  const response = await axios.get(`${FB_GRAPH_BASE}/${pageSlug}`, { params });
  return response.data;
}

async function fetchUserPages(userAccessToken) {
  const response = await axios.get(`${FB_GRAPH_BASE}/me/accounts`, {
    params: {
      access_token: userAccessToken,
      fields: 'id,name,access_token,category,fan_count',
    },
  });
  return response.data.data || [];
}

async function fetchPagePosts(pageId, pageAccessToken) {
  const fields = 'id,message,story,created_time,attachments,shares,reactions.summary(true),comments.summary(true)';
  const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/posts`, {
    params: { fields, limit: 30, access_token: pageAccessToken },
  });
  return response.data.data || [];
}

async function fetchPageInsights(pageId, pageAccessToken) {
  const metrics = [
    'page_impressions_unique',
    'page_post_engagements',
    'page_fans_country',
    'page_fans_gender_age',
  ].join(',');

  try {
    const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/insights`, {
      params: { metric: metrics, period: 'month', access_token: pageAccessToken },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
}

async function fetchPublicPostComments(postId, accessToken) {
  try {
    const response = await axios.get(`${FB_GRAPH_BASE}/${postId}/comments`, {
      params: {
        fields: 'message,from,created_time,like_count',
        limit: 50,
        access_token: accessToken,
      },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
}

module.exports = {
  extractPageSlug,
  getFacebookOAuthUrl,
  exchangeCodeForToken,
  getLongLivedToken,
  fetchPublicPageData,
  fetchUserPages,
  fetchPagePosts,
  fetchPageInsights,
  fetchPublicPostComments,
};
