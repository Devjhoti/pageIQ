import { useReport } from '../../hooks/useReport'
import { useCountUp } from '../../hooks/useCountUp'
import Card from '../ui/Card'

function AnimatedMetric({ label, value, suffix = '', icon: Icon, isEstimated = false }) {
  const count = useCountUp(typeof value === 'number' ? value : 0, 1500)
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={14} className="text-[--accent]" />}
        <span className="text-xs text-[--text-muted] font-body">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[--text-primary] font-display tabular-nums">
        {typeof value === 'number' ? count.toLocaleString() : value}{suffix}
      </p>
      {isEstimated && (
        <p className="text-xs text-[--text-muted] font-body mt-0.5">Estimated</p>
      )}
    </Card>
  )
}

export default function EngagementMetrics() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const brand = data?.brand || {}
  const reportType = data?.reportType || 'general'

  const rawFollowers = brand?.actualFollowers ?? brand?.estimatedFollowers ?? null
  const rawEngagement = brand?.actualEngagementRate ?? brand?.estimatedEngagement ?? null

  const displayFollowers = rawFollowers === null
    ? '—'
    : typeof rawFollowers === 'number'
      ? rawFollowers
      : rawFollowers

  const displayEngagement = rawEngagement || '—'

  return (
    <section>
      {reportType === 'general' && (
        <p className="text-xs text-[--text-muted] font-body mb-4 italic">
          Metrics below are estimated based on industry benchmarks. Connect Facebook for real data.
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedMetric label="Followers" value={displayFollowers} isEstimated={reportType === 'general' && rawFollowers !== null} />
        <AnimatedMetric label="Engagement Rate" value={displayEngagement} suffix="" isEstimated={reportType === 'general' && rawEngagement !== null} />
      </div>
    </section>
  )
}
