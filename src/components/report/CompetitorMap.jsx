import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '../../lib/utils'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'

export default function CompetitorMap() {
  const { activeReport, reportMeta } = useReport()
  const data = activeReport || {}
  const competitors = data?.competitors || []
  const reportType = data?.reportType || 'general'
  const brandName = data?.brand?.name || reportMeta?.brand_name || 'You'
  const brandScore = data?.score || data?.brandScore || 0

  if (!competitors || competitors.length === 0) return null

  const parseFollowers = (f) => {
    if (typeof f === 'number') return f / 10000
    if (typeof f === 'string') return Number(f.replace(/[^0-9.]/g, '')) * (f.includes('M') ? 100 : f.includes('K') ? 0.1 : 1)
    return 0
  }

  const rawFollowers = data?.brand?.actualFollowers ?? data?.brand?.estimatedFollowers ?? null
  const brandFollowerValue = rawFollowers === null ? 0 : typeof rawFollowers === 'number' ? rawFollowers / 10000 : parseFollowers(rawFollowers)

  const radarData = [
    { metric: 'Followers', brand: brandFollowerValue, ...Object.fromEntries(competitors.map((c) => [c.name, parseFollowers(c.estimatedFollowers || c.actualFollowers || 0)])) },
    { metric: 'Brand Score', brand: brandScore, ...Object.fromEntries(competitors.map((c) => [c.name, typeof c.brandScore === 'number' ? c.brandScore : 50])) },
  ]

  const colors = ['var(--accent)', 'var(--accent-secondary)', 'var(--warning)', 'var(--text-muted)', 'var(--danger)']

  return (
    <section className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border] text-left">
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Competitor</th>
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Followers</th>
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Threat</th>
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Positioning</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => {
              const followerDisplay = c.actualFollowers != null
                ? c.actualFollowers.toLocaleString()
                : c.estimatedFollowers
                  ? `~${c.estimatedFollowers}`
                  : '—'
              return (
                <tr key={c.name || i} className="border-b border-[--border] hover:bg-[--bg-tertiary]/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[--text-primary] font-body">{c.name}</p>
                    {c.keyDifferentiator && (
                      <p className="text-xs text-[--text-muted] font-body mt-0.5">{c.keyDifferentiator}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[--text-secondary] font-body">{followerDisplay}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-body',
                      c.threat === 'High' ? 'bg-[--danger]/10 text-[--danger]' :
                      c.threat === 'Medium' ? 'bg-[--warning]/10 text-[--warning]' :
                      'bg-[--success]/10 text-[--success]'
                    )}>
                      {c.threat || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--text-secondary] font-body text-xs">{c.positioning || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Multi-Brand Comparison</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Radar name={brandName} dataKey="brand" stroke={colors[0]} fill={colors[0]} fillOpacity={0.15} strokeWidth={2} />
              {competitors.map((c, i) => (
                <Radar key={c.name} name={c.name} dataKey={c.name} stroke={colors[(i + 1) % colors.length]} fill={colors[(i + 1) % colors.length]} fillOpacity={0.05} strokeWidth={1.5} />
              ))}
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  )
}
