const Groq = require('groq-sdk');
const env = require('../config/env');

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

async function generateGeneralReport(pageUrl, brandName) {
  const prompt = `You are a senior brand intelligence analyst with deep knowledge of digital marketing, social media strategy, and the Bangladeshi market.

Analyze the Facebook business page for: ${brandName}
Page URL: ${pageUrl}

Use your knowledge of this brand, its industry, the Bangladeshi market context, and general digital marketing best practices to generate a comprehensive brand intelligence report.

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation. All fields required. Be specific — reference the actual brand, real competitors in their space, and real market dynamics. Do not use placeholder text.

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
      "threat": "High",
      "keyDifferentiator": "<what makes them different>"
    }
  ],
  "market": {
    "industryKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
    "trendingTopics": [
      { "topic": "<topic>", "direction": "up", "relevance": "<why it matters>" }
    ],
    "marketOpportunityScore": <integer 0-100>,
    "bangladeshContext": "<specific insight about this industry in Bangladesh>"
  },
  "recommendations": [
    {
      "priority": "High",
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
}`;

  return await callGroq(prompt);
}

async function generateComprehensiveReport(pageUrl, brandName, fbPageData, fbPosts, fbInsights) {
  const prompt = `You are a senior brand intelligence analyst. Analyze the following real Facebook page data and generate a comprehensive brand intelligence report.

Brand: ${brandName}
Page URL: ${pageUrl}

REAL PAGE DATA:
${JSON.stringify(fbPageData, null, 2)}

RECENT POSTS (last 30):
${JSON.stringify(fbPosts, null, 2)}

PAGE INSIGHTS:
${JSON.stringify(fbInsights, null, 2)}

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation. Every field must reflect the actual data provided.

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
    "bangladeshContext": "<specific market insight>"
  },
  "recommendations": [
    {
      "priority": "High",
      "title": "<action title>",
      "rationale": "<grounded in actual data>",
      "action": "<specific first step>",
      "estimatedImpact": "<expected improvement>"
    }
  ]
}`;

  return await callGroq(prompt);
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
      });

      const text = completion.choices[0]?.message?.content || '';

      try {
        return JSON.parse(text);
      } catch {
        const clean = text.replace(/```json|```/g, '').trim();
        return JSON.parse(clean);
      }

    } catch (err) {
      const isRateLimit =
        err.message?.includes('rate') ||
        err.message?.includes('429') ||
        err.status === 429;

      if (isRateLimit && attempt < retries) {
        console.log(`Groq rate limit hit. Retrying in ${delayMs / 1000}s... (attempt ${attempt}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw err;
    }
  }
}

module.exports = { generateGeneralReport, generateComprehensiveReport };
