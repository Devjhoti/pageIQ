import axios from 'axios'

export async function fetchBrandContext(brandName, pageUrl) {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    console.log('SERPAPI_KEY not set — skipping web enrichment')
    return null
  }

  try {
    const [brandResult, newsResult] = await Promise.allSettled([
      // Search 1 — Brand overview
      axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google',
          q: `${brandName} Bangladesh facebook brand`,
          api_key: apiKey,
          num: 5,
          hl: 'en',
          gl: 'bd',
        },
        timeout: 8000,
      }),
      // Search 2 — Recent news
      axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google',
          q: `"${brandName}" Bangladesh 2025 2026`,
          api_key: apiKey,
          num: 5,
          tbm: 'nws',
          hl: 'en',
          gl: 'bd',
        },
        timeout: 8000,
      }),
    ])

    const brandData = brandResult.status === 'fulfilled' ? brandResult.value.data : null
    const newsData = newsResult.status === 'fulfilled' ? newsResult.value.data : null

    const brandSnippets = brandData?.organic_results
      ?.slice(0, 3)
      ?.map(r => `${r.title}: ${r.snippet}`)
      ?.filter(Boolean) || []

    const newsSnippets = newsData?.news_results
      ?.slice(0, 3)
      ?.map(r => `[${r.date}] ${r.title}: ${r.snippet}`)
      ?.filter(Boolean) || []

    const knowledgePanel = brandData?.knowledge_graph || null

    const recentNews = newsData?.news_results
      ?.slice(0, 3)
      ?.map(r => ({
        headline: r.title,
        date: r.date,
        snippet: r.snippet,
        source: r.source,
      })) || []

    return {
      brandSnippets,
      newsSnippets,
      knowledgePanel,
      recentNews,
      searchSummary: [...brandSnippets, ...newsSnippets].join('\n'),
    }
  } catch (err) {
    console.log('SerpAPI fetch failed (non-critical):', err.message)
    return null
  }
}
