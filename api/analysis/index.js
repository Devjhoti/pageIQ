import { handleCors } from '../_lib/cors.js'
import { supabase } from '../_lib/supabase.js'
import { requireAuth } from '../_lib/auth.js'
import { generateGeneralReport, generateComprehensiveReport } from '../_lib/groq.js'
import { extractPageSlug, fetchPublicPageData, fetchPagePosts, fetchPageInsights } from '../_lib/facebook.js'
import { fetchBrandContext } from '../_lib/serp.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { pageUrl, brandName, analysisType = 'general', fbAccessToken = null } = req.body

  if (!pageUrl || !brandName) {
    return res.status(400).json({ error: 'pageUrl and brandName are required' })
  }

  try {
    let reportData
    let fbPageId = null

    if (analysisType === 'comprehensive' && fbAccessToken) {
      const pageSlug = extractPageSlug(pageUrl)
      if (!pageSlug) throw new Error('Could not extract page identifier from URL')
      const fbPageData = await fetchPublicPageData(pageSlug, fbAccessToken)
      fbPageId = fbPageData.id
      const posts = await fetchPagePosts(fbPageId, fbAccessToken)
      const insights = await fetchPageInsights(fbPageId, fbAccessToken)
      reportData = await generateComprehensiveReport(pageUrl, brandName, fbPageData, posts, insights)
    } else {
      // Run FB fetch and SerpAPI enrichment in parallel
      let realPageData = null
      let brandContext = null

      const [fbResult, serpResult] = await Promise.allSettled([
        // Attempt FB public page fetch
        (async () => {
          const { extractPageSlug, fetchPublicPageData, getAppAccessToken } = await import('../_lib/facebook.js')
          const pageSlug = extractPageSlug(pageUrl)
          if (!pageSlug) return null
          const appToken = getAppAccessToken()
          return await fetchPublicPageData(pageSlug, appToken)
        })(),
        // SerpAPI web enrichment
        fetchBrandContext(brandName, pageUrl),
      ])

      if (fbResult.status === 'fulfilled') realPageData = fbResult.value
      else console.log('FB fetch failed (non-critical):', fbResult.reason?.message)

      if (serpResult.status === 'fulfilled') brandContext = serpResult.value
      else console.log('SerpAPI failed (non-critical):', serpResult.reason?.message)

      reportData = await generateGeneralReport(pageUrl, brandName, realPageData, brandContext)
    }

    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        brand_name: reportData.brand?.name || brandName,
        brand_slug: slug,
        page_url: pageUrl,
        industry: reportData.brand?.industry || '',
        score: reportData.score || reportData.brandScore || 0,
        status: 'completed',
        report_data: reportData,
        analysis_type: analysisType,
        fb_page_id: fbPageId,
      })
      .select()
      .single()

    if (reportError) throw reportError

    res.json({ id: report.id, reportId: report.id, status: 'completed' })

  } catch (err) {
    console.error('Analysis failed:', err.message)
    res.status(500).json({ error: err.message || 'Analysis failed' })
  }
}
