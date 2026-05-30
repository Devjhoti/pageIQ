import { mockReportData } from '../../lib/mockData'
import { formatNumber } from '../../lib/utils'
import { useCountUp } from '../../hooks/useCountUp'
import { motion } from 'framer-motion'
import Card from '../ui/Card'

function AnimatedMetric({ label, value, suffix = '', icon: Icon }) {
  const count = useCountUp(Number(value) || 0, 1500)

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={14} className="text-[--accent]" />}
        <span className="text-xs text-[--text-muted] font-body">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[--text-primary] font-display tabular-nums">
        {typeof value === 'number' ? count.toLocaleString() : value}{suffix}
      </p>
    </Card>
  )
}

export default function EngagementMetrics({ reportId = 'b1' }) {
  const data = mockReportData(reportId)

  const metrics = [
    { label: 'Total Followers', value: data.brand.followers },
    { label: 'Weekly Reach', value: data.brand.avgWeeklyReach },
    { label: 'Engagement Rate', value: data.brand.engagementRate, suffix: '%' },
    { label: 'Total Posts (30d)', value: 47 },
    { label: 'Avg Likes/Post', value: 1284 },
    { label: 'Avg Comments/Post', value: 342 },
    { label: 'Avg Shares/Post', value: 189 },
    { label: 'Response Rate', value: 92, suffix: '%' },
  ]

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <AnimatedMetric key={m.label} {...m} />
        ))}
      </div>
    </section>
  )
}
