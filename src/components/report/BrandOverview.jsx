import { useReport } from '../../hooks/useReport'
import { formatNumber } from '../../lib/utils'
import Card from '../ui/Card'
import { Users, Eye, BarChart3 } from 'lucide-react'

export default function BrandOverview() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const { brand } = data

  if (!brand) return null

  const stats = [
    { icon: Users, label: 'Followers', value: formatNumber(brand.followers || 0) },
    { icon: Eye, label: 'Avg Weekly Reach', value: formatNumber(brand.avgWeeklyReach || 0) },
    { icon: BarChart3, label: 'Engagement Rate', value: `${brand.engagementRate || 0}%` },
  ]

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Category</span>
          <p className="text-sm text-[--text-primary] font-body">{brand.category || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Industry</span>
          <p className="text-sm text-[--text-primary] font-body">{brand.industry || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Founded</span>
          <p className="text-sm text-[--text-primary] font-body">{brand.founded || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Page ID</span>
          <p className="text-sm text-[--text-primary] font-body font-mono">{brand.id || '—'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} className="text-[--accent]" />
              <span className="text-xs text-[--text-muted] font-body">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-[--text-primary] font-display tabular-nums">{s.value}</p>
          </Card>
        ))}
        <Card>
          <div className="text-xs text-[--text-muted] font-body mb-2">Brand Voice</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(brand.voice || []).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[--accent-glow] border border-[--accent]/20 text-xs text-[--accent] font-body">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="text-xs text-[--text-muted] font-body mb-2">Brand Description</div>
        <p className="text-sm text-[--text-secondary] font-body leading-relaxed">{brand.description || 'No description available.'}</p>
      </Card>
    </section>
  )
}
