import { Download, Share2, RefreshCw } from 'lucide-react'
import { mockReportData } from '../../lib/mockData'
import { formatDate } from '../../lib/utils'
import Button from '../ui/Button'

export default function ReportHeader({ reportId = 'b1' }) {
  const data = mockReportData(reportId)
  const { brand, score, generatedAt } = data

  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[--border]">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-[--accent-glow] flex items-center justify-center text-2xl font-bold text-[--accent] font-display">
          {brand.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[--text-primary] font-display">{brand.name}</h1>
          <div className="flex items-center gap-3 text-xs text-[--text-muted] font-body mt-1">
            <span>{brand.pageUrl}</span>
            <span>·</span>
            <span>Generated {formatDate(generatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fill="var(--text-primary)" fontSize="18" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
              {score}
            </text>
          </svg>
          <div className="text-xs text-[--text-muted] font-body max-w-[80px] leading-tight">
            Brand Intelligence Score
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download size={14} />
            PDF
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 size={14} />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
