import { FileText, Key, Plus, AlertCircle } from 'lucide-react'
import { mockActivityFeed } from '../../lib/mockData'
import { formatTimeAgo } from '../../lib/utils'

const actionIcon = {
  'Report generated': FileText,
  'API key updated': Key,
  'Plan upgraded': Plus,
  'New analysis started': Plus,
}

const actionColor = {
  'Report generated': 'text-[--accent]',
  'API key updated': 'text-[--accent-secondary]',
  'Plan upgraded': 'text-[--success]',
  'New analysis started': 'text-[--warning]',
}

export default function ActivityFeed() {
  const activities = mockActivityFeed()

  return (
    <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Activity</h3>
      <div className="space-y-0">
        {activities.map((a, i) => {
          const Icon = actionIcon[a.action] || AlertCircle
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 py-3 border-b border-[--border] last:border-0"
            >
              <div className={`p-1.5 rounded-md bg-[--bg-tertiary] ${actionColor[a.action] || 'text-[--text-muted]'}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[--text-primary] font-body">
                  {a.action}: <span className="text-[--text-secondary]">{a.target}</span>
                </p>
              </div>
              <span className="text-xs text-[--text-muted] font-body whitespace-nowrap">
                {formatTimeAgo(a.timestamp)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
