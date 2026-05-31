const brands = [
  { id: 'b1', name: 'NovaTech', slug: 'novatech', industry: 'Consumer Electronics', category: 'Technology', founded: 2018, followers: 2450000, avgWeeklyReach: 890000, engagementRate: 4.2, description: 'NovaTech is redefining smart home technology with AI-driven devices that seamlessly integrate into modern lifestyles. Their Facebook presence reflects innovation, quality, and a community-first approach.', voice: ['#Authoritative', '#Innovative', '#CustomerFirst'], logo: null },
  { id: 'b2', name: 'Verve Studios', slug: 'vervestudios', industry: 'Fitness & Wellness', category: 'Health', founded: 2020, followers: 1870000, avgWeeklyReach: 620000, engagementRate: 5.8, description: 'Verve Studios brings premium fitness experiences to digital audiences through live classes, wellness content, and a thriving community of health enthusiasts.', voice: ['#Motivational', '#Expert', '#CommunityDriven'], logo: null },
  { id: 'b3', name: 'GreenLeaf Organics', slug: 'greenleforganics', industry: 'Organic Food & Beverage', category: 'Food & Beverage', founded: 2015, followers: 980000, avgWeeklyReach: 410000, engagementRate: 6.1, description: 'GreenLeaf Organics is a pioneer in organic food delivery, connecting health-conscious consumers with farm-fresh produce and sustainable meal plans.', voice: ['#EcoConscious', '#Transparent', '#HealthFirst'], logo: null },
]

const mockUsers = {
  'demo@pageiq.io': { id: 'u1', name: 'Rahul Sharma', email: 'demo@pageiq.io', avatar: null, plan: 'Pro' },
}

export function mockLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[email]
      if (user && password === 'password') {
        const token = 'mock-jwt-' + Date.now()
        localStorage.setItem('token', token)
        resolve({ user, token })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 800)
  })
}

export function mockRegister(name, email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { id: 'u' + Date.now(), name, email, avatar: null, plan: 'Free' }
      const token = 'mock-jwt-' + Date.now()
      localStorage.setItem('token', token)
      resolve({ user, token })
    }, 800)
  })
}

export function mockGoogleAuth() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Google auth coming soon' })
    }, 300)
  })
}

export function mockDashboardStats() {
  return {
    totalReports: 12,
    pagesAnalyzed: 8,
    avgBrandScore: 78,
    reportsThisMonth: 3,
  }
}

export function mockRecentReports() {
  return [
    { id: 'r1', brand: brands[0].name, slug: brands[0].slug, score: 84, date: '2026-05-28', status: 'completed' },
    { id: 'r2', brand: brands[1].name, slug: brands[1].slug, score: 72, date: '2026-05-25', status: 'completed' },
    { id: 'r3', brand: brands[2].name, slug: brands[2].slug, score: 91, date: '2026-05-22', status: 'completed' },
    { id: 'r4', brand: 'PixelCraft Agency', slug: 'pixelcraft', score: null, date: '2026-05-20', status: 'failed' },
    { id: 'r5', brand: 'BrightPath Edu', slug: 'brightpathedu', score: 65, date: '2026-05-18', status: 'completed' },
  ]
}

export function mockActivityFeed() {
  return [
    { id: 'a1', action: 'Report generated', target: brands[0].name, timestamp: '2026-05-28T14:30:00' },
    { id: 'a2', action: 'Report generated', target: brands[1].name, timestamp: '2026-05-25T10:15:00' },
    { id: 'a3', action: 'API key updated', target: 'Facebook Business', timestamp: '2026-05-24T16:45:00' },
    { id: 'a4', action: 'Report generated', target: brands[2].name, timestamp: '2026-05-22T09:00:00' },
    { id: 'a5', action: 'Plan upgraded', target: 'Pro Plan', timestamp: '2026-05-21T11:20:00' },
    { id: 'a6', action: 'Report generated', target: 'PixelCraft Agency', timestamp: '2026-05-20T13:10:00' },
    { id: 'a7', action: 'New analysis started', target: 'BrightPath Edu', timestamp: '2026-05-18T08:30:00' },
  ]
}

export function mockReportsList() {
  return [
    { id: 'r1', brand: brands[0].name, slug: brands[0].slug, score: 84, date: '2026-05-28', status: 'completed', industry: brands[0].industry },
    { id: 'r2', brand: brands[1].name, slug: brands[1].slug, score: 72, date: '2026-05-25', status: 'completed', industry: brands[1].industry },
    { id: 'r3', brand: brands[2].name, slug: brands[2].slug, score: 91, date: '2026-05-22', status: 'completed', industry: brands[2].industry },
    { id: 'r4', brand: 'PixelCraft Agency', slug: 'pixelcraft', score: null, date: '2026-05-20', status: 'failed', industry: 'Marketing' },
    { id: 'r5', brand: 'BrightPath Edu', slug: 'brightpathedu', score: 65, date: '2026-05-18', status: 'completed', industry: 'Education' },
    { id: 'r6', brand: 'Coastal Living Co', slug: 'coastalliving', score: 78, date: '2026-05-15', status: 'completed', industry: 'Home & Lifestyle' },
    { id: 'r7', brand: 'Velocity Sports', slug: 'velocitysports', score: 88, date: '2026-05-12', status: 'completed', industry: 'Sports' },
  ]
}

export function mockReportData(brandId = 'b1') {
  const brand = brands.find((b) => b.id === brandId) || brands[0]
  return {
    id: 'r1',
    brand: {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      pageUrl: `https://facebook.com/${brand.slug}`,
      industry: brand.industry,
      category: brand.category,
      founded: brand.founded,
      followers: brand.followers,
      avgWeeklyReach: brand.avgWeeklyReach,
      engagementRate: brand.engagementRate,
      description: brand.description,
      voice: brand.voice,
    },
    score: brand.id === 'b1' ? 84 : brand.id === 'b2' ? 72 : 91,
    generatedAt: '2026-05-28T14:30:00Z',
    audience: {
      ageGroups: [
        { group: '18-24', percentage: 12 },
        { group: '25-34', percentage: 34 },
        { group: '35-44', percentage: 28 },
        { group: '45-54', percentage: 16 },
        { group: '55+', percentage: 10 },
      ],
      genderSplit: [
        { name: 'Male', value: 55 },
        { name: 'Female', value: 42 },
        { name: 'Other', value: 3 },
      ],
      topLocations: [
        { location: 'United States', percentage: 32 },
        { location: 'India', percentage: 18 },
        { location: 'United Kingdom', percentage: 12 },
        { location: 'Canada', percentage: 8 },
        { location: 'Australia', percentage: 6 },
      ],
      deviceSplit: [
        { name: 'Mobile', value: 72 },
        { name: 'Desktop', value: 20 },
        { name: 'Tablet', value: 8 },
      ],
      peakEngagement: generateHeatmapData(),
    },
    content: {
      postTypeBreakdown: [
        { name: 'Video', value: 42 },
        { name: 'Image', value: 35 },
        { name: 'Link', value: 15 },
        { name: 'Text', value: 8 },
      ],
      topThemes: ['Product Launch', 'Customer Stories', 'Industry Insights', 'Behind the Scenes', 'Tutorials', 'Community Spotlight', 'Seasonal Campaigns', 'Thought Leadership'],
      postingFrequency: generatePostingCalendar(),
      bestPost: {
        type: 'Video',
        caption: 'Introducing our latest innovation — meet the NovaSmart Hub.',
        engagement: 15400,
        reach: 289000,
        date: '2026-05-20',
      },
    },
    swot: {
      strengths: ['Strong brand recognition in North America', 'High engagement rate on video content', 'Innovative product pipeline with 3 major launches planned', 'Loyal community with 40% repeat engagement', 'Award-winning customer support team'],
      weaknesses: ['Limited presence in APAC markets', 'Lower posting frequency than top competitors', 'Dependence on Facebook for 70% of social traffic', 'Inconsistent branding across regional pages'],
      opportunities: ['Expand into smart health devices ($12B growing market)', 'Leverage AI content personalization for higher CTR', 'Strategic partnerships with fitness influencers', 'Growing demand for sustainable tech products'],
      threats: ['Aggressive pricing from competitor brands', 'Facebook algorithm changes reducing organic reach', 'Supply chain disruptions affecting product launches', 'Increasing data privacy regulations'],
    },
    competitors: [
      { name: 'InnoGear', followers: '3.2M', engagementRate: 3.1, postFrequency: '5/day', brandScore: 78 },
      { name: 'SmartLiving', followers: '2.8M', engagementRate: 2.8, postFrequency: '3/day', brandScore: 74 },
      { name: 'TechFlow', followers: '1.9M', engagementRate: 4.5, postFrequency: '4/day', brandScore: 82 },
      { name: 'NextGen Devices', followers: '1.5M', engagementRate: 3.8, postFrequency: '2/day', brandScore: 70 },
    ],
    marketTrends: {
      keywordTrends: [
        { month: 'Dec', smartHome: 65, aiDevices: 45, iot: 55 },
        { month: 'Jan', smartHome: 68, aiDevices: 52, iot: 54 },
        { month: 'Feb', smartHome: 72, aiDevices: 58, iot: 56 },
        { month: 'Mar', smartHome: 70, aiDevices: 63, iot: 53 },
        { month: 'Apr', smartHome: 78, aiDevices: 71, iot: 58 },
        { month: 'May', smartHome: 85, aiDevices: 79, iot: 62 },
      ],
      trendingTopics: [
        { topic: 'AI-Powered Homes', direction: 'up' },
        { topic: 'Sustainable Tech', direction: 'up' },
        { topic: 'Voice Assistants', direction: 'stable' },
        { topic: 'Smart Security', direction: 'up' },
        { topic: 'Wearable AI', direction: 'up' },
        { topic: 'Home Automation', direction: 'stable' },
      ],
      marketOpportunityScore: 76,
    },
    recommendations: [
      { id: 'rec1', priority: 'High', title: 'Increase Video Content Production', rationale: 'Video posts generate 2.3x more engagement than image posts for your audience. Your current ratio is 42% video vs 35% image.', action: 'Aim for 60% video content over the next 3 months, focusing on product demos and customer testimonials.' },
      { id: 'rec2', priority: 'High', title: 'Expand APAC Market Presence', rationale: 'Only 8% of your audience is from APAC despite the region showing 40% growth in smart home interest.', action: 'Create region-specific content and consider partnerships with APAC influencers.' },
      { id: 'rec3', priority: 'Medium', title: 'Optimize Posting Schedule', rationale: 'Peak engagement occurs between 6-9 PM on weekdays, but only 25% of your posts are scheduled during this window.', action: 'Reschedule 60% of posts to align with peak engagement hours.' },
      { id: 'rec4', priority: 'Medium', title: 'Leverage User-Generated Content', rationale: 'Brands with UGC campaigns see 4x higher click-through rates. Your current UGC ratio is under 5%.', action: 'Launch a monthly UGC contest and feature customer content in your feed.' },
      { id: 'rec5', priority: 'Medium', title: 'Diversify Traffic Sources', rationale: '70% of your social traffic comes from Facebook, creating high platform dependency risk.', action: 'Build presence on Instagram and LinkedIn with a cross-platform content strategy.' },
      { id: 'rec6', priority: 'Low', title: 'Implement AI Chatbot for Engagement', rationale: 'Automated responses can increase response rate by 35% and reduce average response time.', action: 'Integrate a Facebook Messenger AI chatbot for common customer queries.' },
    ],
  }
}

function generateHeatmapData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = []
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let intensity = 0
      if (h >= 8 && h <= 10) intensity = Math.floor(Math.random() * 30) + 20
      else if (h >= 11 && h <= 14) intensity = Math.floor(Math.random() * 25) + 40
      else if (h >= 15 && h <= 17) intensity = Math.floor(Math.random() * 20) + 50
      else if (h >= 18 && h <= 21) intensity = Math.floor(Math.random() * 30) + 65
      else if (h >= 22 || h <= 5) intensity = Math.floor(Math.random() * 15) + 5
      else intensity = Math.floor(Math.random() * 20) + 15
      data.push({ day: days[d], hour: h, intensity: Math.min(intensity, 100) })
    }
  }
  return data
}

function generatePostingCalendar() {
  const weeks = 12
  const days = 7
  const grid = []
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const count = Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0
      grid.push({ week: w, day: d, count })
    }
  }
  return grid
}

export function mockSendResetLink(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Reset link sent to ' + email })
    }, 600)
  })
}

export function mockUpdateProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data, updated: true })
    }, 600)
  })
}

export function mockDeleteAccount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Account deleted' })
    }, 800)
  })
}

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
    overallSentiment: 62,
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

  radarData: [
    { metric: 'Engagement',     you: 74, them: 61 },
    { metric: 'Post Frequency', you: 55, them: 88 },
    { metric: 'Content Quality',you: 80, them: 72 },
    { metric: 'Response Time',  you: 66, them: 45 },
    { metric: 'Visual Quality', you: 78, them: 83 },
    { metric: 'Community',      you: 70, them: 58 },
  ],

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

  commentSentiment: {
    positive: 41,
    neutral: 25,
    negative: 34,
    totalAnalyzed: 2847,
  },

  topComplaints: [
    { category: 'After-sales service', count: 312, percentage: 34 },
    { category: 'Delivery delays',     count: 198, percentage: 22 },
    { category: 'Product quality',     count: 156, percentage: 17 },
    { category: 'Price too high',      count: 134, percentage: 15 },
    { category: 'Warranty issues',     count: 109, percentage: 12 },
  ],

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
    status: 'pending',
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
    isAlert: true,
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
