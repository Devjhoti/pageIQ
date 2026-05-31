import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'

export default function ContentAnalysis() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const content = data?.content || {}
  const reportType = data?.reportType || 'general'

  const postTypeBreakdown = content?.postTypeBreakdown || []
  const topThemes = content?.topThemes || content?.observedThemes || []
  const contentStrengths = content?.contentStrengths || []
  const contentGaps = content?.contentGaps || []
  const postingFrequency = content?.postingFrequency || content?.estimatedPostFrequency || '—'
  const bestPost = content?.bestPerformingPost || null

  if (!content) return null

  const colors = ['var(--accent)', 'var(--accent-secondary)', 'var(--warning)', 'var(--text-muted)']

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Post Type Breakdown</h4>
          <div className="h-64">
            {postTypeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postTypeBreakdown} cx="50%" cy="50%" outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {postTypeBreakdown.map((_, i) => (<Cell key={i} fill={colors[i]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body">No post type data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Content Themes</h4>
          <div className="flex flex-wrap gap-2 items-center h-48 content-center">
            {topThemes.length > 0 ? topThemes.map((theme, i) => {
              const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg']
              const size = sizes[i % sizes.length]
              return (
                <span key={theme} className={`${size} px-3 py-1 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/30 transition-colors cursor-default font-body`}>
                  {theme}
                </span>
              )
            }) : (
              <span className="text-xs text-[--text-muted] font-body">No themes identified</span>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Posting Frequency</h4>
        {reportType === 'general' ? (
          <div>
            <p className="text-2xl font-semibold text-[--text-primary] font-display">{postingFrequency}</p>
            <p className="text-xs text-[--text-muted] font-body mt-1 italic">
              Estimated. Connect Facebook for exact post calendar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-[3px] min-w-[500px]">
              {Array.from({ length: 12 }).map((_, w) => (
                <div key={w} className="flex-1 space-y-[3px]">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const pf = content.postingFrequency || []
                    const cell = Array.isArray(pf[0])
                      ? { count: pf[w]?.[d] || 0 }
                      : pf.find((c) => c.week === w && c.day === d) || { count: 0 }
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
        )}
      </Card>

      {reportType === 'general' && (contentStrengths.length > 0 || contentGaps.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {contentStrengths.length > 0 && (
            <div className="p-4 rounded-xl border border-[--success]/20 bg-[--success]/5">
              <p className="text-xs font-semibold text-[--success] font-body mb-2">Content Strengths</p>
              <ul className="space-y-1">
                {contentStrengths.map((s, i) => (
                  <li key={i} className="text-xs text-[--text-secondary] font-body">• {s}</li>
                ))}
              </ul>
            </div>
          )}
          {contentGaps.length > 0 && (
            <div className="p-4 rounded-xl border border-[--warning]/20 bg-[--warning]/5">
              <p className="text-xs font-semibold text-[--warning] font-body mb-2">Content Gaps</p>
              <ul className="space-y-1">
                {contentGaps.map((g, i) => (
                  <li key={i} className="text-xs text-[--text-secondary] font-body">• {g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {bestPost && (
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Best Performing Post</h4>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[--accent-glow] flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-[--accent] font-display">{bestPost.type || bestPost.type || 'POST'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[--text-primary] font-body">&ldquo;{bestPost.caption || bestPost.preview || ''}&rdquo;</p>
              <div className="flex gap-4 mt-2 text-xs text-[--text-muted] font-body">
                {bestPost.totalEngagement != null && (
                  <span>{(bestPost.totalEngagement || 0).toLocaleString()} total engagements</span>
                )}
                {bestPost.engagement != null && (
                  <span>{(bestPost.engagement || 0).toLocaleString()} engagements</span>
                )}
                {bestPost.reach != null && (
                  <span>{(bestPost.reach || 0).toLocaleString()} reach</span>
                )}
                {bestPost.date && <span>{bestPost.date}</span>}
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  )
}
