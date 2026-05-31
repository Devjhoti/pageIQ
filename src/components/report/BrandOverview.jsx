import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'
import { Users, Eye, BarChart3 } from 'lucide-react'

export default function BrandOverview() {
  const { activeReport, reportMeta } = useReport()
  const data = activeReport || {}
  const brand = data?.brand || {}

  const rawFollowers = brand?.actualFollowers ?? brand?.estimatedFollowers ?? null
  const rawEngagement = brand?.actualEngagementRate ?? brand?.estimatedEngagement ?? null
  const reportType = data?.reportType || 'general'

  const displayFollowers = rawFollowers === null
    ? '—'
    : typeof rawFollowers === 'number'
      ? rawFollowers.toLocaleString()
      : `~${rawFollowers}`

  const displayEngagement = rawEngagement || '—'
  const brandName = brand?.name || reportMeta?.brand_name || '—'
  const industry = brand?.industry || '—'
  const category = brand?.category || '—'
  const summary = brand?.summary || 'No description available.'
  const voiceTags = brand?.voiceTags || []
  const presenceStrength = brand?.presenceStrength || 0

  const stats = [
    { icon: Users, label: 'Followers', value: displayFollowers },
    { icon: BarChart3, label: 'Engagement Rate', value: displayEngagement },
  ]

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Brand</span>
          <p className="text-sm text-[--text-primary] font-body">{brandName}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Category</span>
          <p className="text-sm text-[--text-primary] font-body">{category || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Industry</span>
          <p className="text-sm text-[--text-primary] font-body">{industry}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-[--text-muted] font-body">Presence Strength</span>
          <p className="text-sm text-[--text-primary] font-body">{presenceStrength}/100</p>
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
            {reportType === 'general' && rawFollowers !== null && (
              <p className="text-xs text-[--text-muted] font-body mt-0.5">Estimated</p>
            )}
          </Card>
        ))}
        <Card>
          <div className="text-xs text-[--text-muted] font-body mb-2">Brand Voice</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {voiceTags.length > 0 ? voiceTags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[--accent-glow] border border-[--accent]/20 text-xs text-[--accent] font-body">
                {tag}
              </span>
            )) : (
              <span className="text-xs text-[--text-muted] font-body">—</span>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="text-xs text-[--text-muted] font-body mb-2">Brand Summary</div>
        <p className="text-sm text-[--text-secondary] font-body leading-relaxed">{summary}</p>
      </Card>
    </section>
  )
}
