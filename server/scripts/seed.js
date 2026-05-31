const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { supabase } = require('../src/config/supabase');
const { supabaseAnon } = require('../src/config/supabase');
const env = require('../src/config/env');

const seed = async () => {
  console.log('Seeding database...');

  const email = 'demo@pageiq.io';
  const password = 'password123';
  const name = 'Demo User';

  const { data: existingUsers } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  let userId;
  if (existingUsers?.user) {
    userId = existingUsers.user.id;
    console.log(`User ${email} already exists (${userId})`);
  } else {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      console.error('Failed to create user:', authError.message);
      process.exit(1);
    }

    userId = authData.user.id;
    console.log(`Created user ${email} (${userId})`);

    const { error: profileError } = await supabase
      .from('users')
      .insert({ id: userId, name, plan: 'Pro' });

    if (profileError) {
      console.error('Failed to create profile:', profileError.message);
      process.exit(1);
    }
    console.log('Created user profile');
  }

  const { data: existingReports } = await supabase
    .from('reports')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (existingReports && existingReports.length > 0) {
    console.log('Seed data already exists, skipping.');
    process.exit(0);
  }

  const reports = [
    {
      user_id: userId,
      brand_name: 'NovaTech',
      brand_slug: 'novatech',
      page_url: 'https://facebook.com/novatech',
      industry: 'Technology',
      score: 84,
      status: 'completed',
      report_data: {
        score: 84,
        brand: {
          name: 'NovaTech', industry: 'Technology', category: 'Consumer Electronics',
          description: 'Innovative tech company specializing in smart home devices and IoT solutions.',
          voice: ['Innovative', 'Professional', 'Approachable'],
        },
        audience: {
          ageGroups: [{ group: '18-24', percentage: 22 }, { group: '25-34', percentage: 38 }, { group: '35-44', percentage: 24 }, { group: '45-54', percentage: 12 }, { group: '55+', percentage: 4 }],
          genderSplit: [{ name: 'Male', value: 58 }, { name: 'Female', value: 38 }, { name: 'Other', value: 4 }],
          topLocations: [{ location: 'United States', percentage: 35 }, { location: 'India', percentage: 18 }, { location: 'United Kingdom', percentage: 12 }, { location: 'Germany', percentage: 8 }, { location: 'Canada', percentage: 7 }],
          deviceSplit: [{ name: 'Mobile', value: 72 }, { name: 'Desktop', value: 20 }, { name: 'Tablet', value: 8 }],
          peakEngagement: Array.from({ length: 7 }, (_, d) =>
            Array.from({ length: 24 }, (_, h) => ({
              day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][d],
              hour: h,
              intensity: Math.floor(Math.random() * 80) + 10,
            }))
          ).flat(),
        },
        content: {
          postTypeBreakdown: [{ name: 'Video', value: 42 }, { name: 'Image', value: 35 }, { name: 'Link', value: 15 }, { name: 'Text', value: 8 }],
          topThemes: ['Product Launches', 'Tech Tips', 'Customer Stories', 'Industry News', 'Behind the Scenes', 'Tutorials', 'Community Spotlights', 'Events'],
          postingFrequency: Array.from({ length: 12 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => ({
              week: w,
              day: d,
              count: Math.floor(Math.random() * 8),
            }))
          ).flat(),
          bestPost: { type: 'Video', caption: 'Introducing our next-gen smart home hub', engagement: 15420, reach: 89000, date: '2026-05-15' },
        },
        swot: {
          strengths: ['Strong brand recognition', 'High-quality product photography', 'Consistent posting schedule', 'Active community engagement', 'Influencer partnerships'],
          weaknesses: ['Limited video content', 'Slow response to negative comments', 'Inconsistent storytelling', 'Underutilized Stories feature', 'Lack of user-generated content'],
          opportunities: ['Growing smart home market', 'Video content trend', 'Gen Z audience expansion', 'AI-powered personalization', 'Strategic partnerships'],
          threats: ['Increased competition', 'Algorithm changes', 'Negative sentiment spikes', 'Privacy regulations', 'Ad cost increases'],
        },
        competitors: [
          { name: 'TechGiant', followers: 2500000, engagementRate: 3.2, postFrequency: 18, brandScore: 91 },
          { name: 'InnoWave', followers: 890000, engagementRate: 4.8, postFrequency: 22, brandScore: 78 },
          { name: 'SmartLiving', followers: 1200000, engagementRate: 2.9, postFrequency: 15, brandScore: 85 },
          { name: 'FutureHome', followers: 650000, engagementRate: 5.1, postFrequency: 12, brandScore: 72 },
        ],
        marketTrends: {
          trendingTopics: [{ topic: 'AI Integration', direction: 'up' }, { topic: 'Smart Home Security', direction: 'up' }, { topic: 'IoT Standards', direction: 'stable' }, { topic: 'Voice Assistants', direction: 'stable' }, { topic: 'Edge Computing', direction: 'up' }, { topic: 'Legacy Devices', direction: 'down' }],
          marketOpportunityScore: 76,
        },
        recommendations: [
          { id: 'rec1', priority: 'High', title: 'Boost Video Content Strategy', rationale: '42% of top posts are videos, but overall video content is only 15%', action: 'Create 3-4 video posts per week' },
          { id: 'rec2', priority: 'High', title: 'Improve Response Time', rationale: 'Response rate of 45% is below industry average of 65%', action: 'Set up automated responses and dedicate 2hrs/day' },
          { id: 'rec3', priority: 'Medium', title: 'Leverage User-Generated Content', rationale: 'UGC posts get 4.5x more engagement than branded content', action: 'Launch a hashtag campaign' },
          { id: 'rec4', priority: 'Medium', title: 'Expand Story Usage', rationale: 'Only 8 posts/month on Stories vs 25 recommended', action: 'Post 2-3 Stories daily' },
          { id: 'rec5', priority: 'Low', title: 'Optimize Posting Schedule', rationale: 'Peak audience time at 7-9 PM but most posts go at 10 AM', action: 'Schedule posts for 7 PM' },
          { id: 'rec6', priority: 'Low', title: 'Run A/B Tests on CTAs', rationale: 'Current CTA click-through rate of 1.2% can be improved', action: 'Test 3 different CTA variants' },
        ],
      },
      created_at: '2026-05-28T14:30:00Z',
    },
    {
      user_id: userId,
      brand_name: 'Verve Studios',
      brand_slug: 'verve-studios',
      page_url: 'https://facebook.com/vervestudios',
      industry: 'Entertainment',
      score: 72,
      status: 'completed',
      report_data: {
        score: 72,
        brand: {
          name: 'Verve Studios', industry: 'Entertainment', category: 'Content Production',
          description: 'Creative studio producing engaging digital content for global audiences.',
          voice: ['Creative', 'Energetic', 'Authentic'],
        },
        audience: {
          ageGroups: [{ group: '18-24', percentage: 35 }, { group: '25-34', percentage: 32 }, { group: '35-44', percentage: 18 }, { group: '45-54', percentage: 10 }, { group: '55+', percentage: 5 }],
          genderSplit: [{ name: 'Male', value: 45 }, { name: 'Female', value: 50 }, { name: 'Other', value: 5 }],
          topLocations: [{ location: 'United States', percentage: 28 }, { location: 'Brazil', percentage: 15 }, { location: 'Philippines', percentage: 12 }, { location: 'India', percentage: 10 }, { location: 'Mexico', percentage: 8 }],
          deviceSplit: [{ name: 'Mobile', value: 78 }, { name: 'Desktop', value: 15 }, { name: 'Tablet', value: 7 }],
          peakEngagement: Array.from({ length: 7 }, (_, d) =>
            Array.from({ length: 24 }, (_, h) => ({
              day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][d],
              hour: h,
              intensity: Math.floor(Math.random() * 80) + 10,
            }))
          ).flat(),
        },
        content: {
          postTypeBreakdown: [{ name: 'Video', value: 55 }, { name: 'Image', value: 30 }, { name: 'Link', value: 10 }, { name: 'Text', value: 5 }],
          topThemes: ['New Releases', 'Behind the Scenes', 'Talent Spotlights', 'Fan Art', 'Industry Events', 'Tutorials', 'Community Challenges', 'Throwbacks'],
          postingFrequency: Array.from({ length: 12 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => ({
              week: w,
              day: d,
              count: Math.floor(Math.random() * 8),
            }))
          ).flat(),
          bestPost: { type: 'Video', caption: 'Announcing our biggest project yet', engagement: 28100, reach: 145000, date: '2026-05-20' },
        },
        swot: {
          strengths: ['Exceptional video quality', 'Strong brand identity', 'High engagement rates', 'Diverse content portfolio', 'Global audience reach'],
          weaknesses: ['Inconsistent posting schedule', 'Low cross-platform integration', 'Underdeveloped community guidelines', 'Limited interactive content', 'Insufficient localization'],
          opportunities: ['Short-form video trend', 'International market expansion', 'Brand collaboration potential', 'Interactive live streaming', 'NFT/digital collectibles'],
          threats: ['Platform algorithm dependency', 'Content saturation', 'Copyright challenges', 'Talent retention', 'Changing audience preferences'],
        },
        competitors: [
          { name: 'MegaMedia', followers: 3200000, engagementRate: 2.8, postFrequency: 20, brandScore: 88 },
          { name: 'CreaTV', followers: 1500000, engagementRate: 4.2, postFrequency: 14, brandScore: 76 },
          { name: 'PulseContent', followers: 980000, engagementRate: 5.5, postFrequency: 25, brandScore: 82 },
          { name: 'NexGenStudio', followers: 2100000, engagementRate: 3.1, postFrequency: 10, brandScore: 70 },
        ],
        marketTrends: {
          trendingTopics: [{ topic: 'Short Form Video', direction: 'up' }, { topic: 'AI Generated Content', direction: 'up' }, { topic: 'Live Shopping', direction: 'stable' }, { topic: 'Podcast Integration', direction: 'stable' }, { topic: 'AR Filters', direction: 'up' }, { topic: 'Traditional TV', direction: 'down' }],
          marketOpportunityScore: 68,
        },
        recommendations: [
          { id: 'rec1', priority: 'High', title: 'Establish Consistent Schedule', rationale: 'Audience engagement drops 40% with gaps >3 days', action: 'Create a 30-day content calendar' },
          { id: 'rec2', priority: 'High', title: 'Increase Interactive Content', rationale: 'Polls and Q&As get 3x more comments than standard posts', action: 'Add 2 interactive posts per week' },
          { id: 'rec3', priority: 'Medium', title: 'Localize for Top Markets', rationale: 'Brazil and Philippines make up 27% of audience with low engagement', action: 'Add Portuguese and Tagalog subtitles' },
          { id: 'rec4', priority: 'Medium', title: 'Cross-Platform Promotion', rationale: 'Only 30% of Facebook audience follows on Instagram', action: 'Create platform-specific teasers' },
          { id: 'rec5', priority: 'Low', title: 'Launch Community Challenges', rationale: 'Challenges increase user participation by 150%', action: 'Launch monthly themed challenge' },
          { id: 'rec6', priority: 'Low', title: 'Develop Talent Program', rationale: 'Talent spotlights get 2x average engagement', action: 'Create featured artist series' },
        ],
      },
      created_at: '2026-05-25T10:15:00Z',
    },
    {
      user_id: userId,
      brand_name: 'GreenLeaf Organics',
      brand_slug: 'greenleaf-organics',
      page_url: 'https://facebook.com/greenleaforganics',
      industry: 'Health & Wellness',
      score: 91,
      status: 'completed',
      report_data: {
        score: 91,
        brand: {
          name: 'GreenLeaf Organics', industry: 'Health & Wellness', category: 'Organic Food',
          description: 'Premium organic food brand committed to sustainable farming and healthy living.',
          voice: ['Warm', 'Educational', 'Trustworthy'],
        },
        audience: {
          ageGroups: [{ group: '18-24', percentage: 15 }, { group: '25-34', percentage: 30 }, { group: '35-44', percentage: 28 }, { group: '45-54', percentage: 20 }, { group: '55+', percentage: 7 }],
          genderSplit: [{ name: 'Male', value: 35 }, { name: 'Female', value: 62 }, { name: 'Other', value: 3 }],
          topLocations: [{ location: 'United States', percentage: 40 }, { location: 'Canada', percentage: 15 }, { location: 'Australia', percentage: 10 }, { location: 'United Kingdom', percentage: 9 }, { location: 'Germany', percentage: 6 }],
          deviceSplit: [{ name: 'Mobile', value: 65 }, { name: 'Desktop', value: 25 }, { name: 'Tablet', value: 10 }],
          peakEngagement: Array.from({ length: 7 }, (_, d) =>
            Array.from({ length: 24 }, (_, h) => ({
              day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][d],
              hour: h,
              intensity: Math.floor(Math.random() * 80) + 10,
            }))
          ).flat(),
        },
        content: {
          postTypeBreakdown: [{ name: 'Image', value: 45 }, { name: 'Video', value: 30 }, { name: 'Link', value: 18 }, { name: 'Text', value: 7 }],
          topThemes: ['Healthy Recipes', 'Sustainability Tips', 'Product Highlights', 'Customer Testimonials', 'Farm Stories', 'Nutrition Education', 'Seasonal Produce', 'Community Events'],
          postingFrequency: Array.from({ length: 12 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => ({
              week: w,
              day: d,
              count: Math.floor(Math.random() * 8),
            }))
          ).flat(),
          bestPost: { type: 'Image', caption: 'Farm fresh organic produce delivered to your door', engagement: 22400, reach: 112000, date: '2026-05-22' },
        },
        swot: {
          strengths: ['Beautiful food photography', 'Strong community values', 'High customer loyalty', 'Educational content strategy', 'Sustainability narrative'],
          weaknesses: ['Limited video content', 'Seasonal product dependency', 'Narrow audience targeting', 'Low FB Shop integration', 'Insufficient user-generated content'],
          opportunities: ['Organic food market growth', 'Meal kit trend', 'Corporate wellness programs', 'Local farmer partnerships', 'Subscription model expansion'],
          threats: ['Rising ingredient costs', 'Greenwashing competitors', 'Supply chain disruptions', 'Changing dietary trends', 'Regulatory changes'],
        },
        competitors: [
          { name: 'PureHarvest', followers: 450000, engagementRate: 6.2, postFrequency: 14, brandScore: 88 },
          { name: 'NaturePlate', followers: 380000, engagementRate: 5.8, postFrequency: 10, brandScore: 82 },
          { name: 'EcoBites', followers: 720000, engagementRate: 4.5, postFrequency: 20, brandScore: 75 },
          { name: 'FreshRoots', followers: 290000, engagementRate: 7.1, postFrequency: 8, brandScore: 79 },
        ],
        marketTrends: {
          trendingTopics: [{ topic: 'Plant-Based Diet', direction: 'up' }, { topic: 'Regenerative Agriculture', direction: 'up' }, { topic: 'Food Transparency', direction: 'stable' }, { topic: 'Fermented Foods', direction: 'stable' }, { topic: 'Local Sourcing', direction: 'up' }, { topic: 'Processed Foods', direction: 'down' }],
          marketOpportunityScore: 85,
        },
        recommendations: [
          { id: 'rec1', priority: 'High', title: 'Expand Video Recipe Content', rationale: 'Video posts get 2.5x engagement but only 30% of content', action: 'Produce 2 recipe videos per week' },
          { id: 'rec2', priority: 'High', title: 'Launch FB Shop Integration', rationale: 'Only 12% of traffic converts, shop could increase to 30%', action: 'Set up product catalog and shoppable posts' },
          { id: 'rec3', priority: 'Medium', title: 'Customer Spotlight Series', rationale: 'Testimonial posts have highest engagement rate at 8.5%', action: 'Weekly customer feature with interview' },
          { id: 'rec4', priority: 'Medium', title: 'Develop Meal Kit Content', rationale: 'Meal kit interest grew 200% in the segment', action: 'Create weekly meal plan posts' },
          { id: 'rec5', priority: 'Low', title: 'Corporate Wellness Program', rationale: 'B2B segment could add 40% revenue', action: 'Create B2B landing page and case studies' },
          { id: 'rec6', priority: 'Low', title: 'Sustainability Report Series', rationale: 'Transparency builds trust with 78% of audience', action: 'Publish quarterly impact reports' },
        ],
      },
      created_at: '2026-05-20T08:45:00Z',
    },
  ];

  for (const report of reports) {
    const { error } = await supabase.from('reports').insert(report);
    if (error) console.error('Failed to insert report:', error.message);
  }
  console.log(`Inserted ${reports.length} sample reports`);

  const competitors = [
    { user_id: userId, page_url: 'https://facebook.com/techgiant', page_name: 'TechGiant', category: 'Technology', followers: 2500000, status: 'analyzed', overall_sentiment: 72, threat_level: 'high' },
    { user_id: userId, page_url: 'https://facebook.com/nextgen', page_name: 'NextGen Devices', category: 'Technology', followers: 890000, status: 'analyzed', overall_sentiment: 65, threat_level: 'medium' },
    { user_id: userId, page_url: 'https://facebook.com/gadgetpro', page_name: 'GadgetPro', category: 'Technology', followers: 450000, status: 'pending', overall_sentiment: 0, threat_level: 'low' },
  ];

  for (const comp of competitors) {
    const { error } = await supabase.from('competitors').insert(comp);
    if (error) console.error('Failed to insert competitor:', error.message);
  }
  console.log(`Inserted ${competitors.length} sample competitors`);

  const comments = [
    {
      user_id: userId, post_preview: 'New product launch video', commenter_name: 'Sarah Johnson',
      commenter_avatar: null, comment: 'Absolutely love this! Been waiting for something like this.',
      sentiment: 'positive', sentiment_score: 92, category: 'praise', status: 'pending', is_alert: false, likes: 24,
      ai_suggested_reply: 'Thank you so much, Sarah! We\'re thrilled you love it. Stay tuned for more exciting updates!',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      user_id: userId, post_preview: 'Customer support announcement', commenter_name: 'Mark Rivera',
      commenter_avatar: null, comment: 'This is completely unacceptable. I\'ve been waiting for 3 weeks with no response.',
      sentiment: 'negative', sentiment_score: 12, category: 'complaint', status: 'pending', is_alert: true, likes: 8,
      ai_suggested_reply: 'Hi Mark, we sincerely apologize for the delay. We\'d like to prioritize your case immediately. Please DM us your ticket number and we\'ll escalate it right away.',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      user_id: userId, post_preview: 'Behind the scenes', commenter_name: 'Emily Chen',
      commenter_avatar: null, comment: 'How do I get early access to the beta?',
      sentiment: 'neutral', sentiment_score: 50, category: 'question', status: 'pending', is_alert: true, likes: 15,
      ai_suggested_reply: 'Great question, Emily! Early access beta sign-ups are available through our website. Head to the Beta Program section and you\'ll be on the list!',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      user_id: userId, post_preview: 'Weekly tech tips', commenter_name: 'Alex Thompson',
      commenter_avatar: null, comment: 'Can you compare this with the previous model?',
      sentiment: 'neutral', sentiment_score: 48, category: 'question', status: 'replied', is_alert: false, likes: 6,
      ai_suggested_reply: 'Great suggestion, Alex! We\'re actually working on a detailed comparison post. Keep an eye out for it later this week!',
      replied_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      user_id: userId, post_preview: 'Product teaser', commenter_name: 'Jordan Lee',
      commenter_avatar: null, comment: 'Nice design but the price point seems high for what you get.',
      sentiment: 'negative', sentiment_score: 35, category: 'feedback', status: 'pending', is_alert: false, likes: 12,
      ai_suggested_reply: 'Thanks for the honest feedback, Jordan! We\'ve designed this with premium components for longevity. We also offer flexible payment plans to make it more accessible.',
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
  ];

  for (const comment of comments) {
    const { error } = await supabase.from('comments').insert(comment);
    if (error) console.error('Failed to insert comment:', error.message);
  }
  console.log(`Inserted ${comments.length} sample comments`);

  console.log('\nSeed complete!');
  console.log(`Login: ${email} / ${password}`);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
