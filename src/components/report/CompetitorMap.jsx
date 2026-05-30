import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { mockReportData } from '../../lib/mockData'
import Card from '../ui/Card'

export default function CompetitorMap({ reportId = 'b1' }) {
  const data = mockReportData(reportId)
  const { competitors } = data

  const radarData = [
    { metric: 'Followers', brand: data.brand.followers / 10000, ...Object.fromEntries(competitors.map((c) => [c.name, Number(c.followers.replace('M', '')) * 100])) },
    { metric: 'Engagement', brand: data.brand.engagementRate * 10, ...Object.fromEntries(competitors.map((c) => [c.name, c.engagementRate * 10])) },
    { metric: 'Post Freq', brand: 3, ...Object.fromEntries(competitors.map((c) => [c.name, Number(c.postFrequency.split('/')[0])])) },
    { metric: 'Brand Score', brand: data.score, ...Object.fromEntries(competitors.map((c) => [c.name, c.brandScore])) },
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
              <td className="px-4 py-3 font-medium text-[--accent] font-body">{data.brand.name} (You)</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">{data.brand.followers.toLocaleString()}</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">{data.brand.engagementRate}%</td>
              <td className="px-4 py-3 text-[--text-primary] font-body">—</td>
              <td className="px-4 py-3 font-mono text-[--accent]">{data.score}</td>
            </tr>
            {competitors.map((c, i) => (
              <tr key={c.name} className="border-b border-[--border] hover:bg-[--bg-tertiary]/50">
                <td className="px-4 py-3 text-[--text-primary] font-body">{c.name}</td>
                <td className="px-4 py-3 text-[--text-secondary] font-body">{c.followers}</td>
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
              <Radar name={data.brand.name} dataKey="brand" stroke={colors[0]} fill={colors[0]} fillOpacity={0.15} strokeWidth={2} />
              {competitors.map((c, i) => (
                <Radar key={c.name} name={c.name} dataKey={c.name} stroke={colors[(i + 1) % colors.length]} fill={colors[(i + 1) % colors.length]} fillOpacity={0.05} strokeWidth={1.5} />
              ))}
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  )
}
