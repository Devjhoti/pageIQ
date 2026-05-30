import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '../lib/utils'
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
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -60% 0px' }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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

          <section id="overview" ref={(el) => (sectionRefs.current.overview = el)}>
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Brand Overview</h3>
            <BrandOverview reportId={id} />
          </section>

          <section id="engagement" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Engagement Metrics</h3>
            <EngagementMetrics reportId={id} />
          </section>

          <section id="audience" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Audience Insights</h3>
            <AudienceInsights reportId={id} />
          </section>

          <section id="content" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Content Analysis</h3>
            <ContentAnalysis reportId={id} />
          </section>

          <section id="swot" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">SWOT Analysis</h3>
            <SWOTMatrix reportId={id} />
          </section>

          <section id="competitors" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Competitor Intelligence</h3>
            <CompetitorMap reportId={id} />
          </section>

          <section id="trends" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">Market Trends</h3>
            <MarketTrends reportId={id} />
          </section>

          <section id="recommendations" className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-5">AI Recommendations</h3>
            <Recommendations reportId={id} />
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
