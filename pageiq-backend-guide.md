# PageIQ — Complete Backend Build Guide
# Written for OpenCode Agent (Big Pickle Model)
# Execute phase by phase. Do not skip ahead.

---

## CONTEXT: What already exists

The frontend is a React + Vite app located at `F:\PRANAB SIR\PAGEIQ\`.
Structure: `src/components`, `src/pages`, `src/context`, `src/lib`, `src/hooks`, `src/router`

Key files already built:

**`src/lib/api.js`** — Axios instance pointed at `http://localhost:3001`, attaches Bearer token from `localStorage` on every request.

**`src/context/AuthContext.jsx`** — Auth state management. Currently calls mock functions (`mockLogin`, `mockRegister`, `mockGoogleAuth`). Stores user object and token in `localStorage`. Exposes: `user`, `loading`, `login()`, `register()`, `logout()`, `loginWithGoogle()`.

**`src/.env.example`** — Three vars: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_FB_APP_ID`

The backend will run on `http://localhost:3001` in development.
The backend lives in a SEPARATE folder: `F:\PRANAB SIR\PAGEIQ-SERVER\`

---

## TECH STACK — Backend

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL) — free tier
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **AI Analysis**: Google Gemini 2.5 Flash (free tier via `@google/generative-ai`)
- **FB API**: via `axios` calls to Facebook Graph API
- **Token strategy**: Supabase issues JWTs — we validate them on the backend using the Supabase service role key
- **Environment**: `.env` file, never committed

---

## PHASE 0 — Prerequisites (Human does this, not OpenCode)

Tell the human to do the following before OpenCode touches any code:

1. Go to https://supabase.com → Create a new project → Name it `pageiq`
2. After project is ready, go to Project Settings → API → copy:
   - `Project URL` (looks like `https://xxxx.supabase.co`)
   - `anon public key`
   - `service_role secret key`
3. Go to https://aistudio.google.com → Sign in → Get API Key → copy it
4. Create the folder `F:\PRANAB SIR\PAGEIQ-SERVER\`
5. Open terminal in that folder

Only after these 4 steps is OpenCode ready to begin.

---

## PHASE 1 — Supabase Database Schema

### Step 1.1 — Run this SQL in Supabase SQL Editor

Go to your Supabase project → SQL Editor → New Query → paste and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS table (mirrors Supabase Auth, adds app-level fields)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text unique not null,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'agency')),
  reports_used integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PAGES table (FB pages that have been analyzed)
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  fb_page_url text not null,
  fb_page_id text,
  page_name text,
  page_category text,
  page_followers integer,
  created_at timestamptz default now()
);

-- REPORTS table
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  page_id uuid references public.pages(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  brand_score integer,
  report_data jsonb,
  fb_api_key text,
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- AUTO-CREATE PROFILE on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.reports enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Pages: users can only see their own
create policy "Users can manage own pages"
  on public.pages for all using (auth.uid() = user_id);

-- Reports: users can only see their own
create policy "Users can manage own reports"
  on public.reports for all using (auth.uid() = user_id);
```

This creates the full database. The trigger auto-creates a profile row whenever a user signs up through Supabase Auth.

---

## PHASE 2 — Backend Server (OpenCode builds this)

### Step 2.1 — Initialize the project

In `F:\PRANAB SIR\PAGEIQ-SERVER\`, run:

```bash
npm init -y
npm install express cors dotenv axios @supabase/supabase-js @google/generative-ai
npm install -D nodemon
```

### Step 2.2 — Create `.env`

```
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
CLIENT_URL=http://localhost:5173
```

Note: Use the `service_role` key on the backend — NOT the anon key. The service role key bypasses Row Level Security, which we need on the server. Never expose it to the frontend.

### Step 2.3 — Create `package.json` scripts

```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js"
}
```

### Step 2.4 — Full folder structure to create

```
PAGEIQ-SERVER/
├── src/
│   ├── index.js              ← Express app entry
│   ├── lib/
│   │   ├── supabase.js       ← Supabase client (service role)
│   │   └── gemini.js         ← Gemini AI client
│   ├── middleware/
│   │   └── auth.js           ← JWT validation middleware
│   ├── routes/
│   │   ├── auth.js           ← /api/auth/*
│   │   ├── reports.js        ← /api/reports/*
│   │   └── profile.js        ← /api/profile/*
│   └── services/
│       ├── facebook.js       ← FB Graph API calls
│       └── analysis.js       ← Gemini analysis logic
├── .env
└── package.json
```

---

### Step 2.5 — Write each file

#### `src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

#### `src/lib/gemini.js`
```js
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})
```

#### `src/middleware/auth.js`
```js
import { supabase } from '../lib/supabase.js'

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  next()
}
```

This middleware validates the Supabase JWT that the frontend sends on every request. Any route that wraps this middleware is protected.

#### `src/services/facebook.js`
```js
import axios from 'axios'

const FB_GRAPH_BASE = 'https://graph.facebook.com/v19.0'

// Extract page identifier from URL
// e.g. "https://facebook.com/WaltonBD" → "WaltonBD"
export function extractPageSlug(fbUrl) {
  try {
    const url = new URL(fbUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    return parts[0] || null
  } catch {
    return null
  }
}

// Fetch core page data from FB Graph API
export async function fetchPageData(pageSlug, accessToken) {
  const fields = [
    'id', 'name', 'about', 'category', 'fan_count',
    'followers_count', 'website', 'description',
    'engagement', 'cover', 'picture'
  ].join(',')

  const response = await axios.get(`${FB_GRAPH_BASE}/${pageSlug}`, {
    params: { fields, access_token: accessToken }
  })
  return response.data
}

// Fetch recent posts
export async function fetchRecentPosts(pageId, accessToken) {
  const fields = 'id,message,story,created_time,attachments,shares,reactions.summary(true),comments.summary(true)'
  const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/posts`, {
    params: { fields, limit: 30, access_token: accessToken }
  })
  return response.data.data || []
}

// Fetch page insights (requires page access token with read_insights permission)
export async function fetchPageInsights(pageId, accessToken) {
  const metrics = [
    'page_impressions_unique',
    'page_post_engagements',
    'page_fans_country',
    'page_fans_gender_age',
  ].join(',')

  try {
    const response = await axios.get(`${FB_GRAPH_BASE}/${pageId}/insights`, {
      params: { metric: metrics, period: 'month', access_token: accessToken }
    })
    return response.data.data || []
  } catch {
    // Insights may fail if token lacks permission — return empty, analysis still continues
    return []
  }
}
```

#### `src/services/analysis.js`
```js
import { geminiModel } from '../lib/gemini.js'

export async function generateBrandReport(pageData, posts, insights) {
  const prompt = `
You are a senior brand intelligence analyst. Analyze the following Facebook business page data and generate a comprehensive brand intelligence report.

## PAGE DATA
${JSON.stringify(pageData, null, 2)}

## RECENT POSTS (last 30)
${JSON.stringify(posts, null, 2)}

## PAGE INSIGHTS
${JSON.stringify(insights, null, 2)}

## INSTRUCTIONS
Analyze all the data above and return a JSON object with EXACTLY this structure. Be specific, insightful, and data-driven. Do not use filler text. Every field must reflect the actual data provided.

Return ONLY valid JSON, no markdown, no explanation:

{
  "brandScore": <integer 0-100 reflecting overall brand health>,
  "brandOverview": {
    "summary": "<2-3 sentence brand description based on actual page data>",
    "category": "<industry/category>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "keyStats": {
      "followers": <number>,
      "avgEngagementRate": "<percentage string e.g. 3.2%>",
      "postsAnalyzed": <number>,
      "weeklyReach": "<estimated based on data>"
    }
  },
  "audienceInsights": {
    "topLocations": [
      { "location": "<country/city>", "percentage": <number> }
    ],
    "ageGenderBreakdown": [
      { "group": "<age range + gender>", "percentage": <number> }
    ],
    "peakEngagementHours": [<array of 24 numbers representing relative activity 0-10 for each hour>],
    "deviceSplit": {
      "mobile": <percentage>,
      "desktop": <percentage>
    }
  },
  "contentAnalysis": {
    "postTypeBreakdown": [
      { "type": "Video", "count": <number>, "avgEngagement": <number> },
      { "type": "Image", "count": <number>, "avgEngagement": <number> },
      { "type": "Link", "count": <number>, "avgEngagement": <number> },
      { "type": "Text", "count": <number>, "avgEngagement": <number> }
    ],
    "topThemes": ["<theme1>", "<theme2>", "<theme3>", "<theme4>"],
    "postingFrequency": "<e.g. 4-5 times per week>",
    "bestPerformingPost": {
      "preview": "<first 100 chars of best post message>",
      "engagement": <total reactions + comments + shares>,
      "type": "<Video/Image/Link/Text>"
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
      "name": "<competitor brand name>",
      "estimatedFollowers": "<range>",
      "estimatedEngagement": "<range>",
      "positioning": "<one sentence>",
      "threat": "<High/Medium/Low>"
    }
  ],
  "marketTrends": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [
      { "topic": "<topic>", "direction": "up" | "down" | "stable" }
    ],
    "marketOpportunityScore": <integer 0-100>
  },
  "recommendations": [
    {
      "priority": "High" | "Medium" | "Low",
      "title": "<short action title>",
      "rationale": "<2-3 sentence explanation grounded in the data>",
      "action": "<specific first step to take>"
    }
  ]
}
`

  const result = await geminiModel.generateContent(prompt)
  const text = result.response.text()

  try {
    return JSON.parse(text)
  } catch {
    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  }
}
```

#### `src/routes/auth.js`
```js
import express from 'express'
import { supabase } from '../lib/supabase.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  })

  if (error) return res.status(400).json({ error: error.message })

  res.json({
    user: {
      id: data.user.id,
      name,
      email: data.user.email,
    },
    token: data.session?.access_token || null,
    message: 'Registration successful. Check your email to confirm.'
  })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return res.status(401).json({ error: 'Invalid email or password' })

  // Fetch profile
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
})

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) await supabase.auth.admin.signOut(token)
  res.json({ message: 'Logged out' })
})

export default router
```

#### `src/routes/profile.js`
```js
import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const router = express.Router()

// GET /api/profile — get current user's profile
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single()

  if (error) return res.status(404).json({ error: 'Profile not found' })
  res.json(data)
})

// PATCH /api/profile — update profile
router.patch('/', requireAuth, async (req, res) => {
  const { name, avatar_url } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .update({ name, avatar_url, updated_at: new Date().toISOString() })
    .eq('id', req.user.id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

export default router
```

#### `src/routes/reports.js`
```js
import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { extractPageSlug, fetchPageData, fetchRecentPosts, fetchPageInsights } from '../services/facebook.js'
import { generateBrandReport } from '../services/analysis.js'

const router = express.Router()

// GET /api/reports — list all reports for current user
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      id, status, brand_score, created_at, completed_at,
      pages ( page_name, fb_page_url, page_category, page_followers )
    `)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// GET /api/reports/:id — get single report
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      pages ( page_name, fb_page_url, page_category, page_followers )
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Report not found' })
  res.json(data)
})

// POST /api/reports — create and run a new analysis
router.post('/', requireAuth, async (req, res) => {
  const { fbPageUrl, fbApiKey } = req.body

  if (!fbPageUrl || !fbApiKey) {
    return res.status(400).json({ error: 'fbPageUrl and fbApiKey are required' })
  }

  const pageSlug = extractPageSlug(fbPageUrl)
  if (!pageSlug) {
    return res.status(400).json({ error: 'Invalid Facebook page URL' })
  }

  // Create page record
  const { data: pageRecord, error: pageError } = await supabase
    .from('pages')
    .insert({ user_id: req.user.id, fb_page_url: fbPageUrl })
    .select()
    .single()

  if (pageError) return res.status(400).json({ error: pageError.message })

  // Create report record with status 'processing'
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .insert({
      user_id: req.user.id,
      page_id: pageRecord.id,
      status: 'processing',
      fb_api_key: fbApiKey, // Store encrypted in production — for MVP store as-is
    })
    .select()
    .single()

  if (reportError) return res.status(400).json({ error: reportError.message })

  // Respond immediately — analysis runs async
  res.json({ reportId: report.id, status: 'processing' })

  // Run analysis in background (don't await — fire and forget)
  runAnalysis(report.id, pageRecord.id, pageSlug, fbApiKey, req.user.id)
})

// Background analysis function
async function runAnalysis(reportId, pageRecordId, pageSlug, fbApiKey, userId) {
  try {
    // 1. Fetch FB data
    const pageData = await fetchPageData(pageSlug, fbApiKey)
    const posts = await fetchRecentPosts(pageData.id, fbApiKey)
    const insights = await fetchPageInsights(pageData.id, fbApiKey)

    // 2. Update page record with real data
    await supabase
      .from('pages')
      .update({
        fb_page_id: pageData.id,
        page_name: pageData.name,
        page_category: pageData.category,
        page_followers: pageData.fan_count || pageData.followers_count || 0,
      })
      .eq('id', pageRecordId)

    // 3. Run AI analysis
    const reportData = await generateBrandReport(pageData, posts, insights)

    // 4. Save complete report
    await supabase
      .from('reports')
      .update({
        status: 'complete',
        brand_score: reportData.brandScore,
        report_data: reportData,
        completed_at: new Date().toISOString(),
        fb_api_key: null, // Clear after use — don't store long-term
      })
      .eq('id', reportId)

    // 5. Increment user's reports_used count
    await supabase.rpc('increment_reports_used', { user_id: userId })

  } catch (err) {
    console.error('Analysis failed:', err.message)
    await supabase
      .from('reports')
      .update({
        status: 'failed',
        error_message: err.message,
      })
      .eq('id', reportId)
  }
}

export default router
```

**Note:** After creating the routes file, run this SQL in Supabase to create the `increment_reports_used` function:

```sql
create or replace function increment_reports_used(user_id uuid)
returns void as $$
  update public.profiles
  set reports_used = reports_used + 1
  where id = user_id;
$$ language sql security definer;
```

#### `src/index.js`
```js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import reportsRoutes from './routes/reports.js'
import profileRoutes from './routes/profile.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/profile', profileRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`PageIQ server running on http://localhost:${PORT}`)
})
```

Add `"type": "module"` to `package.json` so ES module imports work.

---

## PHASE 3 — Wire Frontend to Real Backend

Now OpenCode works inside `F:\PRANAB SIR\PAGEIQ\src\`

### Step 3.1 — Create `.env` in frontend root

```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=
VITE_FB_APP_ID=
```

### Step 3.2 — Replace `AuthContext.jsx` completely

Replace the entire file with this:

```jsx
import { createContext, useState, useCallback, useEffect } from 'react'
import api from '../lib/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    if (data.token) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
    }
    return data
  }, [])

  const loginWithGoogle = useCallback(async () => {
    // Placeholder — Google OAuth requires Supabase client on frontend
    // Will be implemented in Phase 4
    throw new Error('Google login coming soon')
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout') } catch {}
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
```

The component signatures are identical. No other file needs to change.

### Step 3.3 — Create `src/lib/reportService.js`

All report-related API calls in one place:

```js
import api from './api'

// Start a new analysis
export async function createReport(fbPageUrl, fbApiKey) {
  const { data } = await api.post('/api/reports', { fbPageUrl, fbApiKey })
  return data // { reportId, status: 'processing' }
}

// Poll report status (call every 3 seconds until status is 'complete' or 'failed')
export async function getReport(reportId) {
  const { data } = await api.get(`/api/reports/${reportId}`)
  return data
}

// Get all reports for dashboard
export async function getAllReports() {
  const { data } = await api.get('/api/reports')
  return data
}
```

### Step 3.4 — Update `NewAnalysis.jsx` — replace mock analysis trigger

Find the place in `NewAnalysis.jsx` where the mock `setTimeout` chain runs. Replace it with:

```jsx
import { createReport, getReport } from '../lib/reportService'
import { useNavigate } from 'react-router-dom'

// Inside the component:
const navigate = useNavigate()

async function handleStartAnalysis() {
  setStage('Connecting to Facebook API...')
  
  try {
    const { reportId } = await createReport(fbPageUrl, fbApiKey)

    // Poll every 3 seconds
    const poll = setInterval(async () => {
      const report = await getReport(reportId)

      if (report.status === 'complete') {
        clearInterval(poll)
        navigate(`/dashboard/reports/${reportId}`)
      }

      if (report.status === 'failed') {
        clearInterval(poll)
        setError(report.error_message || 'Analysis failed. Please try again.')
        setStage(null)
      }
    }, 3000)

  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong')
    setStage(null)
  }
}
```

The loading stage labels can still animate through visually using a fixed timer — the poll just overrides when real data arrives.

### Step 3.5 — Update `ReportView.jsx` — load real report data

Find where `ReportView` uses mock data. Replace with:

```jsx
import { getReport } from '../lib/reportService'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ReportView() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReport(id)
      .then(setReport)
      .catch(err => setError(err.response?.data?.error || 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <ReportSkeleton />
  if (error) return <ErrorState message={error} />

  // Pass report.report_data to all child report section components
  // Pass report.pages to ReportHeader
  const data = report.report_data

  return (
    <div>
      <ReportHeader page={report.pages} score={report.brand_score} createdAt={report.created_at} />
      <BrandOverview data={data.brandOverview} />
      <AudienceInsights data={data.audienceInsights} />
      <ContentAnalysis data={data.contentAnalysis} />
      <SWOTMatrix data={data.swot} />
      <CompetitorMap data={data.competitors} />
      <MarketTrends data={data.marketTrends} />
      <Recommendations data={data.recommendations} />
    </div>
  )
}
```

### Step 3.6 — Update `Dashboard.jsx` — load real reports list

```jsx
import { getAllReports } from '../lib/reportService'
import { useEffect, useState } from 'react'

// Inside component:
const [reports, setReports] = useState([])
const [loadingReports, setLoadingReports] = useState(true)

useEffect(() => {
  getAllReports()
    .then(setReports)
    .finally(() => setLoadingReports(false))
}, [])
```

Pass `reports` to `<RecentReports />` and `<StatCard />` components as props.

---

## PHASE 4 — Test End-to-End

### Testing order:

1. Start backend: `cd PAGEIQ-SERVER && npm run dev`
2. Start frontend: `cd PAGEIQ && npm run dev`
3. Open `http://localhost:5173`
4. Register a new account → should hit `/api/auth/register` → redirect to dashboard
5. Login with same account → should hit `/api/auth/login` → get token → dashboard loads
6. Go to New Analysis → enter a real public FB page URL + your FB API key
7. Submit → should see processing screen → poll every 3 seconds
8. After ~30-60 seconds → redirected to full report

### If FB API fails during testing:
In `src/routes/reports.js` → `runAnalysis()` function, temporarily replace the FB fetch calls with mock data:

```js
// TEMP — remove before production
const pageData = { id: '123', name: 'Test Brand', category: 'Electronics', fan_count: 150000 }
const posts = []
const insights = []
```

This lets you test the Gemini → report pipeline without needing a real FB API key.

---

## PHASE 5 — Deploy (After testing locally)

### Backend — Deploy to Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Point to your `PAGEIQ-SERVER` repo
3. Add all `.env` variables in Railway's Variables tab
4. Railway gives you a URL like `https://pageiq-server.up.railway.app`

### Frontend — Deploy to Vercel

1. Go to https://vercel.com → New Project → Import from GitHub
2. Point to your `PAGEIQ` (frontend) repo
3. Add env var: `VITE_API_URL=https://pageiq-server.up.railway.app`
4. Deploy

Update backend `.env`: `CLIENT_URL=https://your-pageiq.vercel.app`

---

## SUMMARY — What OpenCode builds

| Phase | Location | What |
|---|---|---|
| 1 | Supabase SQL Editor | Database schema + RLS + trigger |
| 2 | PAGEIQ-SERVER/ | Full Express backend (5 files) |
| 3.1 | PAGEIQ/.env | Real env vars |
| 3.2 | PAGEIQ/src/context/AuthContext.jsx | Replace mock with real API calls |
| 3.3 | PAGEIQ/src/lib/reportService.js | New file — report API calls |
| 3.4 | PAGEIQ/src/pages/NewAnalysis.jsx | Replace mock with real polling |
| 3.5 | PAGEIQ/src/pages/ReportView.jsx | Load real report data |
| 3.6 | PAGEIQ/src/pages/Dashboard.jsx | Load real reports list |
| 4 | Terminal | Test locally |
| 5 | Railway + Vercel | Deploy |

**Total new backend files: 9**
**Total frontend files modified: 4 + 1 new**
