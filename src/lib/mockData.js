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
