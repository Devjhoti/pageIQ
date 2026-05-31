# PageIQ — Migrate to Vercel Serverless Functions
# OpenCode Agent Prompt
# READ EVERY WORD BEFORE TOUCHING ANYTHING.

---

## CRITICAL CONTEXT

The root `package.json` has `"type": "module"` — this means all files
in the root are treated as ES modules (import/export).

The server code in `server/src/` uses CommonJS (require/module.exports).

This WILL conflict. The solution: all API files go in an `api/` folder
and each file gets `.cjs` extension OR we use a workaround via
`vercel.json` configuration.

We will use the cleaner approach: convert the serverless functions to
ES module syntax (import/export) since the root is already ESM.
The server's internal service files stay as-is inside `api/lib/`.

---

## WHAT WE ARE BUILDING

Vercel Serverless Functions work like this:
- Every file inside `api/` folder becomes an HTTP endpoint automatically
- `api/auth/login.js` → `https://yourapp.vercel.app/api/auth/login`
- `api/analysis/index.js` → `https://yourapp.vercel.app/api/analysis`
- No Express server needed — Vercel handles routing

---

## CURRENT STRUCTURE

```
PAGEIQ/
├── src/                    ← Frontend — DO NOT TOUCH
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
├── package.json            ← Root (type: module, has all deps)
└── vite.config.js
```

## TARGET STRUCTURE AFTER MIGRATION

```
PAGEIQ/
├── src/                    ← Frontend — UNCHANGED
├── api/                    ← NEW — Vercel serverless functions
│   ├── _lib/               ← Shared utilities (not exposed as endpoints)
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   └── cors.js
│   ├── auth/
│   │   ├── login.js        → POST /api/auth/login
│   │   ├── register.js     → POST /api/auth/register
│   │   └── logout.js       → POST /api/auth/logout
│   ├── analysis/
│   │   ├── index.js        → POST /api/analysis
│   │   └── [id]/
│   │       └── status.js   → GET /api/analysis/:id/status
│   ├── reports/
│   │   ├── index.js        → GET /api/reports
│   │   └── [id].js         → GET/DELETE /api/reports/:id
│   ├── facebook/
│   │   ├── oauth-url.js    → GET /api/facebook/oauth-url
│   │   ├── callback.js     → GET /api/facebook/callback
│   │   └── pages.js        → POST /api/facebook/pages
│   ├── dashboard/
│   │   └── index.js        → GET /api/dashboard
│   └── health.js           → GET /api/health
├── vercel.json             ← NEW
├── package.json            ← UPDATE scripts only
└── vite.config.js          ← UNCHANGED
```

---

## STEP 1 — Create `vercel.json` in root

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## STEP 2 — Create `api/_lib/cors.js`

Shared CORS handler used by every serverless function.

```js
const ALLOWED_ORIGINS = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean)

export function setCors(req, res) {
  const origin = req.headers.origin
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export function handleCors(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true // signal to caller: stop processing, preflight handled
  }
  return false
}
```

---

## STEP 3 — Create `api/_lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

---

## STEP 4 — Create `api/_lib/auth.js`

Validates Bearer token on protected routes.

```js
import { supabase } from './supabase.js'

export async function requireAuth(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return null
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return null
  }

  return user
}
```

---

## STEP 5 — Create `api/_lib/groq.js`

Copy the AI generation logic from `server/src/services/ai.service.js`.
Convert require() to import. Keep all prompt content identical.

```js
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateGeneralReport(pageUrl, brandName) {
  const prompt = `You are a senior brand intelligence analyst with deep knowledge of digital marketing, social media strategy, and the Bangladeshi market.

Analyze the Facebook business page for: ${brandName}
Page URL: ${pageUrl}

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation.

{
  "reportType": "general",
  "brandScore": <integer 0-100>,
  "brand": {
    "name": "<proper brand name, not URL slug>",
    "industry": "<industry>",
    "category": "<specific category>",
    "summary": "<2-3 sentences about this brand>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "estimatedFollowers": "<range e.g. 10K-50K>",
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
    "peakActivity": "<estimated peak times>",
    "note": "Audience data estimated. Connect Facebook for real demographics."
  },
  "content": {
    "observedThemes": ["<theme1>", "<theme2>", "<theme3>"],
    "estimatedPostFrequency": "<e.g. 4-6 times per week>",
    "contentStrengths": ["<strength1>", "<strength2>"],
    "contentGaps": ["<gap1>", "<gap2>"],
    "note": "Content analysis based on publicly observable patterns."
  },
  "swot": {
    "strengths": ["<s1>", "<s2>", "<s3>", "<s4>"],
    "weaknesses": ["<w1>", "<w2>", "<w3>"],
    "opportunities": ["<o1>", "<o2>", "<o3>"],
    "threats": ["<t1>", "<t2>", "<t3>"]
  },
  "competitors": [
    {
      "name": "<real competitor name>",
      "estimatedFollowers": "<range>",
      "positioning": "<one sentence>",
      "threat": "High",
      "keyDifferentiator": "<differentiator>"
    }
  ],
  "market": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [
      { "topic": "<topic>", "direction": "up", "relevance": "<why>" }
    ],
    "marketOpportunityScore": <integer 0-100>,
    "bangladeshContext": "<specific Bangladesh market insight>"
  },
  "recentNews": [],
  "recommendations": [
    {
      "priority": "High",
      "title": "<title>",
      "rationale": "<2-3 sentences>",
      "action": "<first step>",
      "estimatedImpact": "<expected improvement>"
    }
  ],
  "upgradePrompt": {
    "missingMetrics": ["Real follower count", "Actual engagement rate", "Audience demographics", "Post performance data"],
    "message": "Connect your Facebook account to unlock your complete report with real metrics."
  }
}`

  return await callGroq(prompt)
}

export async function generateComprehensiveReport(pageUrl, brandName, fbPageData, fbPosts, fbInsights) {
  const prompt = `You are a senior brand intelligence analyst. Analyze this real Facebook page data.

Brand: ${brandName}
URL: ${pageUrl}

PAGE DATA: ${JSON.stringify(fbPageData, null, 2)}
POSTS: ${JSON.stringify(fbPosts, null, 2)}
INSIGHTS: ${JSON.stringify(fbInsights, null, 2)}

Return ONLY valid JSON:

{
  "reportType": "comprehensive",
  "brandScore": <integer 0-100>,
  "brand": {
    "name": "<from page data>",
    "industry": "<from category>",
    "category": "<category>",
    "summary": "<based on actual data>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "actualFollowers": <real number>,
    "actualEngagementRate": "<calculated rate>",
    "presenceStrength": <integer 0-100>
  },
  "score": <same as brandScore>,
  "audience": {
    "ageGenderBreakdown": [{ "group": "<group>", "percentage": <number> }],
    "topLocations": [{ "location": "<location>", "percentage": <number> }],
    "peakEngagementHours": [<24 numbers 0-10>],
    "deviceSplit": { "mobile": <percent>, "desktop": <percent> }
  },
  "content": {
    "postTypeBreakdown": [
      { "type": "Video", "count": <n>, "avgEngagement": <n> },
      { "type": "Image", "count": <n>, "avgEngagement": <n> },
      { "type": "Link", "count": <n>, "avgEngagement": <n> },
      { "type": "Text", "count": <n>, "avgEngagement": <n> }
    ],
    "topThemes": ["<t1>", "<t2>", "<t3>"],
    "postingFrequency": "<frequency>",
    "bestPerformingPost": {
      "preview": "<first 100 chars>",
      "totalEngagement": <number>,
      "type": "<type>"
    }
  },
  "swot": {
    "strengths": ["<s1>", "<s2>", "<s3>", "<s4>"],
    "weaknesses": ["<w1>", "<w2>", "<w3>"],
    "opportunities": ["<o1>", "<o2>", "<o3>"],
    "threats": ["<t1>", "<t2>", "<t3>"]
  },
  "competitors": [
    {
      "name": "<competitor>",
      "estimatedFollowers": "<range>",
      "positioning": "<one sentence>",
      "threat": "High",
      "keyDifferentiator": "<differentiator>"
    }
  ],
  "market": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [{ "topic": "<topic>", "direction": "up", "relevance": "<why>" }],
    "marketOpportunityScore": <integer 0-100>,
    "bangladeshContext": "<market insight>"
  },
  "recommendations": [
    {
      "priority": "High",
      "title": "<title>",
      "rationale": "<rationale>",
      "action": "<action>",
      "estimatedImpact": "<impact>"
    }
  ]
}`

  return await callGroq(prompt)
}

async function callGroq(prompt, retries = 3, delayMs = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      })

      const text = completion.choices[0]?.message?.content || ''
      try {
        return JSON.parse(text)
      } catch {
        return JSON.parse(text.replace(/```json|```/g, '').trim())
      }
    } catch (err) {
      const isRateLimit = err.message?.includes('rate') ||
        err.message?.includes('429') || err.status === 429
      if (isRateLimit && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs))
        continue
      }
      throw err
    }
  }
}
```

---

## STEP 6 — Create `api/_lib/facebook.js`

Copy from `server/src/services/facebook.service.js`, convert to ESM:

```js
import axios from 'axios'

const FB_GRAPH_BASE = 'https://graph.facebook.com/v19.0'

export function extractPageSlug(fbUrl) {
  try {
    const url = new URL(fbUrl.startsWith('http') ? fbUrl : `https://${fbUrl}`)
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] === 'people') return null
    return parts[0] || null
  } catch {
    return null
  }
}

export function getFacebookOAuthUrl(appId, redirectUri, state) {
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
  })
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`
}

export async function exchangeCodeForToken(code, appId, appSecret, redirectUri) {
  const response = await axios.get(`${FB_GRAPH_BASE}/oauth/access_token`, {
    params: { client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code },
  })
  return response.data
}

export async function getLongLivedToken(shortToken, appId, appSecret) {
  const response = await axios.get(`${FB_GRAPH_BASE}/oauth/access_token`, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortToken,
    },
  })
  return response.data.access_token
}

export async function fetchPublicPageData(pageSlug, accessToken) {
  const fields = 'id,name,about,category,fan_count,followers_count,website,description,engagement,verification_status'
  const params = { fields }
  if (accessToken) params.access_token = accessToken
  const response = await axios.get(`${FB_GRAPH_BASE}/${pageSlug}`, { params })
  return response.data
}

export async function fetchUserPages(userAccessToken) {
  const response = await axios.get(`${FB_GRAPH_BASE}/me/accounts`, {
    params: {
      access_token: userAccessToken,
      fields: 'id,name,access_token,category,fan_count',
    },
  })
  return response.data.data || []
}

export async function fetchPagePosts(pageId, pageAccessToken) {
  const fields = 'id,message,story,created_time,attachments,shares,reactions.summary(true),comments.summary(true)'
  const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/posts`, {
    params: { fields, limit: 30, access_token: pageAccessToken },
  })
  return response.data.data || []
}

export async function fetchPageInsights(pageId, pageAccessToken) {
  const metrics = 'page_impressions_unique,page_post_engagements,page_fans_country,page_fans_gender_age'
  try {
    const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/insights`, {
      params: { metric: metrics, period: 'month', access_token: pageAccessToken },
    })
    return response.data.data || []
  } catch {
    return []
  }
}
```

---

## STEP 7 — Create all API endpoint files

### `api/health.js`
```js
import { handleCors } from './_lib/cors.js'

export default function handler(req, res) {
  if (handleCors(req, res)) return
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

### `api/auth/login.js`
```js
import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ error: 'Invalid email or password' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  res.json({
    user: {
      id: data.user.id,
      name: profile?.name || data.user.email,
      email: data.user.email,
      plan: profile?.plan || 'free',
      avatarUrl: profile?.avatar_url || null,
    },
    token: data.session.access_token,
  })
}
```

### `api/auth/register.js`
```js
import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })

  if (error) return res.status(400).json({ error: error.message })

  res.json({
    user: { id: data.user.id, name, email: data.user.email },
    token: data.session?.access_token || null,
    message: 'Registration successful.',
  })
}
```

### `api/auth/logout.js`
```js
import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try { await supabase.auth.admin.signOut(token) } catch {}
  }
  res.json({ message: 'Logged out' })
}
```

### `api/reports/index.js`
```js
import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { data, error } = await supabase
    .from('reports')
    .select('id, brand_name, industry, score, status, analysis_type, created_at, page_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}
```

### `api/reports/[id].js`
```js
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
```

### `api/analysis/index.js`
```js
import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'
import { generateGeneralReport, generateComprehensiveReport } from '../_lib/groq.js'
import { extractPageSlug, fetchPublicPageData, fetchPagePosts, fetchPageInsights } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { pageUrl, brandName, analysisType = 'general', fbAccessToken = null } = req.body

  if (!pageUrl || !brandName) {
    return res.status(400).json({ error: 'pageUrl and brandName are required' })
  }

  // Create queue entry
  const { data: queueItem, error: queueError } = await supabase
    .from('analysis_queue')
    .insert({
      user_id: user.id,
      page_url: pageUrl,
      status: 'processing',
      progress: 10,
      analysis_type: analysisType,
    })
    .select()
    .single()

  if (queueError) return res.status(400).json({ error: queueError.message })

  // Respond immediately — run analysis in background
  res.json({ id: queueItem.id, status: 'processing' })

  // Background processing
  try {
    let reportData
    let fbPageId = null

    if (analysisType === 'comprehensive' && fbAccessToken) {
      const pageSlug = extractPageSlug(pageUrl)
      if (!pageSlug) throw new Error('Could not extract page identifier from URL')

      const fbPageData = await fetchPublicPageData(pageSlug, fbAccessToken)
      fbPageId = fbPageData.id
      const posts = await fetchPagePosts(fbPageId, fbAccessToken)
      const insights = await fetchPageInsights(fbPageId, fbAccessToken)
      reportData = await generateComprehensiveReport(pageUrl, brandName, fbPageData, posts, insights)
    } else {
      reportData = await generateGeneralReport(pageUrl, brandName)
    }

    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        brand_name: reportData.brand?.name || brandName,
        brand_slug: slug,
        page_url: pageUrl,
        industry: reportData.brand?.industry || '',
        score: reportData.score || reportData.brandScore || 0,
        status: 'completed',
        report_data: reportData,
        analysis_type: analysisType,
        fb_page_id: fbPageId,
      })
      .select()
      .single()

    if (reportError) throw reportError

    await supabase
      .from('analysis_queue')
      .update({ status: 'completed', progress: 100, report_id: report.id })
      .eq('id', queueItem.id)

  } catch (err) {
    console.error('Analysis failed:', err.message)
    await supabase
      .from('analysis_queue')
      .update({ status: 'failed', error_message: err.message })
      .eq('id', queueItem.id)
  }
}
```

### `api/analysis/[id]/status.js`
```js
import { handleCors } from '../../_lib/cors.js'
import { supabase } from '../../_lib/supabase.js'
import { requireAuth } from '../../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  const { data, error } = await supabase
    .from('analysis_queue')
    .select('*, reports!report_id(id, brand_name, score, status, analysis_type)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return res.status(404).json({ error: 'Analysis not found' })
  res.json(data)
}
```

### `api/dashboard/index.js`
```js
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
      .from('profiles')
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
```

### `api/facebook/oauth-url.js`
```js
import { handleCors } from '../_lib/cors.js'
import { requireAuth } from '../_lib/auth.js'
import { getFacebookOAuthUrl } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { state } = req.query
  const url = getFacebookOAuthUrl(
    process.env.FB_APP_ID,
    process.env.FB_REDIRECT_URI,
    state || user.id
  )
  res.json({ url })
}
```

### `api/facebook/callback.js`
```js
import { exchangeCodeForToken, getLongLivedToken } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { code, state, error } = req.query
  const clientUrl = process.env.CORS_ORIGIN || 'http://localhost:5175'

  if (error) {
    return res.redirect(`${clientUrl}/dashboard/new?fb_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return res.redirect(`${clientUrl}/dashboard/new?fb_error=no_code`)
  }

  try {
    const tokenData = await exchangeCodeForToken(
      code,
      process.env.FB_APP_ID,
      process.env.FB_APP_SECRET,
      process.env.FB_REDIRECT_URI
    )

    const longLivedToken = await getLongLivedToken(
      tokenData.access_token,
      process.env.FB_APP_ID,
      process.env.FB_APP_SECRET
    )

    res.redirect(
      `${clientUrl}/dashboard/new?fb_connected=true&fb_token=${encodeURIComponent(longLivedToken)}&state=${state}`
    )
  } catch (err) {
    console.error('FB OAuth callback error:', err.message)
    res.redirect(`${clientUrl}/dashboard/new?fb_error=token_exchange_failed`)
  }
}
```

### `api/facebook/pages.js`
```js
import { handleCors } from '../_lib/cors.js'
import { requireAuth } from '../_lib/auth.js'
import { fetchUserPages } from '../_lib/facebook.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { accessToken } = req.body
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' })

  try {
    const pages = await fetchUserPages(accessToken)
    res.json({ pages })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
```

---

## STEP 8 — Update root `package.json` scripts

Find the scripts section and update to:

```json
"scripts": {
  "dev": "vite",
  "dev:server": "node --watch server/src/index.js",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## STEP 9 — Create `.env` in root if not exists

The root `.env` should have all variables (copy from `server/.env`):

```
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
SERPAPI_KEY=

FB_APP_ID=
FB_APP_SECRET=
FB_REDIRECT_URI=http://localhost:3001/api/facebook/callback

CORS_ORIGIN=http://localhost:5175
```

The human fills in real values from `server/.env`.

---

## STEP 10 — Update `.gitignore` in root

Make sure `.gitignore` contains:

```
.env
.env.local
node_modules/
server/node_modules/
dist/
```

---

## STEP 11 — Test locally before deploying

Vercel CLI lets you run serverless functions locally.

Install and run:
```bash
npm install -g vercel
vercel dev
```

This starts both the frontend AND the serverless functions together
at `http://localhost:3000`.

Test the health endpoint first:
```
http://localhost:3000/api/health
```

Should return: `{ "status": "ok" }`

Then test login, then a full analysis.

---

## WHAT NOT TO TOUCH

- `src/` — entire frontend folder, zero changes
- `server/` — leave as-is, still works for local Express dev
- `vite.config.js` — unchanged
- `tailwind.config.js` — unchanged
- All existing frontend components and pages

---

## FILES CREATED

```
api/
├── _lib/
│   ├── cors.js
│   ├── supabase.js
│   ├── auth.js
│   ├── groq.js
│   └── facebook.js
├── health.js
├── auth/
│   ├── login.js
│   ├── register.js
│   └── logout.js
├── reports/
│   ├── index.js
│   └── [id].js
├── analysis/
│   ├── index.js
│   └── [id]/
│       └── status.js
├── dashboard/
│   └── index.js
└── facebook/
    ├── oauth-url.js
    ├── callback.js
    └── pages.js
vercel.json
```

**Total: 18 new files. Zero existing files broken.**
