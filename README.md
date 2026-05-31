# PageIQ — Brand Intelligence, Redefined.

AI-powered Facebook business page analyzer. React + Vite frontend, Express + Supabase backend.

## Tech Stack

- **Frontend**: React 19 + Vite, React Router v6, Tailwind CSS v3, Framer Motion, Recharts
- **Backend**: Node.js + Express.js, Supabase (PostgreSQL + Auth), Google Gemini AI
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **AI**: Google Gemini 2.0 Flash (report generation, sentiment analysis, reply suggestions)
- **Icons**: Lucide React
- **Charts**: Recharts (bar, pie, line, radar)
- **HTTP**: Axios + Supabase SDK

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (migration in `server/migrations/001_initial_schema.sql`)

### Frontend

```bash
npm install
npm run dev
# opens http://localhost:5173
```

### Backend

```bash
cd server
npm install
cp .env.example .env    # then fill in credentials
npm run seed             # creates demo user + sample data
npm run dev              # starts on http://localhost:3001
```

Demo login: `demo@pageiq.io` / `password123`

## Build

```bash
npm run build          # frontend
cd server && npm start # backend
```

## Architecture

```
├── src/                      # Frontend (React + Vite)
│   ├── components/
│   │   ├── ui/               # Button, Input, Card, Badge, Skeleton, Modal, Tooltip
│   │   ├── layout/           # Navbar, Sidebar, DashboardLayout, Footer, PageWrapper
│   │   ├── landing/          # Hero, HowItWorks, Features, SampleReport, Testimonials, Pricing, CTA
│   │   ├── report/           # ReportHeader, BrandOverview, AudienceInsights, ContentAnalysis, SWOTMatrix, CompetitorMap, MarketTrends, EngagementMetrics, Recommendations
│   │   └── dashboard/        # StatCard, RecentReports, QuickAnalyze, ActivityFeed
│   ├── context/              # AuthContext (Supabase Auth), ReportContext
│   ├── hooks/                # useAuth, useReport, useCountUp
│   ├── lib/
│   │   ├── api.js            # Axios instance with JWT interceptor
│   │   ├── services/         # API service modules (auth, dashboard, reports, competitors, comments)
│   │   ├── mockData.js       # Fallback mock data
│   │   └── utils.js          # cn(), formatNumber, formatDate, etc.
│   ├── pages/                # 11 pages
│   └── router/               # Route definitions + ProtectedRoute
│
└── server/                   # Backend (Express + Supabase + Gemini)
    ├── src/
    │   ├── config/           # Supabase client, Gemini AI client, env vars
    │   ├── middleware/        # JWT auth, Zod validation, error handler
    │   ├── routes/            # auth, dashboard, reports, analysis, competitors, comments
    │   ├── controllers/       # Request handlers
    │   └── services/          # Business logic + AI prompt engineering
    ├── migrations/            # 001_initial_schema.sql (6 tables, RLS, indexes)
    └── scripts/               # seed.js (demo data generation)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Sign up |
| POST | /api/auth/login | — | Sign in |
| POST | /api/auth/google | — | Google OAuth |
| GET | /api/auth/me | ✓ | Current user |
| PUT | /api/auth/profile | ✓ | Update profile |
| DELETE | /api/auth/account | ✓ | Delete account |
| GET | /api/dashboard/stats | ✓ | Dashboard KPIs |
| GET | /api/reports | ✓ | List reports |
| GET | /api/reports/:id | ✓ | Report detail |
| DELETE | /api/reports/:id | ✓ | Delete report |
| POST | /api/analysis | ✓ | Start analysis |
| GET | /api/analysis/:id/status | ✓ | Analysis progress |
| GET | /api/competitors | ✓ | List competitors |
| POST | /api/competitors | ✓ | Add competitor |
| GET | /api/competitors/:id | ✓ | Competitor report |
| DELETE | /api/competitors/:id | ✓ | Remove competitor |
| GET | /api/comments | ✓ | Comment feed |
| GET | /api/comments/stats | ✓ | Comment stats |
| PUT | /api/comments/:id/reply | ✓ | Reply to comment |
| DELETE | /api/comments/:id | ✓ | Delete comment |

## AI Features (Google Gemini 2.0 Flash)

| Feature | Prompt |
|---|---|
| Report Analysis | Full brand score, SWOT, audience, content, competitors, trends, recommendations |
| Sentiment Analysis | Per-comment positive/neutral/negative + score |
| Suggested Replies | Contextual, on-brand reply generation |
| Competitor Reports | You-vs-Them radar, working/not-working, opportunity feed |

## Environment Variables

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:3001/api
```

### Backend (`server/.env`)

```
PORT=3001
SUPABASE_URL=https://bvjckdzkqiihecdrnwhf.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_AI_API_KEY=your_gemini_key
CORS_ORIGIN=http://localhost:5173
```

## Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/forgot-password` | Forgot Password | No |
| `/pricing` | Pricing | No |
| `/dashboard` | Dashboard Home | Yes |
| `/dashboard/new` | New Analysis | Yes |
| `/dashboard/reports` | Reports List | Yes |
| `/dashboard/reports/:id` | Report View | Yes |
| `/dashboard/competitors` | Competitor Intel | Yes |
| `/dashboard/competitors/:id` | Competitor Report | Yes |
| `/dashboard/comments` | Comment Intelligence | Yes |
| `/dashboard/settings` | Settings | Yes |
| `*` | 404 | No |

## Design System

**"Dark Intelligence"** — Bloomberg Terminal meets premium design agency.

- Colors: CSS variables in `src/index.css` (dark theme: `--bg-primary: #080C10`, accent: `#00D4AA`)
- Fonts: Syne (display), DM Sans (body), JetBrains Mono (data)
- Layout: Max `1280px` centered, 260px sidebar
- Motion: Fade + Y translate page transitions, scroll reveals, skeleton shimmer
