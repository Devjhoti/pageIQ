import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'

export default function CompetitorMap() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const { competitors, brand, score } = data

  if (!competitors || !brand) return null

  const parseFollowers = (f) => {
    if (typeof f === 'string') return Number(f.replace(/[^0-9.]/g, '')) * (f.includes('M') ? 100 : 1)
    return (f || 0) / 10000
  }

  const radarData = [
    { metric: 'Followers', brand: parseFollowers(brand.followers), ...Object.fromEntries(competitors.map((c) => [c.name, parseFollowers(c.followers)])) },
    { metric: 'Engagement', brand: (brand.engagementRate || 0) * 10, ...Object.fromEntries(competitors.map((c) => [c.name, (c.engagementRate || 0) * 10])) },
    { metric: 'Post Freq', brand: 3, ...Object.fromEntries(competitors.map((c) => [c.name, typeof c.postFrequency === 'number' ? c.postFrequency : Number(String(c.postFrequency).split('/')[0]) || 10])) },
    { metric: 'Brand Score', brand: score || 0, ...Object.fromEntries(competitors.map((c) => [c.name, c.brandScore || 0])) },
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
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Engagement</th>
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Post Frequency</th>
              <th className="px-4 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Brand Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[--accent]/20 bg-[--accent]/5">
              <td className="px-4 py-3 font-medium text-[--accent] font-body">{brand.name} (You)</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">{(brand.followers || 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">{brand.engagementRate || 0}%</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">—</td>
              <td className="px-4 py-3 font-mono text-[--accent]">{score || 0}</td>
            </tr>
            {competitors.map((c, i) => (
              <tr key={c.name} className="border-b border-[--border] hover:bg-[--bg-tertiary]/50">
                <td className="px-4 py-3 text-[--text-primary] font-body">{c.name}</td>
                <td className="px-4 py-3 text-[--text-secondary] font-body">{typeof c.followers === 'number' ? c.followers.toLocaleString() : c.followers}</td>
                <td className="px-4 py-3 text-[--text-secondary] font-body">{c.engagementRate}%</td>
                <td className="px-4 py-3 text-[--text-secondary] font-body">{c.postFrequency}</td>
                <td className="px-4 py-3 font-mono text-[--text-secondary]">{c.brandScore}</td>
              </tr>
            ))}
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
              <Radar name={brand.name} dataKey="brand" stroke={colors[0]} fill={colors[0]} fillOpacity={0.15} strokeWidth={2} />
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
