import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/utils'

export default function StatCard({ icon: Icon, label, value, trend, color = 'accent' }) {
  const animatedValue = useCountUp(Number(value) || 0, 1200)

  return (
    <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[--text-muted] font-body uppercase tracking-wider">{label}</span>
        <div className={cn('p-2 rounded-lg', color === 'accent' ? 'bg-[--accent-glow]' : color === 'blue' ? 'bg-[--accent-secondary]/10' : 'bg-[--bg-tertiary]')}>
          <Icon size={16} className={cn(color === 'accent' ? 'text-[--accent]' : color === 'blue' ? 'text-[--accent-secondary]' : 'text-[--text-secondary]')} />
        </div>
      </div>
      <div className="text-2xl font-bold text-[--text-primary] font-display tabular-nums">
        {typeof value === 'number' ? animatedValue.toLocaleString() : value}
      </div>
      {trend !== undefined && (
        <div className={cn('mt-1 text-xs font-body', trend >= 0 ? 'text-[--success]' : 'text-[--danger]')}>
          {trend >= 0 ? '+' : ''}{trend}% vs last month
        </div>
      )}
    </div>
  )
}
