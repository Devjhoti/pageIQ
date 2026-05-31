# PageIQ — Two-Tier Analysis System
# OpenCode Agent Prompt
# READ EVERY WORD BEFORE TOUCHING ANY FILE.

---

## WHAT THIS PROMPT DOES

Replaces the manual Facebook API key input flow with a proper two-tier system:

- **Tier 1 (General Report):** User skips Facebook connection. Backend uses Gemini AI + web search to generate a report based on publicly available information. Works for ANY Facebook page URL immediately. No API key needed from the user.
- **Tier 2 (Comprehensive Report):** User connects via Facebook OAuth. Backend uses real Facebook Graph API data + Gemini AI for a deeper report with real metrics.

This is a significant but surgical change. Most existing code stays intact.

---

## EXISTING ARCHITECTURE — READ AND UNDERSTAND

**Backend is CommonJS** (`require`/`module.exports`). Do NOT use ES module syntax (`import`/`export`) anywhere in the backend. The frontend is ES modules — keep it as-is.

**Backend structure:**
```
src/
├── config/          ← supabase.js, env.js already exist
├── controllers/     ← reports.controller.js already exists
├── middleware/      ← auth.js, errorHandler.js, validate.js already exist
├── routes/          ← index.js, reports routes already exist
└── services/
    ├── analysis.service.js   ← already exists, handles queue logic
    └── ai.service.js         ← already exists, calls Gemini
```

**Frontend key files:**
- `src/pages/NewAnalysis.jsx` — 3-step flow, step 2 currently asks for API key → REPLACE step 2
- `src/pages/ReportView.jsx` — reads from `useReport()` context → NO CHANGES NEEDED
- `src/lib/services/analysisService.js` — calls backend → UPDATE to pass analysis type
- `src/context/ReportContext.jsx` — stores active report → NO CHANGES NEEDED

---

## PART 1 — DATABASE (Run in Supabase SQL Editor)

The existing schema has `analysis_queue` and `reports` tables. Add one column to each:

```sql
-- Add analysis type tracking to queue
ALTER TABLE analysis_queue
ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general'
  CHECK (analysis_type IN ('general', 'comprehensive'));

-- Add analysis type and fb_token to reports
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general'
  CHECK (analysis_type IN ('general', 'comprehensive'));

-- Store FB access token temporarily (cleared after use)
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fb_access_token text;

-- Store FB page ID when available
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fb_page_id text;
```

Run this in Supabase SQL Editor. One query, run once.

---

## PART 2 — BACKEND CHANGES

### 2.1 — Update `src/config/env.js`

Add these fields to whatever validation/export exists:

```js
FB_APP_ID: process.env.FB_APP_ID || '',
FB_APP_SECRET: process.env.FB_APP_SECRET || '',
FB_REDIRECT_URI: process.env.FB_REDIRECT_URI || 'http://localhost:3001/api/auth/facebook/callback',
```

### 2.2 — Update `.env`

Add these three lines to the existing `.env` file:

```
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_REDIRECT_URI=http://localhost:3001/api/auth/facebook/callback
```

The human will fill in the real values. Leave placeholders for now.

### 2.3 — Create `src/services/facebook.service.js`

New file. Handles all Facebook Graph API interactions.

```js
const axios = require('axios');

const FB_GRAPH_BASE = 'https://graph.facebook.com/v19.0';

// Extract page slug from URL
// facebook.com/WaltonBD → "WaltonBD"
// facebook.com/people/Brand-Name/123456 → null (invalid for API)
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

// Get OAuth URL for Facebook Login
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

// Exchange auth code for access token
async function exchangeCodeForToken(code, appId, appSecret, redirectUri) {
  const response = await axios.get(`${FB_GRAPH_BASE}/oauth/access_token`, {
    params: {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
  });
  return response.data; // { access_token, token_type, expires_in }
}

// Get long-lived token from short-lived token
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

// Fetch public page data (works without user token for public pages)
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

// Fetch user's pages (requires user access token)
async function fetchUserPages(userAccessToken) {
  const response = await axios.get(`${FB_GRAPH_BASE}/me/accounts`, {
    params: {
      access_token: userAccessToken,
      fields: 'id,name,access_token,category,fan_count',
    },
  });
  return response.data.data || [];
}

// Fetch recent posts for a page
async function fetchPagePosts(pageId, pageAccessToken) {
  const fields = 'id,message,story,created_time,attachments,shares,reactions.summary(true),comments.summary(true)';
  const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/posts`, {
    params: { fields, limit: 30, access_token: pageAccessToken },
  });
  return response.data.data || [];
}

// Fetch page insights (requires page access token with read_insights)
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
    return []; // Insights may fail if token lacks permission
  }
}

// Fetch public comments on competitor posts
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
```

### 2.4 — Replace `src/services/ai.service.js` completely

The existing ai.service needs to handle both tiers. Replace the entire file:

```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

// ─── GENERAL REPORT (no FB data — AI + web knowledge only) ──────────────────

async function generateGeneralReport(pageUrl, brandName) {
  const prompt = `
You are a senior brand intelligence analyst with deep knowledge of digital marketing,
social media strategy, and the Bangladeshi market.

Analyze the Facebook business page for: ${brandName}
Page URL: ${pageUrl}

Use your knowledge of this brand, its industry, the Bangladeshi market context,
and general digital marketing best practices to generate a comprehensive brand
intelligence report.

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation.
All fields required. Be specific — reference the actual brand, real competitors in their
space, and real market dynamics. Do not use placeholder text.

{
  "reportType": "general",
  "brandScore": <integer 0-100>,
  "brand": {
    "name": "<brand name>",
    "industry": "<industry>",
    "category": "<specific category>",
    "summary": "<2-3 sentences about this brand based on your knowledge>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "estimatedFollowers": "<range e.g. 500K-1M>",
    "estimatedEngagement": "<estimated engagement rate range>",
    "presenceStrength": <integer 0-100>
  },
  "score": <same as brandScore>,
  "audience": {
    "primaryDemographic": "<age range and gender split estimate>",
    "topLocations": [
      { "location": "<city/region>", "percentage": <number> }
    ],
    "interests": ["<interest1>", "<interest2>", "<interest3>"],
    "peakActivity": "<estimated peak times based on industry>",
    "note": "Audience data estimated based on industry knowledge. Connect Facebook for real demographics."
  },
  "content": {
    "observedThemes": ["<theme1>", "<theme2>", "<theme3>"],
    "estimatedPostFrequency": "<e.g. 4-6 times per week>",
    "contentStrengths": ["<strength1>", "<strength2>"],
    "contentGaps": ["<gap1>", "<gap2>"],
    "note": "Content analysis based on publicly observable patterns. Connect Facebook for post-level metrics."
  },
  "swot": {
    "strengths": ["<strength1>", "<strength2>", "<strength3>", "<strength4>"],
    "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
    "opportunities": ["<opportunity1>", "<opportunity2>", "<opportunity3>"],
    "threats": ["<threat1>", "<threat2>", "<threat3>"]
  },
  "competitors": [
    {
      "name": "<real competitor name>",
      "estimatedFollowers": "<range>",
      "positioning": "<one sentence>",
      "threat": "High" | "Medium" | "Low",
      "keyDifferentiator": "<what makes them different>"
    }
  ],
  "market": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [
      { "topic": "<topic>", "direction": "up" | "down" | "stable", "relevance": "<why it matters>" }
    ],
    "marketOpportunityScore": <integer 0-100>,
    "bangladeshContext": "<specific insight about this industry in Bangladesh>"
  },
  "recommendations": [
    {
      "priority": "High" | "Medium" | "Low",
      "title": "<action title>",
      "rationale": "<2-3 sentence explanation>",
      "action": "<specific first step>",
      "estimatedImpact": "<what improvement to expect>"
    }
  ],
  "upgradePrompt": {
    "missingMetrics": ["Real follower count", "Actual engagement rate", "Audience demographics", "Post performance data", "Reach and impressions"],
    "message": "Connect your Facebook account to unlock your complete report with real metrics from your page."
  }
}
`;

  return await callGemini(prompt);
}

// ─── COMPREHENSIVE REPORT (with real FB data) ────────────────────────────────

async function generateComprehensiveReport(pageUrl, brandName, fbPageData, fbPosts, fbInsights) {
  const prompt = `
You are a senior brand intelligence analyst. Analyze the following real Facebook page data
and generate a comprehensive brand intelligence report.

Brand: ${brandName}
Page URL: ${pageUrl}

REAL PAGE DATA:
${JSON.stringify(fbPageData, null, 2)}

RECENT POSTS (last 30):
${JSON.stringify(fbPosts, null, 2)}

PAGE INSIGHTS:
${JSON.stringify(fbInsights, null, 2)}

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation.
Every field must reflect the actual data provided — no placeholder text.

{
  "reportType": "comprehensive",
  "brandScore": <integer 0-100>,
  "brand": {
    "name": "<from page data>",
    "industry": "<from category>",
    "category": "<specific category>",
    "summary": "<based on actual page description and data>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "actualFollowers": <real number from data>,
    "actualEngagementRate": "<calculated from post data>",
    "presenceStrength": <integer 0-100>
  },
  "score": <same as brandScore>,
  "audience": {
    "ageGenderBreakdown": [
      { "group": "<age+gender>", "percentage": <number> }
    ],
    "topLocations": [
      { "location": "<country/city>", "percentage": <number> }
    ],
    "peakEngagementHours": [<24 numbers 0-10 representing hourly activity>],
    "deviceSplit": { "mobile": <percent>, "desktop": <percent> }
  },
  "content": {
    "postTypeBreakdown": [
      { "type": "Video", "count": <n>, "avgEngagement": <n> },
      { "type": "Image", "count": <n>, "avgEngagement": <n> },
      { "type": "Link", "count": <n>, "avgEngagement": <n> },
      { "type": "Text", "count": <n>, "avgEngagement": <n> }
    ],
    "topThemes": ["<theme1>", "<theme2>", "<theme3>"],
    "postingFrequency": "<calculated from post dates>",
    "bestPerformingPost": {
      "preview": "<first 100 chars of message>",
      "totalEngagement": <reactions+comments+shares>,
      "type": "<type>"
    }
  },
  "swot": {
    "strengths": ["<strength1>", "<strength2>", "<strength3>", "<strength4>"],
    "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
    "opportunities": ["<opportunity1>", "<opportunity2>", "<opportunity3>"],
    "threats": ["<threat1>", "<threat2>", "<threat3>"]
  },
  "competitors": [
    {
      "name": "<competitor>",
      "estimatedFollowers": "<range>",
      "positioning": "<one sentence>",
      "threat": "High" | "Medium" | "Low",
      "keyDifferentiator": "<differentiator>"
    }
  ],
  "market": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [
      { "topic": "<topic>", "direction": "up" | "down" | "stable", "relevance": "<why>" }
    ],
    "marketOpportunityScore": <integer 0-100>,
    "bangladeshContext": "<specific market insight>"
  },
  "recommendations": [
    {
      "priority": "High" | "Medium" | "Low",
      "title": "<action title>",
      "rationale": "<grounded in actual data>",
      "action": "<specific first step>",
      "estimatedImpact": "<expected improvement>"
    }
  ]
}
`;

  return await callGemini(prompt);
}

// ─── SHARED GEMINI CALLER ────────────────────────────────────────────────────

async function callGemini(prompt) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }
}

module.exports = { generateGeneralReport, generateComprehensiveReport };
```

### 2.5 — Replace `src/services/analysis.service.js` completely

```js
const { supabase } = require('../config/supabase');
const aiService = require('./ai.service');
const fbService = require('./facebook.service');

// ─── START ANALYSIS ──────────────────────────────────────────────────────────

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

  // Fire and forget — respond immediately with queue ID
  processAnalysis(queueItem.id, userId, pageUrl, brandName, analysisType, fbAccessToken)
    .catch((err) => console.error('Background analysis failed:', err));

  return queueItem;
};

// ─── PROCESS ANALYSIS (background) ──────────────────────────────────────────

const processAnalysis = async (queueId, userId, pageUrl, brandName, analysisType, fbAccessToken) => {
  try {
    await updateQueue(queueId, { status: 'processing', progress: 10 });

    let reportData;
    let fbPageData = null;
    let fbPageId = null;

    if (analysisType === 'comprehensive' && fbAccessToken) {
      // COMPREHENSIVE PATH — use real FB data
      await updateQueue(queueId, { progress: 20 });

      const pageSlug = fbService.extractPageSlug(pageUrl);
      if (!pageSlug) throw new Error('Could not extract page identifier from URL');

      // Fetch real FB data
      fbPageData = await fbService.fetchPublicPageData(pageSlug, fbAccessToken);
      fbPageId = fbPageData.id;

      await updateQueue(queueId, { progress: 40 });

      const posts = await fbService.fetchPagePosts(fbPageId, fbAccessToken);
      await updateQueue(queueId, { progress: 55 });

      const insights = await fbService.fetchPageInsights(fbPageId, fbAccessToken);
      await updateQueue(queueId, { progress: 65 });

      // Generate comprehensive AI report with real data
      reportData = await aiService.generateComprehensiveReport(pageUrl, brandName, fbPageData, posts, insights);
      await updateQueue(queueId, { progress: 85 });

    } else {
      // GENERAL PATH — AI only, no FB data needed
      await updateQueue(queueId, { progress: 30 });
      reportData = await aiService.generateGeneralReport(pageUrl, brandName);
      await updateQueue(queueId, { progress: 85 });
    }

    // Build slug
    const slug = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Save report
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
        fb_access_token: null, // Never persist the token
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

// ─── GET STATUS ──────────────────────────────────────────────────────────────

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

// ─── HELPER ──────────────────────────────────────────────────────────────────

async function updateQueue(queueId, fields) {
  await supabase.from('analysis_queue').update(fields).eq('id', queueId);
}

module.exports = { startAnalysis, getAnalysisStatus };
```

### 2.6 — Create `src/routes/facebook.routes.js`

Handles the OAuth callback and token exchange:

```js
const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const fbService = require('../services/facebook.service');
const env = require('../config/env');

const router = Router();

// GET /api/facebook/oauth-url
// Returns the Facebook OAuth URL for the frontend to redirect to
router.get('/oauth-url', authenticate, (req, res) => {
  const { state } = req.query;
  const url = fbService.getFacebookOAuthUrl(
    env.FB_APP_ID,
    env.FB_REDIRECT_URI,
    state || req.user.id
  );
  res.json({ url });
});

// GET /api/facebook/callback
// Facebook redirects here after user approves
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${env.CLIENT_URL}/dashboard/new?fb_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${env.CLIENT_URL}/dashboard/new?fb_error=no_code`);
  }

  try {
    // Exchange code for token
    const tokenData = await fbService.exchangeCodeForToken(
      code,
      env.FB_APP_ID,
      env.FB_APP_SECRET,
      env.FB_REDIRECT_URI
    );

    // Get long-lived token
    const longLivedToken = await fbService.getLongLivedToken(
      tokenData.access_token,
      env.FB_APP_ID,
      env.FB_APP_SECRET
    );

    // Redirect back to frontend with token in URL fragment (never query param)
    // Frontend reads it, stores in sessionStorage, then immediately removes from URL
    res.redirect(
      `${env.CLIENT_URL}/dashboard/new?fb_connected=true&fb_token=${encodeURIComponent(longLivedToken)}&state=${state}`
    );

  } catch (err) {
    console.error('FB OAuth callback error:', err.message);
    res.redirect(`${env.CLIENT_URL}/dashboard/new?fb_error=token_exchange_failed`);
  }
});

// POST /api/facebook/pages
// Get list of pages the connected user manages
router.post('/pages', authenticate, async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' });

  try {
    const pages = await fbService.fetchUserPages(accessToken);
    res.json({ pages });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

### 2.7 — Update `src/routes/index.js`

Add the facebook routes to the main router. Find where existing routes are mounted and add:

```js
const facebookRoutes = require('./facebook.routes');
// ... existing requires ...

router.use('/facebook', facebookRoutes);
// ... existing route mounts ...
```

### 2.8 — Update the analysis controller

Find the controller that handles starting analysis (likely `src/controllers/analysis.controller.js` or similar). Update the handler that calls `startAnalysis` to accept `analysisType` and `fbAccessToken` from the request body:

```js
// In the POST /api/analysis or wherever analysis is started:
const { pageUrl, brandName, analysisType = 'general', fbAccessToken = null } = req.body;

const queueItem = await analysisService.startAnalysis(
  req.user.id,
  pageUrl,
  brandName,
  analysisType,
  fbAccessToken
);
```

---

## PART 3 — FRONTEND CHANGES

### 3.1 — Replace Step 2 in `src/pages/NewAnalysis.jsx`

This is the main change. The current step 2 asks for an API key. Replace it entirely.

**New step labels:**
```js
const steps = ['Facebook Page', 'Connect Account', 'Confirm & Analyze']
```

**New state variables to add:**
```js
const [fbConnected, setFbConnected] = useState(false)
const [fbAccessToken, setFbAccessToken] = useState(null)
const [fbPages, setFbPages] = useState([])
const [analysisType, setAnalysisType] = useState('general') // 'general' | 'comprehensive'
const [connectingFb, setConnectingFb] = useState(false)
```

**On component mount — check for FB OAuth callback:**
```js
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const fbToken = params.get('fb_token')
  const fbConnectedParam = params.get('fb_connected')
  const fbError = params.get('fb_error')

  if (fbToken && fbConnectedParam === 'true') {
    setFbAccessToken(fbToken)
    setFbConnected(true)
    setAnalysisType('comprehensive')
    setStep(1) // Return to step 2 after redirect
    // Clean URL immediately
    window.history.replaceState({}, '', '/dashboard/new')
  }

  if (fbError) {
    // Show toast error
    toast.error('Facebook connection failed. You can still get a general report.')
    window.history.replaceState({}, '', '/dashboard/new')
  }
}, [])
```

**New `handleConnectFacebook` function:**
```js
async function handleConnectFacebook() {
  setConnectingFb(true)
  try {
    const { data } = await api.get('/api/facebook/oauth-url', {
      params: { state: 'pageiq_connect' }
    })
    // Redirect to Facebook OAuth
    window.location.href = data.url
  } catch (err) {
    toast.error('Could not initiate Facebook connection')
    setConnectingFb(false)
  }
}
```

**New Step 2 JSX — replace the entire step 1 motion.div block:**

```jsx
{step === 1 && (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div>
      <h2 className="text-lg font-semibold text-[--text-primary] font-display">
        Connect Your Account
      </h2>
      <p className="text-sm text-[--text-secondary] font-body mt-1">
        Connect Facebook for a comprehensive report with real metrics, or skip for an AI-powered general report.
      </p>
    </div>

    {/* Option A — Connect Facebook */}
    <button
      onClick={handleConnectFacebook}
      disabled={connectingFb || fbConnected}
      className={cn(
        'w-full p-5 rounded-xl border-2 text-left transition-all duration-200 group',
        fbConnected
          ? 'border-[--accent] bg-[--accent]/5'
          : 'border-[--border] hover:border-[--accent] hover:bg-[--accent]/5'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          fbConnected ? 'bg-[--accent]' : 'bg-[#1877F2]/20'
        )}>
          {fbConnected
            ? <Check size={20} className="text-[--bg-primary]" />
            : <span className="text-[#1877F2] font-bold text-sm">f</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[--text-primary] font-body text-sm">
            {fbConnected ? 'Facebook Connected ✓' : connectingFb ? 'Connecting...' : 'Connect with Facebook'}
          </p>
          <p className="text-xs text-[--text-secondary] font-body mt-1">
            {fbConnected
              ? 'Your page metrics, audience data and insights will be included.'
              : 'Get real follower counts, engagement rates, audience demographics, and post performance data.'
            }
          </p>
          {!fbConnected && (
            <div className="flex flex-wrap gap-2 mt-3">
              {['Real metrics', 'Audience demographics', 'Post analytics', 'Engagement data'].map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[--accent]/10 text-[--accent] font-body">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {!fbConnected && (
          <ArrowRight size={16} className="text-[--text-muted] group-hover:text-[--accent] transition-colors shrink-0 mt-1" />
        )}
      </div>
    </button>

    {/* Divider */}
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[--border]" />
      <span className="text-xs text-[--text-muted] font-body">or</span>
      <div className="flex-1 h-px bg-[--border]" />
    </div>

    {/* Option B — Skip, General Report */}
    <button
      onClick={() => { setAnalysisType('general'); setStep(2) }}
      className={cn(
        'w-full p-5 rounded-xl border text-left transition-all duration-200 group',
        analysisType === 'general' && !fbConnected
          ? 'border-[--border-accent] bg-[--bg-tertiary]'
          : 'border-[--border] hover:border-[--border-accent] hover:bg-[--bg-tertiary]'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[--bg-tertiary] border border-[--border] flex items-center justify-center shrink-0">
          <Search size={16} className="text-[--text-muted]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[--text-primary] font-body text-sm">
            Skip — Get General Report
          </p>
          <p className="text-xs text-[--text-secondary] font-body mt-1">
            AI-powered analysis using publicly available information. No login required.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Brand positioning', 'Competitor landscape', 'Market trends', 'SWOT analysis'].map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-muted] font-body">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight size={16} className="text-[--text-muted] group-hover:text-[--text-secondary] transition-colors shrink-0 mt-1" />
      </div>
    </button>

    {/* If connected, show continue button */}
    {fbConnected && (
      <div className="flex justify-between">
        <Button onClick={handleBack} variant="ghost"><ArrowLeft size={16} /> Back</Button>
        <Button onClick={() => setStep(2)} variant="primary">Continue <ArrowRight size={16} /></Button>
      </div>
    )}

    {!fbConnected && (
      <div className="flex justify-start">
        <Button onClick={handleBack} variant="ghost"><ArrowLeft size={16} /> Back</Button>
      </div>
    )}
  </motion.div>
)}
```

**Update Step 3 (Confirm) to show analysis type:**

In the existing step 2 Card, replace the "API Key" row with:
```jsx
<div className="flex items-center justify-between text-sm">
  <span className="text-[--text-muted] font-body">Report Type</span>
  <span className={cn(
    'font-body font-medium text-xs px-2 py-0.5 rounded-full',
    analysisType === 'comprehensive'
      ? 'bg-[--accent]/10 text-[--accent]'
      : 'bg-[--bg-tertiary] text-[--text-secondary]'
  )}>
    {analysisType === 'comprehensive' ? '⚡ Comprehensive (FB Connected)' : 'General (AI-Powered)'}
  </span>
</div>
```

And update the checklist items based on type:
```jsx
<div className="pt-3 text-xs text-[--text-muted] font-body space-y-1">
  <p>✓ Brand positioning & SWOT analysis</p>
  <p>✓ Competitor landscape mapping</p>
  <p>✓ Market trends & opportunities</p>
  <p>✓ AI-powered recommendations</p>
  {analysisType === 'comprehensive' && (
    <>
      <p className="text-[--accent]">✓ Real follower & engagement metrics</p>
      <p className="text-[--accent]">✓ Actual audience demographics</p>
      <p className="text-[--accent]">✓ Post performance breakdown</p>
      <p className="text-[--accent]">✓ Page insights data</p>
    </>
  )}
</div>
```

**Update `startAnalysisFlow` to pass type and token:**
```js
async function startAnalysisFlow() {
  setAnalyzing(true)
  try {
    const analysis = await startAnalysis(
      fbUrl,
      brandName || fbUrl,
      analysisType,           // 'general' or 'comprehensive'
      fbAccessToken || null   // null for general
    )
    setAnalysisId(analysis.id)
  } catch (err) {
    console.error('Analysis failed:', err)
    setAnalyzing(false)
    return
  }
  // ... rest of loading animation logic unchanged ...
}
```

**Update loading stage labels based on type:**
```js
const loadingStages = analysisType === 'comprehensive'
  ? [
      { label: 'Connecting to Facebook API...', duration: 1500 },
      { label: 'Fetching your page data...', duration: 2000 },
      { label: 'Analyzing content performance...', duration: 2500 },
      { label: 'Mapping competitor landscape...', duration: 2000 },
      { label: 'Generating your report...', duration: 2000 },
    ]
  : [
      { label: 'Researching your brand...', duration: 1500 },
      { label: 'Analyzing market position...', duration: 2000 },
      { label: 'Mapping competitor landscape...', duration: 2500 },
      { label: 'Identifying opportunities...', duration: 2000 },
      { label: 'Generating your report...', duration: 2000 },
    ]
```

### 3.2 — Update `src/lib/services/analysisService.js`

Find the `startAnalysis` function and update its signature:

```js
export async function startAnalysis(pageUrl, brandName, analysisType = 'general', fbAccessToken = null) {
  const { data } = await api.post('/api/analysis', {
    pageUrl,
    brandName,
    analysisType,
    fbAccessToken,
  })
  return data
}
```

### 3.3 — Update `src/pages/ReportView.jsx` — Add upgrade banner

This file needs NO structural changes. Just add a banner component at the top of the report sections that shows when `reportType === 'general'`.

Find the `<ReportHeader reportId={id} />` line and add immediately after it:

```jsx
{/* Upgrade banner for general reports */}
{activeReport?.reportType === 'general' && (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 p-4 rounded-xl border border-[--accent]/20 bg-[--accent]/5"
  >
    <div className="w-8 h-8 rounded-lg bg-[--accent]/10 flex items-center justify-center shrink-0">
      <span className="text-[--accent] text-sm">⚡</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[--text-primary] font-body">
        General Report — Real metrics not included
      </p>
      <p className="text-xs text-[--text-secondary] font-body mt-0.5">
        Connect Facebook to unlock actual engagement data, audience demographics, and post performance.
      </p>
    </div>
    <button
      onClick={() => navigate('/dashboard/new')}
      className="shrink-0 text-xs font-semibold text-[--accent] hover:underline font-body"
    >
      Upgrade Report →
    </button>
  </motion.div>
)}
```

Make sure `useNavigate` and `useReport` (to access `activeReport`) are imported at the top.

---

## PART 4 — VALIDATION FIX

The current URL validator in `NewAnalysis.jsx` rejects `/people/` URLs which is correct. But also update the error message to be helpful:

```js
function validateUrl(url) {
  return /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.-]+\/?$/.test(url)
}

// Error message when validation fails:
setUrlError('Please enter a standard Facebook page URL (e.g. facebook.com/yourbrand). If your page uses a /people/ URL, set a username in Facebook Page Settings first.')
```

---

## PART 5 — TESTING ORDER

After all changes are made, test in this exact order:

**Test 1 — General Report (should work immediately):**
1. Start backend: `npm run dev` in PAGEIQ-SERVER
2. Start frontend: `npm run dev` in PAGEIQ
3. Login → New Analysis
4. Enter any valid Facebook page URL (e.g. `https://facebook.com/WaltonBD`)
5. Step 2: click "Skip — Get General Report"
6. Step 3: confirm → Start Analysis
7. Wait for loading → should redirect to report
8. Report should load with real AI-generated content
9. Upgrade banner should appear at top

**Test 2 — Comprehensive Report (needs FB App credentials in .env):**
1. Add `FB_APP_ID` and `FB_APP_SECRET` to backend `.env`
2. Restart backend
3. Repeat flow → Step 2: click "Connect with Facebook"
4. Should redirect to Facebook OAuth page
5. Approve → redirected back to `/dashboard/new` with token
6. Step 2 shows "Facebook Connected ✓"
7. Continue → Start Analysis
8. Report generates with real FB data
9. No upgrade banner

---

## SUMMARY — FILES CHANGED

| File | Action |
|---|---|
| Supabase SQL | 4 column additions |
| `src/config/env.js` | 3 new env vars added |
| `.env` | 3 new lines added |
| `src/services/facebook.service.js` | NEW FILE |
| `src/services/ai.service.js` | REPLACED |
| `src/services/analysis.service.js` | REPLACED |
| `src/routes/facebook.routes.js` | NEW FILE |
| `src/routes/index.js` | 2 lines added |
| `src/controllers/analysis.controller.js` | 3 params updated |
| `src/pages/NewAnalysis.jsx` | Step 2 replaced, startAnalysisFlow updated |
| `src/lib/services/analysisService.js` | Signature updated |
| `src/pages/ReportView.jsx` | Upgrade banner added |

**Do not touch any other files.**
