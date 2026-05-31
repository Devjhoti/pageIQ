import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { getReport } from '../lib/services/reportsService'
import { useReport } from '../hooks/useReport'
import PageWrapper from '../components/layout/PageWrapper'
import ReportHeader from '../components/report/ReportHeader'
import BrandOverview from '../components/report/BrandOverview'
import AudienceInsights from '../components/report/AudienceInsights'
import ContentAnalysis from '../components/report/ContentAnalysis'
import SWOTMatrix from '../components/report/SWOTMatrix'
import CompetitorMap from '../components/report/CompetitorMap'
import MarketTrends from '../components/report/MarketTrends'
import EngagementMetrics from '../components/report/EngagementMetrics'
import Recommendations from '../components/report/Recommendations'
import Button from '../components/ui/Button'
import { Download, Share2, RefreshCw } from 'lucide-react'

const sections = [
  { id: 'overview', label: 'Brand Overview' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'audience', label: 'Audience' },
  { id: 'content', label: 'Content' },
  { id: 'swot', label: 'SWOT' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'trends', label: 'Market Trends' },
  { id: 'recommendations', label: 'Recommendations' },
]

export default function ReportView() {
  const { id } = useParams()
  const [activeSection, setActiveSection] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sectionRefs = useRef({})
  const { setActiveReport, setReportMeta, activeReport } = useReport()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getReport(id)
      .then((report) => {
        setReportMeta({ id: report.id, brand_name: report.brand_name, score: report.score, status: report.status })
        setActiveReport(report.report_data || report)
        console.log('activeReport:', activeReport)
      })
      .catch((err) => setError(err.message || 'Failed to load report'))
      .finally(() => setLoading(false))

    return () => { setActiveReport(null); setReportMeta(null) }
  }, [id, setActiveReport, setReportMeta])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-100px 0px -60% 0px' }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [loading])

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 rounded-xl bg-[--bg-tertiary]" />
          <div className="h-64 rounded-xl bg-[--bg-tertiary]" />
          <div className="h-64 rounded-xl bg-[--bg-tertiary]" />
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="border border-[--danger]/30 bg-[--danger]/5 rounded-xl p-8 text-center">
          <p className="text-sm text-[--danger] font-body">{error}</p>
          <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="flex gap-8">
        <nav className="hidden lg:flex flex-col w-44 shrink-0 sticky top-20 self-start space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={cn(
                'text-left text-xs py-1.5 px-2 rounded transition-colors font-body border-l-2',
                activeSection === s.id
                  ? 'text-[--accent] border-[--accent] bg-[--accent]/5 font-medium'
                  : 'text-[--text-muted] border-transparent hover:text-[--text-secondary]'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 space-y-10">
          <ReportHeader reportId={id} />

          {activeReport?.reportType === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-[--accent]/20 bg-[--accent]/5"
            >
              <div className="w-8 h-8 rounded-lg bg-[--accent]/10 flex items-center justify-center shrink-0">
                <span className="text-[--accent] text-sm">{'\u26A1'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[--text-primary] font-body">
                  General Report — Real metrics not included
                </p>
                <p className="text-xs text-[--text-secondary] font-body mt-0.5">
                  Connect Facebook to unlock actual engagement data, audience demographics, and post performance.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard/new')}
                className="shrink-0 text-xs font-semibold text-[--accent] hover:underline font-body"
              >
                Upgrade Report →
              </button>
            </motion.div>
          )}

          <section id="overview">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Brand Overview</h3>
            <BrandOverview />
          </section>

          <section id="engagement" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Engagement Metrics</h3>
            <EngagementMetrics />
          </section>

          <section id="audience" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Audience Insights</h3>
            <AudienceInsights />
          </section>

          <section id="content" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Content Analysis</h3>
            <ContentAnalysis />
          </section>

          <section id="swot" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">SWOT Analysis</h3>
            <SWOTMatrix />
          </section>

          <section id="competitors" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Competitor Intelligence</h3>
            <CompetitorMap />
          </section>

          <section id="trends" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Market Trends</h3>
            <MarketTrends />
          </section>

          <section id="recommendations" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">AI Recommendations</h3>
            <Recommendations />
          </section>

          <div className="flex items-center justify-between pt-6 border-t border-[--border]">
            <Button variant="secondary" size="sm"><RefreshCw size={14} /> Re-analyze</Button>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Download size={14} /> Download PDF</Button>
              <Button variant="secondary" size="sm"><Share2 size={14} /> Share Report</Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
