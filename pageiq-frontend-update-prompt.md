# PageIQ — Frontend Update Prompt
# For OpenCode Agent (Big Pickle Model)
# READ EVERYTHING BEFORE TOUCHING ANY FILE.

---

## CONTEXT: What already exists

PageIQ is a fully built React + Vite frontend. Design language is "Dark Intelligence" —
near-black backgrounds, electric teal accent (#00D4AA), Syne display font, DM Sans body,
JetBrains Mono for data. All CSS variables are defined in `index.css`.

The existing pages are:
- Landing, Login, Register, ForgotPassword
- Dashboard (home)
- NewAnalysis (enter FB URL + API key)
- ReportView (full brand report)
- Reports (list of past reports)
- Settings
- Pricing
- NotFound

DO NOT TOUCH any existing page or component unless explicitly told to below.
DO NOT change any CSS variables, fonts, or design tokens.
DO NOT change routing logic for existing routes.

---

## WHAT IS BEING ADDED

Two entirely new feature modules are being added to PageIQ:

### Module 1 — Competitor Intelligence
Deep analysis of competitor Facebook pages using their public data and public post comments.
Includes mirror comparison, comment sentiment breakdown, and an Opportunity Feed.

### Module 2 — Comment Intelligence Center
Real-time monitoring of comments on the user's own page posts. AI sentiment classification,
negative comment alerts, AI-drafted reply suggestions, human-in-the-loop moderation.

---

## CHANGES TO EXISTING FILES

### 1. `src/router/index.jsx` — Add new routes

Add these routes inside the dashboard protected route wrapper, alongside existing dashboard routes:

```
/dashboard/competitors              → CompetitorIntelligence page
/dashboard/competitors/:id          → CompetitorReport page (deep report for one competitor)
/dashboard/comments                 → CommentIntelligence page
```

### 2. `src/components/layout/Sidebar.jsx` — Add nav items

Add two new navigation items to the dashboard sidebar, between "Reports" and "Settings":

```
Competitor Intel     → /dashboard/competitors     icon: Target (lucide)
Comment Intelligence → /dashboard/comments        icon: MessageSquare (lucide)
```

Keep exact same styling as existing nav items. Active state same as others.

### 3. `src/lib/mockData.js` — Add mock data for both modules

Add the following mock data exports at the bottom of the existing file.
Do not modify any existing exports.

```js
// --- COMPETITOR INTELLIGENCE MOCK DATA ---

export const mockCompetitors = [
  {
    id: 'comp_001',
    pageUrl: 'https://facebook.com/WaltonBD',
    pageName: 'Walton Bangladesh',
    category: 'Electronics',
    followers: 2400000,
    addedAt: '2024-01-10T10:00:00Z',
    lastAnalyzed: '2024-01-15T14:30:00Z',
    status: 'analyzed',
    overallSentiment: 62,    // 0-100, higher = more positive
    threatLevel: 'High',
  },
  {
    id: 'comp_002',
    pageUrl: 'https://facebook.com/SingerBangladesh',
    pageName: 'Singer Bangladesh',
    category: 'Electronics',
    followers: 1800000,
    addedAt: '2024-01-12T09:00:00Z',
    lastAnalyzed: '2024-01-15T14:45:00Z',
    status: 'analyzed',
    overallSentiment: 55,
    threatLevel: 'Medium',
  },
  {
    id: 'comp_003',
    pageUrl: 'https://facebook.com/MarcelBD',
    pageName: 'Marcel Bangladesh',
    category: 'Electronics',
    followers: 950000,
    addedAt: '2024-01-14T11:00:00Z',
    lastAnalyzed: null,
    status: 'pending',
    overallSentiment: null,
    threatLevel: 'Low',
  },
]

export const mockCompetitorReport = {
  id: 'comp_001',
  pageName: 'Walton Bangladesh',
  pageUrl: 'https://facebook.com/WaltonBD',
  followers: 2400000,
  followersGrowthPercent: 12.4,
  avgPostsPerWeek: 8,
  avgEngagementRate: '2.1%',
  lastAnalyzed: '2024-01-15T14:30:00Z',

  // Mirror comparison — 6 metrics, 0-100 scale
  radarData: [
    { metric: 'Engagement',     you: 74, them: 61 },
    { metric: 'Post Frequency', you: 55, them: 88 },
    { metric: 'Content Quality',you: 80, them: 72 },
    { metric: 'Response Time',  you: 66, them: 45 },
    { metric: 'Visual Quality', you: 78, them: 83 },
    { metric: 'Community',      you: 70, them: 58 },
  ],

  // What is working for them
  whatsWorking: [
    {
      title: 'Product showcase reels under 30 seconds',
      detail: 'Their 15-30 second product demo videos consistently receive 3-5x more engagement than static images. Average 1,200 reactions per video vs 380 for images.',
      metric: '+218% engagement vs their image posts',
    },
    {
      title: 'Weekend morning posting (Fri-Sat 9-11AM)',
      detail: 'Analysis of 90 posts shows Friday and Saturday morning posts receive significantly higher reach and comment volume than weekday posts.',
      metric: 'Fri-Sat posts get 2.4x more comments',
    },
    {
      title: 'Price-reveal format posts',
      detail: 'Posts that tease a product then reveal price in comments generate high comment volume and algorithm boost.',
      metric: 'Avg 840 comments vs 120 for standard posts',
    },
  ],

  // What is NOT working for them
  whatsNotWorking: [
    {
      title: 'Long-form text posts ignored',
      detail: 'Posts exceeding 150 words receive significantly below-average engagement. Their audience is visual-first.',
      metric: '67% below average engagement',
    },
    {
      title: 'After-sales complaints going unanswered',
      detail: '34% of comments mention service issues. Average response time is 18 hours. 22% of complaints receive no reply.',
      metric: '22% unanswered complaint rate',
    },
    {
      title: 'Repetitive promotional tone',
      detail: 'Brand voice scores low on authenticity. 78% of posts are pure product promotion with no educational or entertainment value.',
      metric: 'Authenticity score: 28/100',
    },
  ],

  // Comment sentiment breakdown from their public posts
  commentSentiment: {
    positive: 41,
    neutral: 25,
    negative: 34,
    totalAnalyzed: 2847,
  },

  // Top complaint categories from their comment sections
  topComplaints: [
    { category: 'After-sales service', count: 312, percentage: 34 },
    { category: 'Delivery delays',     count: 198, percentage: 22 },
    { category: 'Product quality',     count: 156, percentage: 17 },
    { category: 'Price too high',      count: 134, percentage: 15 },
    { category: 'Warranty issues',     count: 109, percentage: 12 },
  ],

  // Opportunity Feed — unanswered competitor comments you could win
  opportunityFeed: [
    {
      id: 'opp_001',
      postPreview: 'Introducing our new 1.5 ton inverter AC — cooling that lasts...',
      comment: 'Does this come with 5 year warranty? I had bad experience with previous model and customer service never responded.',
      commenterName: 'Rafiqul Islam',
      commentTime: '2024-01-15T11:23:00Z',
      likes: 47,
      isAnswered: false,
      aiDraftReply: "Hi Rafiqul! We understand your concern about after-sales support — it's something we take very seriously at [Your Brand]. Our inverter ACs come with a 5-year compressor warranty and dedicated service centers in every district. We'd love to show you the difference. DM us and we'll answer every question.",
      opportunity: 'Direct acquisition — unhappy competitor customer seeking warranty assurance',
    },
    {
      id: 'opp_002',
      postPreview: 'Our new refrigerator series — built for Bangladeshi families...',
      comment: 'Price ta ektu beshi hoyey gese na? Compared to Samsung same spec e.',
      commenterName: 'Tamanna Akter',
      commentTime: '2024-01-15T09:45:00Z',
      likes: 89,
      isAnswered: false,
      aiDraftReply: "Tamanna, great question! When comparing specs, it is also worth comparing what comes after the sale. [Your Brand] offers free installation, 2-year full warranty, and local service centers — costs that competitors often charge extra for. Our total cost of ownership is actually lower. See our refrigerator lineup here: [link]",
      opportunity: 'Price-sensitive prospect — position on total value, not just price',
    },
    {
      id: 'opp_003',
      postPreview: 'Walton Smart TV — experience the future of entertainment...',
      comment: 'Android version is too old. My 2 year old TV still on Android 9. No update ever.',
      commenterName: 'Shafiul Haque',
      commentTime: '2024-01-14T16:10:00Z',
      likes: 124,
      isAnswered: false,
      aiDraftReply: "Shafiul, software updates are a real pain point in the industry. Our Smart TVs run on [OS] with guaranteed updates for 3 years — and we push them automatically so you never have to think about it. If you want to compare specs, our team is happy to walk you through it. What size are you looking for?",
      opportunity: 'Tech-aware customer frustrated with competitor software support',
    },
  ],
}

// --- COMMENT INTELLIGENCE MOCK DATA ---

export const mockCommentFeed = [
  {
    id: 'cmt_001',
    postPreview: 'Excited to announce our new product line launching this Friday...',
    commenterName: 'Karim Uddin',
    commenterAvatar: null,
    comment: 'Finally! Been waiting for this. Will there be an early bird discount?',
    time: '2024-01-15T14:23:00Z',
    likes: 12,
    sentiment: 'positive',
    sentimentScore: 88,
    category: 'Question',
    aiSuggestedReply: "Thank you Karim! Yes, we have a special launch-week offer planned. Stay tuned — we will announce it Thursday night. Make sure notifications are on so you do not miss it!",
    status: 'pending',   // pending | replied | hidden | deleted | ignored
  },
  {
    id: 'cmt_002',
    postPreview: 'Our customer service team is available 7 days a week...',
    commenterName: 'Nasrin Begum',
    commenterAvatar: null,
    comment: 'Customer service?? I called 6 times last week and nobody picked up. This is a joke.',
    time: '2024-01-15T13:45:00Z',
    likes: 34,
    sentiment: 'negative',
    sentimentScore: 12,
    category: 'Complaint',
    aiSuggestedReply: "Nasrin, we are so sorry about this experience — this is absolutely not the standard we hold ourselves to. Please DM us your contact number right now and our team lead will personally call you within the hour. We want to make this right.",
    status: 'pending',
    isAlert: true,   // high priority — negative + high likes
  },
  {
    id: 'cmt_003',
    postPreview: 'Our customer service team is available 7 days a week...',
    commenterName: 'Rana Hossain',
    commenterAvatar: null,
    comment: 'Worst brand ever. Total scam. Do not buy from them.',
    time: '2024-01-15T13:30:00Z',
    likes: 8,
    sentiment: 'negative',
    sentimentScore: 2,
    category: 'Hostile',
    aiSuggestedReply: "Rana, we are sorry to hear you feel this way. We would genuinely like to understand what went wrong. Please DM us with your order details so we can investigate and resolve this for you.",
    status: 'pending',
    isAlert: true,
  },
  {
    id: 'cmt_004',
    postPreview: 'Exciting new partnership announcement coming soon...',
    commenterName: 'Dilruba Khanam',
    commenterAvatar: null,
    comment: 'Always love the quality of your products. My whole family uses your brand.',
    time: '2024-01-15T12:10:00Z',
    likes: 22,
    sentiment: 'positive',
    sentimentScore: 95,
    category: 'Praise',
    aiSuggestedReply: "Thank you so much Dilruba! This means the world to us. Families like yours are the reason we do what we do. We have something special coming very soon — stay tuned!",
    status: 'pending',
  },
  {
    id: 'cmt_005',
    postPreview: 'Check out our latest refrigerator collection...',
    commenterName: 'Arif Khan',
    commenterAvatar: null,
    comment: 'What is the price of the 320L model? And is EMI available?',
    time: '2024-01-15T11:55:00Z',
    likes: 5,
    sentiment: 'neutral',
    sentimentScore: 55,
    category: 'Question',
    aiSuggestedReply: "Hi Arif! The 320L model is priced at ৳42,500. Yes, EMI is available — 0% interest for 6 months with BRAC Bank and Dutch Bangla cards. Want us to send you the full spec sheet? Just DM us!",
    status: 'replied',
  },
]

export const mockCommentStats = {
  total: 1284,
  positive: 612,
  neutral: 389,
  negative: 283,
  positivePercent: 48,
  neutralPercent: 30,
  negativePercent: 22,
  avgSentimentScore: 64,
  alertsToday: 7,
  repliedToday: 23,
  pendingReview: 41,
  sentimentTrend: [
    { date: 'Jan 9',  score: 58 },
    { date: 'Jan 10', score: 61 },
    { date: 'Jan 11', score: 55 },
    { date: 'Jan 12', score: 63 },
    { date: 'Jan 13', score: 67 },
    { date: 'Jan 14', score: 60 },
    { date: 'Jan 15', score: 64 },
  ],
}
```

---

## NEW FILES TO CREATE

### FILE 1: `src/pages/CompetitorIntelligence.jsx`

This is the main competitor management page. Think of it like a CRM for competitors.

**Layout:** Full dashboard page. Same DashboardLayout wrapper as other pages.

**Top section — page header:**
- Title: "Competitor Intelligence"
- Subtitle: "Track, analyze and outmaneuver your competition"
- Right side: `+ Add Competitor` button (accent color)

**Add Competitor Modal:**
- Triggered by the button above
- Dark modal (glassmorphism style — `backdrop-blur bg-white/5 border border-[--border]`)
- Input field: "Facebook Page URL" with placeholder `https://facebook.com/competitorpage`
- Helper text: "We will analyze their public posts, engagement patterns and comment sentiment"
- Button: "Start Analysis" — on click closes modal, adds new entry to list with status `pending`, then after 3 second mock delay flips to `analyzed`

**Competitor Cards Grid (2 columns on desktop, 1 on mobile):**

Each card contains:
- Top row: competitor name (bold, Syne font), threat level badge (High=red, Medium=amber, Low=green), kebab menu (3 dots) with options: View Report, Re-analyze, Remove
- Follower count with person icon
- Overall sentiment score — horizontal bar, color shifts red→yellow→green based on score
- Status: if `pending` show animated pulsing "Analyzing..." badge in teal. If `analyzed` show "View Full Report →" link
- Bottom: "Last analyzed" timestamp or "Not yet analyzed"

Empty state (no competitors added):
- Centered illustration area (use an SVG target/crosshair icon, large, muted color)
- Heading: "No competitors tracked yet"
- Sub: "Add your first competitor to start building intelligence"
- CTA button: "+ Add Competitor"

**Below the cards — Competitive Landscape Overview:**
Only shows if 2+ competitors are analyzed.
- Section title: "Landscape Overview"
- Recharts RadarChart showing your brand vs all analyzed competitors simultaneously
- Each brand a different color line. Legend below chart.
- Axis labels: Engagement, Post Frequency, Content Quality, Response Time, Visual Quality, Community
- Your brand line always in teal (#00D4AA). Competitors in: #1F6FEB, #F85149, #D29922 (cycle through)

Use `mockCompetitors` from mockData for the cards.
Use `mockCompetitorReport.radarData` for the radar chart (for now it only shows one competitor — that's fine for mock).

---

### FILE 2: `src/pages/CompetitorReport.jsx`

Full deep-dive report for a single competitor. Accessed via `/dashboard/competitors/:id`.

**Layout:** Same DashboardLayout. Has a back button top-left: `← Back to Competitors`

**Page sections (in order, separated by subtle dividers):**

**Section 1 — Competitor Header**
- Competitor page name large (Syne font)
- FB page URL as clickable link (opens in new tab)
- Follower count, avg posts/week, avg engagement rate — 3 inline stat pills
- "Last analyzed" timestamp right-aligned
- Follower growth badge: `+12.4% this month` in green with upward arrow

**Section 2 — Mirror Comparison**
- Section title: "You vs Them"
- Two-panel layout:
  - Left panel (60% width): Recharts RadarChart — your brand (teal) vs competitor (blue), 6 metrics
  - Right panel (40% width): vertical list of the 6 metrics with two progress bars side by side (yours teal, theirs blue), percentage label on each
- This is the hero visual of the page — make it striking

**Section 3 — What's Working For Them**
- Section title: "What's Working" with a green upward arrow icon
- 3 cards in a row (or stacked on mobile)
- Each card:
  - Title (bold)
  - Detail paragraph (muted text)
  - Bottom metric tag — green background, e.g. "+218% engagement vs their image posts"
- Animate cards in on scroll (Framer Motion whileInView, staggered 0.1s delay)

**Section 4 — What's NOT Working**
- Section title: "What's Not Working" with a red downward arrow icon  
- Same card layout as above but metric tag is red background
- 3 cards

**Section 5 — Comment Sentiment Breakdown**
- Section title: "Their Audience Sentiment"
- Subtitle: "Based on analysis of [X] public comments across their recent posts"
- Three large stat boxes side by side:
  - Positive: big number in green, smiley icon
  - Neutral: big number in muted color, neutral icon
  - Negative: big number in red, frown icon
- Below: Recharts horizontal BarChart showing `topComplaints` — categories on Y axis, count on X axis, bars in red gradient
- Section label above bar chart: "Top Complaint Categories"
- This data is gold — make it visually prominent

**Section 6 — Opportunity Feed**
- Section title: "Opportunity Feed"
- Subtitle: "Unanswered comments on their posts — potential customers you can reach"
- Amber/yellow info banner at top: "These are public comments. Engage manually and thoughtfully — do not spam."
- List of opportunity cards (full width, stacked):

Each opportunity card:
```
┌─────────────────────────────────────────────────────────────┐
│  POST: "Introducing our new 1.5 ton inverter AC — cooling..." │
│  ─────────────────────────────────────────────────────────── │
│  💬 Rafiqul Islam · 2 hours ago · 47 likes (unanswered)      │
│  "Does this come with 5 year warranty? I had bad experience  │
│   with previous model and customer service never responded." │
│  ─────────────────────────────────────────────────────────── │
│  🎯 OPPORTUNITY: Direct acquisition — unhappy competitor...   │
│  ─────────────────────────────────────────────────────────── │
│  AI SUGGESTED REPLY:                                         │
│  "Hi Rafiqul! We understand your concern about after-sales..." │
│  [collapsed by default, expand chevron]                      │
│  ─────────────────────────────────────────────────────────── │
│  [ Copy Reply ]  [ Open on Facebook ↗ ]                      │
└─────────────────────────────────────────────────────────────┘
```

- AI Suggested Reply is collapsed by default. Click to expand (smooth Framer Motion height animation).
- "Copy Reply" button copies the draft to clipboard. On click: button text changes to "Copied ✓" for 2 seconds.
- "Open on Facebook" is a mock button — shows toast "Opening Facebook..." (in real version this deep-links to the comment)
- Opportunity tag has a target/bullseye icon, amber color

Use `mockCompetitorReport` from mockData for all data on this page.

---

### FILE 3: `src/pages/CommentIntelligence.jsx`

The real-time comment monitoring center for the user's own page.

**Layout:** DashboardLayout wrapper.

**Top — Stats Row (4 cards):**
```
Total Comments    |  Positive   |  Negative   |  Pending Review
    1,284         |    612 (48%)|   283 (22%) |      41
  this week       |   ↑ vs avg  |  ↓ vs avg   |   needs attention
```
Numbers animate count-up on mount (use existing `useCountUp` hook).
Negative stat card has a subtle red glow border if > 20%.
Pending Review card has amber glow border if > 20 pending.

**Second Row — Two panels side by side:**

Left panel (60%): "Live Comment Feed"
Right panel (40%): "Sentiment Trend" — Recharts LineChart, 7 days, single line, color shifts based on value

**Live Comment Feed:**
- Filter tabs across top: All | Positive | Neutral | Negative | Alerts
- "Alerts" tab has a red badge with count if alerts > 0
- Default: "Alerts" tab is active (so user sees urgent things first)
- Each comment card:

```
┌──────────────────────────────────────────────────────────────┐
│ [ALERT badge if isAlert]  Complaint          13:45 · Jan 15  │
│ Post: "Our customer service team is available 7 days..."     │
│ ──────────────────────────────────────────────────────────── │
│ Nasrin Begum                                    34 ❤         │
│ "Customer service?? I called 6 times last week and nobody    │
│  picked up. This is a joke."                                 │
│                                                              │
│ Sentiment: ████░░░░░░ 12/100  [NEGATIVE]                     │
│ ──────────────────────────────────────────────────────────── │
│ 💬 AI SUGGESTED REPLY (click to expand)                      │
│ ──────────────────────────────────────────────────────────── │
│ [ Reply ↗ ]  [ Hide ]  [ Delete ]  [ Ignore ]               │
└──────────────────────────────────────────────────────────────┘
```

- Sentiment bar: thin horizontal bar, color = red if <30, amber if 30-60, green if >60
- Sentiment score shown as number + label
- Category badge top right of comment: Complaint / Praise / Question / Hostile
- ALERT badge: pulsing red dot + "ALERT" text. Only on `isAlert: true` comments
- Action buttons:
  - **Reply ↗** — mock, shows toast "Opening Facebook comment..."
  - **Hide** — mock action, card gets `opacity-50` + "Hidden" status badge
  - **Delete** — shows confirmation modal "Are you sure? This cannot be undone." → on confirm card disappears with exit animation
  - **Ignore** — card slides out, moves to bottom of list with muted style
- Status badge: if `status === 'replied'` show green "Replied" badge, hide action buttons
- Positive comments: card left border teal. Negative: red. Neutral: muted.

**AI Suggested Reply expansion (same pattern as Competitor Report):**
- Collapsed by default
- Framer Motion `AnimatePresence` height animation on expand
- Expandable area contains the draft reply text
- Below draft: "Copy Reply" button

**Right panel — Sentiment Trend:**
- Title: "7-Day Sentiment Trend"
- Recharts LineChart with `mockCommentStats.sentimentTrend` data
- Single line, color: if latest score > 60 = teal, if 40-60 = amber, if < 40 = red
- Reference line at 60 (labeled "Healthy") — dashed, muted
- Below chart: avg sentiment score large number, label "Average Sentiment Score"

**Bottom Section — Category Breakdown:**
Full width.
Title: "Comment Categories This Week"
Recharts BarChart — categories: Praise, Question, Complaint, Hostile, Other
Each bar a different color (teal, blue, red, dark red, muted)

Use `mockCommentFeed` and `mockCommentStats` from mockData.

---

## COMPONENT STANDARDS (same as existing project)

- Every new component gets PropTypes or JSDoc comment
- Loading states use existing `<Skeleton />` component
- Toasts: use whatever toast system is already in the project. If none exists, add `react-hot-toast` and set up a `<Toaster />` in `App.jsx`
- All colors via CSS variables — no hardcoded hex
- Framer Motion for all animations — page enter, scroll reveals, card exits
- Recharts for all charts — match existing chart styling (dark background, teal/blue colors, no grid lines or very subtle ones)
- Mobile responsive — single column on mobile, sidebar collapses same as rest of app

---

## ANIMATION SPECS

- Page enter: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}`
- Scroll reveal cards: `whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }}` staggered by 0.1s per card
- Comment card exit (delete/ignore): `exit={{ opacity: 0, x: -20, height: 0 }}` — use `AnimatePresence` on the list
- Modal enter: `initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}`
- Alert badge pulse: CSS animation `@keyframes pulse` — already in Tailwind (`animate-pulse`)
- Sentiment bar: animate width from 0 to value on mount using Framer Motion `animate={{ width: '${score}%' }}`
- Count-up numbers: use existing `useCountUp` hook on mount

---

## COPY / CONTENT TONE

Write all UI copy in the same "Dark Intelligence" tone as the rest of PageIQ.
- Precise, confident, no fluff
- Data-forward — always reference numbers
- No exclamation marks in UI labels or headings (save for AI reply drafts)
- Empty states: specific and actionable, not generic ("Add your first competitor" not "No data found")

---

## DELIVERABLES CHECKLIST

- [ ] `src/router/index.jsx` — 3 new routes added
- [ ] `src/components/layout/Sidebar.jsx` — 2 new nav items added
- [ ] `src/lib/mockData.js` — mock data appended (existing exports untouched)
- [ ] `src/pages/CompetitorIntelligence.jsx` — created
- [ ] `src/pages/CompetitorReport.jsx` — created
- [ ] `src/pages/CommentIntelligence.jsx` — created
- [ ] All three pages render without errors
- [ ] Sidebar nav items navigate correctly
- [ ] CompetitorIntelligence → "View Full Report →" navigates to CompetitorReport
- [ ] Add Competitor modal opens/closes correctly
- [ ] Comment cards: hide/delete/ignore actions work with animations
- [ ] AI reply expansion works on all applicable cards
- [ ] Copy button changes to "Copied ✓" for 2 seconds
- [ ] All charts render with mock data
- [ ] Mobile responsive
- [ ] No existing pages or components broken
