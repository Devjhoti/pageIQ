import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useReport } from '../../hooks/useReport'
import { cn } from '../../lib/utils'
import Card from '../ui/Card'

export default function MarketTrends() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const market = data?.market || data?.marketTrends || {}

  const keywords = market?.industryKeywords || []
  const trendingTopics = market?.trendingTopics || []
  const opportunityScore = market?.marketOpportunityScore || 0
  const bangladeshContext = market?.bangladeshContext || null

  if (!market) return null

  const directionIcon = {
    up: { icon: TrendingUp, color: 'text-[--success]' },
    down: { icon: TrendingDown, color: 'text-[--danger]' },
    stable: { icon: Minus, color: 'text-[--text-muted]' },
  }

  return (
    <section className="space-y-6">
      {bangladeshContext && (
        <div className="p-5 rounded-xl border border-[--accent]/20 bg-[--accent]/5">
          <p className="text-xs font-semibold text-[--accent] font-body uppercase tracking-wider mb-2">
            Bangladesh Market Insight
          </p>
          <p className="text-sm text-[--text-primary] font-body leading-relaxed">
            {bangladeshContext}
          </p>
        </div>
      )}

      {keywords.length > 0 && (
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Industry Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="text-xs px-3 py-1 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-secondary] font-body">
                {kw}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {trendingTopics.length > 0 && (
          <Card>
            <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Trending Topics</h4>
            <div className="space-y-2">
              {trendingTopics.map((t, i) => {
                const { icon: Icon, color } = directionIcon[t.direction] || directionIcon.stable
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[--border] bg-[--bg-secondary]">
                    <span className="text-sm text-[--text-primary] font-body">{t.topic}</span>
                    <div className="flex items-center gap-2">
                      {t.relevance && (
                        <span className="text-xs text-[--text-muted] font-body hidden sm:inline max-w-[120px] truncate">
                          {t.relevance}
                        </span>
                      )}
                      <Icon size={14} className={cn(color)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Market Opportunity Score</h4>
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="relative w-32 h-32">
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--accent-secondary)" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 56} strokeDashoffset={2 * Math.PI * 56 * (1 - opportunityScore / 100)} transform="rotate(-90 64 64)" />
                <text x="64" y="64" textAnchor="middle" dominantBaseline="central" fill="var(--text-primary)" fontSize="28" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{opportunityScore}</text>
              </svg>
            </div>
            <p className="text-sm text-[--text-muted] font-body mt-3 text-center max-w-xs">Your industry shows strong growth potential in key categories.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
