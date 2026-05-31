import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateGeneralReport(pageUrl, brandName, realPageData = null) {
  const prompt = `You are a senior brand intelligence analyst with deep knowledge of digital marketing, social media strategy, and the Bangladeshi market.

Analyze the Facebook business page for: ${brandName}
Page URL: ${pageUrl}
${realPageData ? `
REAL FACEBOOK DATA (use these exact numbers — do not estimate):
- Page Name: ${realPageData.name}
- Real Follower Count: ${realPageData.fan_count || realPageData.followers_count || 'unavailable'}
- Category: ${realPageData.category}
- About: ${realPageData.about || realPageData.description || 'not provided'}
- Verification Status: ${realPageData.verification_status || 'unverified'}
- Website: ${realPageData.website || 'not listed'}

Use the real follower count above in your response. Do not estimate or use ranges if the real number is provided.
` : '(No real-time Facebook data available — use your training knowledge)'}

Return ONLY a valid JSON object with EXACTLY this structure. No markdown. No explanation.

{
  "reportType": "general",
  "brandScore": <integer 0-100>,
  "brand": {
    "name": "${realPageData?.name || brandName} — use the real page name, not the URL slug",
    "industry": "<industry>",
    "category": "<specific category>",
    "summary": "<2-3 sentences about this brand>",
    "voiceTags": ["<tag1>", "<tag2>", "<tag3>"],
    "estimatedFollowers": "${realPageData?.fan_count ? realPageData.fan_count + ' (real)' : 'estimated range'}",
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
