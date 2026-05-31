import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ContentAnalysis() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const { content } = data

  if (!content) return null

  const colors = ['var(--accent)', 'var(--accent-secondary)', 'var(--warning)', 'var(--text-muted)']

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Post Type Breakdown</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={content.postTypeBreakdown || []} cx="50%" cy="50%" outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {(content.postTypeBreakdown || []).map((_, i) => (<Cell key={i} fill={colors[i]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Top Content Themes</h4>
          <div className="flex flex-wrap gap-2 items-center h-48 content-center">
            {(content.topThemes || []).map((theme, i) => {
              const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg']
              const size = sizes[i % sizes.length]
              return (
                <span key={theme} className={`${size} px-3 py-1 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/30 transition-colors cursor-default font-body`}>
                  {theme}
                </span>
              )
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Posting Frequency (Last 12 Weeks)</h4>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] min-w-[500px]">
            {Array.from({ length: 12 }).map((_, w) => (
              <div key={w} className="flex-1 space-y-[3px]">
                {Array.from({ length: 7 }).map((_, d) => {
                  const postingFreq = content.postingFrequency || []
                  const cell = Array.isArray(postingFreq[0])
                    ? { count: postingFreq[w]?.[d] || 0 }
                    : postingFreq.find((c) => c.week === w && c.day === d) || { count: 0 }
                  const count = cell.count || 0
                  return (
                    <div key={d} className="w-full aspect-square rounded-sm" style={{
                      backgroundColor: count === 0 ? 'var(--bg-tertiary)' : count <= 1 ? 'rgba(0,212,170,0.2)' : count <= 2 ? 'rgba(0,212,170,0.4)' : count <= 3 ? 'rgba(0,212,170,0.6)' : 'rgba(0,212,170,0.9)'
                    }} title={`Week ${w + 1}, Day ${d + 1}: ${count} posts`} />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-[--text-muted] font-body">
            <span>Less</span>
            <div className="flex gap-[2px]">
              {[0, 0.2, 0.4, 0.6, 0.9].map((o) => (<div key={o} className="w-3 h-3 rounded-sm" style={{ backgroundColor: o === 0 ? 'var(--bg-tertiary)' : `rgba(0,212,170,${o})` }} />))}
            </div>
            <span>More</span>
          </div>
        </div>
      </Card>

      {content.bestPost && (
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Best Performing Post</h4>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[--accent-glow] flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-[--accent] font-display">{content.bestPost.type || 'POST'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[--text-primary] font-body">&ldquo;{content.bestPost.caption || ''}&rdquo;</p>
              <div className="flex gap-4 mt-2 text-xs text-[--text-muted] font-body">
                <span>{(content.bestPost.reach || 0).toLocaleString()} reach</span>
                <span>{(content.bestPost.engagement || 0).toLocaleString()} engagements</span>
                <span>{content.bestPost.date || ''}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  )
}
