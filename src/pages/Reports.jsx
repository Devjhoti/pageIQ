import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, LayoutGrid, List, ArrowUpDown, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { mockReportsList } from '../lib/mockData'
import { formatDate } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function Reports() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')
  const [sortBy, setSortBy] = useState('date')
  const navigate = useNavigate()

  const allReports = mockReportsList()
  const filtered = allReports
    .filter((r) => r.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0)
      return new Date(b.date) - new Date(a.date)
    })

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-lg border border-[--border] bg-[--bg-tertiary] pl-9 pr-3 text-sm text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent] font-body"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'score' : 'date')}
              className="flex items-center gap-1.5 h-10 px-3 rounded-lg border border-[--border] text-sm text-[--text-secondary] hover:text-[--text-primary] hover:border-[--border-accent] transition-colors font-body"
            >
              <ArrowUpDown size={14} />
              {sortBy === 'date' ? 'Date' : 'Score'}
            </button>
            <div className="flex border border-[--border] rounded-lg overflow-hidden">
              <button
                onClick={() => setView('table')}
                className={cn('p-2.5 transition-colors', view === 'table' ? 'bg-[--bg-tertiary] text-[--accent]' : 'text-[--text-muted] hover:text-[--text-primary]')}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setView('card')}
                className={cn('p-2.5 transition-colors', view === 'card' ? 'bg-[--bg-tertiary] text-[--accent]' : 'text-[--text-muted] hover:text-[--text-primary]')}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[--border] bg-[--bg-secondary] rounded-xl p-12 text-center"
          >
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[--bg-tertiary] flex items-center justify-center">
              <Search size={24} className="text-[--text-muted]" />
            </div>
            <h3 className="text-base font-semibold text-[--text-primary] font-display mb-1">No reports found</h3>
            <p className="text-sm text-[--text-secondary] font-body mb-5">
              {search ? 'Try a different search term' : 'Run your first analysis to see reports here'}
            </p>
            {!search && (
              <Button onClick={() => navigate('/dashboard/new')} variant="primary">
                New Analysis
              </Button>
            )}
          </motion.div>
        ) : view === 'table' ? (
          <div className="border border-[--border] bg-[--bg-secondary] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--border] text-left">
                  <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Brand</th>
                  <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Industry</th>
                  <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Score</th>
                  <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-xs text-[--text-muted] font-body uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[--border] last:border-0 hover:bg-[--bg-tertiary]/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/reports/${r.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[--accent-glow] flex items-center justify-center text-xs font-bold text-[--accent] font-display">
                          {r.brand.charAt(0)}
                        </div>
                        <span className="text-[--text-primary] font-body font-medium">{r.brand}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[--text-secondary] font-body">{r.industry}</td>
                    <td className="px-5 py-3">
                      {r.score !== null ? (
                        <span className="font-mono tabular-nums text-[--text-primary]">{r.score}</span>
                      ) : (
                        <span className="text-[--text-muted]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[--text-secondary] font-body">{formatDate(r.date)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={r.status === 'completed' ? 'success' : 'danger'} size="sm">{r.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs text-[--accent] font-body">View</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[--border] bg-[--bg-secondary] rounded-xl p-5 hover:border-[--border-accent] transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/reports/${r.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[--accent-glow] flex items-center justify-center text-sm font-bold text-[--accent] font-display">
                    {r.brand.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[--text-primary] font-body truncate">{r.brand}</p>
                    <p className="text-xs text-[--text-muted] font-body">{r.industry}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {r.score !== null ? (
                    <span className="text-lg font-bold text-[--accent] font-display tabular-nums">{r.score}</span>
                  ) : (
                    <span className="text-sm text-[--text-muted]">Failed</span>
                  )}
                  <span className="text-xs text-[--text-muted] font-body">{formatDate(r.date)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
