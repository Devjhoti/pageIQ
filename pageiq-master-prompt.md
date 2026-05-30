# MASTER PROMPT — PageIQ Frontend (React + Vite)

## Project Overview

Build the complete frontend for **PageIQ** — a premium SaaS platform that analyzes Facebook business pages using AI and the Facebook Business API to deliver deep brand intelligence reports. The MVP frontend covers the full pre-auth and post-auth experience: landing page, auth pages, onboarding, dashboard, report viewer, and supporting pages.

This is a **frontend-only build**. No backend. No real auth. All data is mocked/simulated. But every integration point must be clearly architected so a real backend can be plugged in with minimal friction later.

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Scroll animations**: use Framer Motion's `useInView` + `whileInView`
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP layer (stubbed)**: Axios instance at `src/lib/api.js` — all API calls go through this. Swap base URL to go live.
- **Auth context**: `src/context/AuthContext.jsx` — mock user state, login/logout. Ready for real JWT/Supabase swap.
- **Env vars**: All sensitive config referenced via `import.meta.env.VITE_*` — never hardcoded.

---

## Design Language

### Aesthetic Direction
**"Dark Intelligence"** — the visual language of a Bloomberg Terminal meets a premium design agency. Cold, precise, authoritative. Data feels alive. Not playful. Not corporate. Feels like the future of business intelligence.

### Color Palette (CSS variables in `index.css`)
```css
--bg-primary: #080C10        /* near-black base */
--bg-secondary: #0D1117      /* card backgrounds */
--bg-tertiary: #161B22       /* elevated surfaces */
--border: #21262D            /* subtle borders */
--border-accent: #30363D     /* hover borders */
--text-primary: #E6EDF3      /* headings */
--text-secondary: #8B949E    /* body text */
--text-muted: #484F58        /* captions */
--accent: #00D4AA            /* primary CTA — electric teal */
--accent-glow: rgba(0,212,170,0.15)
--accent-secondary: #1F6FEB  /* blue for data viz */
--danger: #F85149
--warning: #D29922
--success: #3FB950
```

### Typography
- **Display/Hero**: `'Syne'` (Google Fonts) — geometric, futuristic
- **Body/UI**: `'DM Sans'` — clean, modern, readable
- **Mono/Data**: `'JetBrains Mono'` — for metrics, numbers, code

Import all three from Google Fonts in `index.html`.

### Motion Principles
- Page transitions: fade + slight Y translate (Framer Motion `AnimatePresence`)
- Scroll reveals: `whileInView={{ opacity: 1, y: 0 }}` with staggered children
- Hover states: subtle scale (1.02) + border color shift
- Numbers/counters: animate count-up on scroll entry
- Loading states: skeleton shimmer on cards
- Hero: floating particle field or animated mesh gradient background (CSS or canvas)
- NO heavy 3D. NO excessive bouncing. Precision over performance.

### Layout Rules
- Max content width: `1280px`, centered
- Sidebar dashboard: `260px` fixed left, content fills rest
- Generous whitespace — sections breathe
- Cards: `border border-[--border] bg-[--bg-secondary] rounded-xl`
- Glassmorphism ONLY on overlays/modals: `backdrop-blur-md bg-white/5`

---

## File Structure

```
src/
├── assets/
│   └── logo.svg                   # PageIQ wordmark (create inline SVG)
├── components/
│   ├── ui/
│   │   ├── Button.jsx             # variants: primary, secondary, ghost, danger
│   │   ├── Input.jsx              # with label, error state, icon slot
│   │   ├── Card.jsx               # base card wrapper
│   │   ├── Badge.jsx              # status badges
│   │   ├── Skeleton.jsx           # loading shimmer
│   │   ├── Modal.jsx              # accessible modal wrapper
│   │   └── Tooltip.jsx
│   ├── layout/
│   │   ├── Navbar.jsx             # public navbar
│   │   ├── Footer.jsx             # public footer
│   │   ├── DashboardLayout.jsx    # sidebar + topbar wrapper
│   │   ├── Sidebar.jsx            # dashboard navigation
│   │   └── PageWrapper.jsx        # Framer Motion page transition wrapper
│   ├── landing/
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── SampleReport.jsx       # teaser of what report looks like
│   │   ├── Testimonials.jsx
│   │   ├── Pricing.jsx
│   │   └── CTA.jsx
│   ├── report/
│   │   ├── ReportHeader.jsx
│   │   ├── BrandOverview.jsx
│   │   ├── SWOTMatrix.jsx
│   │   ├── CompetitorMap.jsx
│   │   ├── AudienceInsights.jsx
│   │   ├── ContentAnalysis.jsx
│   │   ├── MarketTrends.jsx
│   │   ├── EngagementMetrics.jsx
│   │   └── Recommendations.jsx
│   └── dashboard/
│       ├── StatCard.jsx
│       ├── RecentReports.jsx
│       ├── QuickAnalyze.jsx
│       └── ActivityFeed.jsx
├── context/
│   ├── AuthContext.jsx            # mock auth — ready for Supabase/Firebase
│   └── ReportContext.jsx          # active report state
├── hooks/
│   ├── useAuth.js
│   ├── useReport.js
│   └── useCountUp.js              # animated number hook
├── lib/
│   ├── api.js                     # Axios instance — BASE_URL from env
│   ├── mockData.js                # all mock responses live here
│   └── utils.js                   # cn(), formatNumber(), etc.
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   ├── NewAnalysis.jsx            # enter FB URL + API key
│   ├── ReportView.jsx             # full report page
│   ├── Reports.jsx                # list of past reports
│   ├── Settings.jsx
│   ├── Pricing.jsx
│   └── NotFound.jsx
├── router/
│   └── index.jsx                  # all routes, protected route wrapper
├── App.jsx
└── main.jsx
```

---

## Pages — Detailed Spec

### 1. Landing Page (`/`)

**Hero Section**
- Full viewport height
- Headline: `"Know Every Brand. Own Every Market."` — large Syne display font
- Subheadline: one sentence about what PageIQ does
- Two CTAs: `Get Started Free` (accent) + `See Sample Report` (ghost)
- Background: animated gradient mesh (CSS `@keyframes` shifting hue on radial gradients) + subtle floating dots/grid
- Below the fold: a floating browser-frame mockup showing the dashboard (static image or coded UI preview)

**How It Works** — 3-step horizontal flow with connecting line
1. Enter your Facebook page link
2. Connect your Facebook Business API
3. Receive your complete brand intelligence report

Each step has an icon, number, title, short description. Animate in on scroll.

**Features Grid** — 6 cards, 3×2
- Brand Identity Analysis
- Competitor Intelligence
- Market Trend Tracking
- Audience Demographics
- Content Performance
- AI-Powered Recommendations

Each card: icon top-left, title, 2-line description. Hover: accent border glow.

**Sample Report Teaser**
- Show a blurred/frosted preview of the report sections
- Overlay: "Unlock the full report" CTA
- Purpose: create desire before signup

**Testimonials** — 3 cards, horizontal scroll on mobile
- Fake but realistic testimonials from marketing managers, agency founders, brand strategists

**Pricing** — 3 tiers
| Free | Pro | Agency |
|---|---|---|
| 3 reports/month | 30 reports/month | Unlimited |
| Basic metrics | Full analysis | White-label reports |
| — | Priority AI | Team seats |
| $0 | $29/mo | $99/mo |

**Footer**
- Logo + tagline left
- Links: Product, Company, Legal, Social
- Copyright

---

### 2. Auth Pages

**Login (`/login`)**
- Centered card, dark glass style
- Email + Password fields
- `Sign in with Google` button (mock — shows toast "Google auth coming soon")
- Forgot password link
- "Don't have an account? Register"
- On submit: sets mock auth context, redirects to `/dashboard`

**Register (`/register`)**
- Same card style
- Name, Email, Password, Confirm Password
- Google OAuth button
- Terms checkbox
- On submit: mock register, redirect to `/dashboard`

**Forgot Password (`/forgot-password`)**
- Email field only
- "Send reset link" button
- Success state: shows confirmation message

---

### 3. New Analysis (`/dashboard/new`)

**Step 1 — Enter Facebook Page**
- Large input: `https://facebook.com/yourbrand`
- Validates it's a FB URL format
- Shows a preview card once URL is entered (brand name extracted from URL slug)

**Step 2 — Connect API**
- FB Business API key input (masked, with show/hide toggle)
- Helper text: "Where do I find this?" → opens modal with instructions
- Optional: App ID field

**Step 3 — Confirm & Analyze**
- Summary of what will be analyzed
- `Start Analysis` button
- On click: shows animated loading screen (not a spinner — a multi-stage progress bar with labels):
  - "Connecting to Facebook API..." (1.5s)
  - "Fetching page data..." (2s)
  - "Running brand analysis..." (2.5s)
  - "Mapping competitor landscape..." (2s)
  - "Generating your report..." (2s)
- After all stages: redirect to `/dashboard/reports/:id`

All this is mocked with `setTimeout`. The architecture is set up so a real API call replaces the mock trivially.

---

### 4. Report View (`/dashboard/reports/:id`)

This is the hero feature. Full-page report. Scrollable. Sections separated by dividers. Sticky section nav on left (desktop).

**Sections (in order):**

**4.1 Report Header**
- Brand logo (fetched from mock), name, FB page URL
- Report generated timestamp
- Quick action buttons: Download PDF, Share, Re-analyze
- Score badge: "Brand Intelligence Score: 84/100" with circular progress ring

**4.2 Brand Overview**
- Brand category, industry, founded (mocked)
- Page followers, avg. weekly reach, engagement rate — 3 StatCards
- Brand description paragraph (AI-generated mock text)
- Brand voice tags: `#Authoritative` `#Innovative` `#CustomerFirst`

**4.3 Audience Insights**
- Age/gender breakdown: Recharts BarChart
- Top locations: Recharts horizontal BarChart
- Device split: Recharts PieChart
- Peak engagement hours: heatmap grid (7×24 CSS grid, color intensity = engagement)

**4.4 Content Analysis**
- Post type breakdown (Video/Image/Link/Text): Recharts PieChart
- Top performing content themes: tag cloud (CSS)
- Posting frequency calendar (GitHub-style contribution grid — CSS grid)
- Best performing post mockup card

**4.5 SWOT Matrix**
- 2×2 grid, each quadrant a different subtle color
- S: Strengths, W: Weaknesses, O: Opportunities, T: Threats
- Each quadrant: 4-5 bullet points (mocked, but realistic)
- Animate in quadrant by quadrant on scroll

**4.6 Competitor Intelligence**
- Table of 4-5 competitors: Name, Followers, Engagement Rate, Post Frequency, Brand Score
- Each row clickable (future: opens competitor mini-report)
- Recharts RadarChart: multi-brand comparison across 6 metrics

**4.7 Market Trends**
- Industry keyword trend chart: Recharts LineChart (6-month mock data)
- Trending topics in their industry: tag list with trend direction arrows
- "Market Opportunity Score" with progress bar

**4.8 AI Recommendations**
- 5-6 actionable recommendations
- Each: priority badge (High/Medium/Low), title, 2-3 sentence rationale, suggested action
- Sorted by priority

**4.9 Report Footer**
- Re-analyze button
- Download PDF (mock — shows toast)
- Share report (mock link copy)

---

### 5. Dashboard Home (`/dashboard`)

- Greeting: "Good morning, Rahul" (uses auth context name — keep it dynamic)
- Quick stats row: Total Reports, Pages Analyzed, Avg Brand Score, Reports This Month
- Recent Reports table: last 5, with brand name, score, date, status
- Quick Analyze widget: mini version of the input form
- Activity feed: timestamped log of past analyses

---

### 6. Reports List (`/dashboard/reports`)

- Search bar + filter (by date, score range)
- Cards or table view toggle
- Each entry: brand logo, name, score, date, View button
- Empty state: illustrated empty state with CTA to run first analysis

---

### 7. Settings (`/dashboard/settings`)

Tabs:
- **Profile**: name, email, avatar upload (mock)
- **API Keys**: save/view FB API key (masked), manage connected accounts
- **Notifications**: toggle switches (mock)
- **Billing**: shows current plan, upgrade CTA
- **Danger Zone**: Delete account (red, confirmation modal)

---

## Architecture Notes for Backend Readiness

### Auth
`AuthContext.jsx` exposes: `user`, `login()`, `logout()`, `register()`, `loading`
- Mock: stores user object in `localStorage`
- Real swap: replace internals with Supabase `signInWithPassword()` or Firebase `signInWithEmailAndPassword()`
- Google OAuth button wired to `loginWithGoogle()` — mock shows toast, real calls provider

### API Layer
`src/lib/api.js`:
```js
import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export default api
```
All data-fetching hooks use this instance. Swap `VITE_API_URL` in `.env` to go live.

### Mock Data
All mock responses in `src/lib/mockData.js`. Each function mirrors what the real API endpoint will return. When backend is ready, replace the mock function call with the real `api.get()` call — no component changes needed.

### Protected Routes
`ProtectedRoute` wrapper in router checks `AuthContext.user`. If null → redirect to `/login`. Ready for real session checks.

### Environment Variables
`.env.example` file with:
```
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_FB_APP_ID=
```

---

## Component Standards

- Every component: PropTypes or JSDoc comment for props
- Loading state: every data-dependent component handles `isLoading` with `<Skeleton />`
- Error state: every fetch handles error with an inline error message component
- Empty state: every list handles empty data gracefully
- All colors via CSS variables — no hardcoded hex in JSX
- Responsive: mobile-first. Dashboard collapses sidebar to bottom nav on mobile.

---

## Deliverables Checklist

- [ ] Vite + React project initialized, Tailwind configured
- [ ] Google Fonts loaded (Syne, DM Sans, JetBrains Mono)
- [ ] CSS variables defined in `index.css`
- [ ] All routes defined in router
- [ ] AuthContext with mock login/logout
- [ ] All 10 pages built
- [ ] All report sections built with Recharts and mock data
- [ ] Framer Motion page transitions working
- [ ] Scroll animations on all landing sections
- [ ] Analysis loading screen with multi-stage progress
- [ ] SWOT matrix animated
- [ ] Dashboard sidebar with active route highlighting
- [ ] Mobile responsive layout
- [ ] `.env.example` file
- [ ] `README.md` with setup instructions and architecture notes

---

## Tone Reminder

This is a **premium intelligence product**. Every pixel should feel expensive. Think Palantir's aesthetic meets a top-tier design agency's portfolio. Cold, precise, confident. The UI should make a marketing director feel like they're looking at classified intelligence data — and love it.

Do not add placeholder lorem ipsum in headings. Write real, contextual copy for every section. The product is called **PageIQ**. Tagline: **"Brand Intelligence, Redefined."**
