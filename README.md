# PageIQ — Brand Intelligence, Redefined.

AI-powered Facebook business page analyzer. Built with React 18 + Vite.

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3 + CSS variables
- **Animations**: Framer Motion (page transitions, scroll reveals)
- **Icons**: Lucide React
- **Charts**: Recharts (bar, pie, line, radar)
- **HTTP**: Axios (stubbed — ready for backend swap)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
npm run preview
```

## Architecture

```
src/
├── components/
│   ├── ui/          # Button, Input, Card, Badge, Skeleton, Modal, Tooltip
│   ├── layout/      # Navbar, Footer, Sidebar, DashboardLayout, PageWrapper
│   ├── landing/     # Hero, HowItWorks, Features, SampleReport, Testimonials, Pricing, CTA
│   ├── report/      # ReportHeader, BrandOverview, AudienceInsights, ContentAnalysis, SWOTMatrix, CompetitorMap, MarketTrends, EngagementMetrics, Recommendations
│   └── dashboard/   # StatCard, RecentReports, QuickAnalyze, ActivityFeed
├── context/         # AuthContext (mock), ReportContext
├── hooks/           # useAuth, useReport, useCountUp
├── lib/             # api.js (Axios), mockData.js (all mock responses), utils.js (cn, formatNumber)
├── pages/           # 11 pages (Landing, Login, Register, ForgotPassword, Dashboard, NewAnalysis, ReportView, Reports, Settings, Pricing, NotFound)
└── router/          # Route definitions + ProtectedRoute wrapper
```

## Backend Swap Points

| Integration | Current (Mock) | Production Swap |
|---|---|---|
| Auth | `AuthContext` with localStorage | Replace with Supabase `signInWithPassword()` or Firebase Auth |
| API | `src/lib/api.js` — Axios instance | Set `VITE_API_URL` in `.env` |
| Data | `src/lib/mockData.js` — mock responses | Replace each function with `api.get()` call — same interface |
| Google OAuth | Toast "coming soon" | Wire to Firebase/Supabase Google provider |

## Environment Variables

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=
VITE_FB_APP_ID=
```

## Routes

| Path | Page | Auth Required |
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
| `/dashboard/settings` | Settings | Yes |
| `*` | 404 | No |

## Design System

**"Dark Intelligence"** — Bloomberg Terminal meets premium design agency.

- Colors: CSS variables in `src/index.css` (dark theme: `--bg-primary: #080C10`, accent: `#00D4AA`)
- Fonts: Syne (display), DM Sans (body), JetBrains Mono (data)
- Layout: Max `1280px` centered, 260px sidebar
- Motion: Fade + Y translate page transitions, scroll reveals, skeleton shimmer
