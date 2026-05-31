import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

const priorityVariant = {
  High: 'danger',
  Medium: 'warning',
  Low: 'info',
}

export default function Recommendations() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const recommendations = data.recommendations || []

  const sorted = [...recommendations].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 }
    return (order[a.priority] || 99) - (order[b.priority] || 99)
  })

  return (
    <section className="space-y-4">
      {sorted.length === 0 && (
        <p className="text-sm text-[--text-muted] font-body">No recommendations available yet.</p>
      )}
      {sorted.map((rec) => (
        <Card key={rec.id} className="border-l-[3px]" style={{ borderLeftColor: `var(--${priorityVariant[rec.priority] === 'danger' ? 'danger' : priorityVariant[rec.priority] === 'warning' ? 'warning' : 'accent-secondary'})` }}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={priorityVariant[rec.priority] || 'info'} size="sm">{rec.priority}</Badge>
                <h4 className="text-sm font-semibold text-[--text-primary] font-display">{rec.title}</h4>
              </div>
              <p className="text-sm text-[--text-secondary] font-body leading-relaxed mb-2">{rec.rationale}</p>
              <div className="flex items-start gap-2 text-xs text-[--text-muted] font-body">
                <span className="text-[--accent] font-medium">Suggested action:</span>
                <span>{rec.action}</span>
              </div>
              {rec.estimatedImpact && (
                <p className="text-xs text-[--accent] font-body mt-2">
                  Expected impact: {rec.estimatedImpact}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </section>
  )
}
