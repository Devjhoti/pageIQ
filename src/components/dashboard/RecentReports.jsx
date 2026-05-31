import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../lib/utils'
import Badge from '../ui/Badge'

export default function RecentReports({ reports = [] }) {
  const navigate = useNavigate()

  const statusVariant = {
    completed: 'success',
    failed: 'danger',
    processing: 'warning',
  }

  return (
    <div className="border border-[--border] bg-[--bg-secondary] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[--border]">
        <h3 className="text-sm font-semibold text-[--text-primary] font-display">Recent Reports</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border] text-left">
              <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Brand</th>
              <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Score</th>
              <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[--text-muted] font-body">No reports yet</td>
              </tr>
            ) : reports.slice(0, 5).map((r) => (
              <tr key={r.id} className="border-b border-[--border] last:border-0 hover:bg-[--bg-tertiary]/50 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/reports/${r.id}`)}>
                <td className="px-5 py-3 text-[--text-primary] font-body font-medium">{r.brand_name || r.brand}</td>
                <td className="px-5 py-3">
                  {r.score !== null ? (
                    <span className="font-mono tabular-nums text-[--text-primary]">{r.score}</span>
                  ) : (
                    <span className="text-[--text-muted]">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-[--text-secondary] font-body">{formatDate(r.created_at || r.date)}</td>
                <td className="px-5 py-3">
                  <Badge variant={statusVariant[r.status] || 'default'} size="sm">{r.status}</Badge>
                </td>
                <td className="px-5 py-3 text-right"><span className="text-xs text-[--accent] font-body">View</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
