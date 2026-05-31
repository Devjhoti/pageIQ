import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { BarChart, Bar, Cell } from 'recharts'
import { MessageSquare, AlertTriangle, Reply, EyeOff, Trash2, X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { listComments, getCommentStats, deleteComment as deleteCommentApi } from '../lib/services/commentsService'
import { formatDate } from '../lib/utils'
import { useCountUp } from '../hooks/useCountUp'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const filters = ['Alerts', 'All', 'Positive', 'Neutral', 'Negative']
const sentimentColors = { positive: 'text-[--success]', neutral: 'text-[--text-muted]', negative: 'text-[--danger]' }
const categoryBadge = { Complaint: 'bg-[--danger]/10 text-[--danger]', Praise: 'bg-[--success]/10 text-[--success]', Question: 'bg-[--accent]/10 text-[--accent]', Hostile: 'bg-[--danger]/20 text-[--danger]' }

export default function CommentIntelligence() {
  const [activeFilter, setActiveFilter] = useState('Alerts')
  const [comments, setComments] = useState([])
  const [stats, setStats] = useState(null)
  const [expandedReply, setExpandedReply] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listComments().then(setComments).catch(() => {}),
      getCommentStats().then(setStats).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const total = useCountUp(stats?.total || 0, 1200)
  const positive = useCountUp(stats?.positive || 0, 1200)
  const negative = useCountUp(stats?.negative || 0, 1200)
  const pendingReview = useCountUp(stats?.pendingReview || 0, 1200)

  function copyReply(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleHide(id) { setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: 'hidden' } : c)) }

  async function handleDelete(id) {
    try {
      await deleteCommentApi(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
      setDeleteConfirm(null)
      toast.success('Comment deleted')
    } catch (err) {
      toast.error('Failed to delete comment')
    }
  }

  function handleIgnore(id) { setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: 'ignored' } : c)) }

  const filteredComments = (comments || []).filter((c) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Alerts') return c.is_alert
    return c.sentiment === activeFilter.toLowerCase()
  }).filter((c) => c.status !== 'hidden' && c.status !== 'deleted')

  const alertsCount = (comments || []).filter((c) => c.is_alert).length

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-[--text-primary] font-display">Comment Intelligence</h1>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Comments', value: total, sub: 'this week', color: '' },
            { label: 'Positive', value: positive, sub: `${stats?.positivePercent || 0}% of total`, color: 'text-[--success]', glow: '' },
            { label: 'Negative', value: negative, sub: `${stats?.negativePercent || 0}% of total`, color: 'text-[--danger]', glow: (stats?.negativePercent || 0) > 20 ? 'shadow-[0_0_15px_rgba(248,81,73,0.15)]' : '' },
            { label: 'Pending Review', value: pendingReview, sub: 'needs attention', color: 'text-[--warning]', glow: (stats?.pendingReview || 0) > 20 ? 'shadow-[0_0_15px_rgba(210,153,34,0.15)]' : '' },
          ].map((s) => (
            <Card key={s.label} className={cn(s.glow)}>
              <p className="text-xs text-[--text-muted] font-body mb-1">{s.label}</p>
              <p className={cn('text-2xl font-bold text-[--text-primary] font-display tabular-nums', s.color)}>{s.value}</p>
              <p className="text-[10px] text-[--text-muted] font-body mt-0.5">{s.sub}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-1 border-b border-[--border] pb-2 overflow-x-auto">
              {filters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={cn('px-3 py-1.5 text-xs font-body rounded-t transition-colors whitespace-nowrap', activeFilter === f ? 'text-[--accent] border-b-2 border-[--accent]' : 'text-[--text-muted] hover:text-[--text-secondary]')}>
                  {f}{f === 'Alerts' && alertsCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[--danger] text-white text-[9px]">{alertsCount}</span>}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (<div key={i} className="h-32 rounded-xl bg-[--bg-tertiary]" />))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredComments.length === 0 ? (
                  <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-12 text-center">
                    <MessageSquare size={24} className="mx-auto text-[--text-muted] mb-2" />
                    <p className="text-sm text-[--text-secondary] font-body">No comments match this filter</p>
                  </div>
                ) : filteredComments.map((c) => (
                  <motion.div
                    key={c.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className={cn('border rounded-xl overflow-hidden transition-all', c.status === 'ignored' ? 'opacity-40 border-[--border] bg-[--bg-secondary]' : c.sentiment === 'positive' ? 'border-l-[--success] border-l-2 border-[--border] bg-[--bg-secondary]' : c.sentiment === 'negative' ? 'border-l-[--danger] border-l-2 border-[--border] bg-[--bg-secondary]' : 'border-l-[--text-muted] border-l-2 border-[--border] bg-[--bg-secondary]')}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-[--text-muted] font-body">
                          {c.is_alert && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[--danger]/10 text-[--danger] text-[10px] font-medium animate-pulse"><AlertTriangle size={10} />ALERT</span>}
                          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-body', categoryBadge[c.category] || 'bg-[--bg-tertiary] text-[--text-muted]')}>{c.category}</span>
                          <span>{formatDate(c.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[--text-muted] font-body mb-2 font-mono">Post: &ldquo;{c.post_preview}&rdquo;</div>
                      <div className="flex items-start gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-[--bg-tertiary] flex items-center justify-center text-xs font-semibold text-[--text-muted] font-display shrink-0">{c.commenter_name?.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-[--text-primary] font-body">
                            {c.commenter_name} <span className="text-[--text-muted] font-normal">{c.likes} ❤</span>
                          </div>
                          <p className="text-sm text-[--text-secondary] font-body">&ldquo;{c.comment}&rdquo;</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[--text-muted] font-body mb-4">
                        <div className="flex-1 h-1.5 rounded-full bg-[--bg-tertiary] overflow-hidden max-w-[200px]">
                          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${c.sentiment_score}%` }} style={{ background: c.sentiment_score > 60 ? 'var(--success)' : c.sentiment_score > 30 ? 'var(--warning)' : 'var(--danger)' }} />
                        </div>
                        <span className={cn('font-mono tabular-nums', sentimentColors[c.sentiment] || 'text-[--text-muted]')}>{c.sentiment_score}/100</span>
                        <span className={cn('uppercase text-[10px] font-semibold', sentimentColors[c.sentiment])}>{c.sentiment}</span>
                      </div>

                      {c.status === 'replied' ? (
                        <div className="flex items-center gap-1.5 text-xs text-[--success] font-body"><Check size={14} />Replied</div>
                      ) : (
                        <>
                          <div className="border-t border-[--border] pt-3">
                            <button onClick={() => setExpandedReply(expandedReply === c.id ? null : c.id)} className="flex items-center gap-1 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body mb-2">
                              {expandedReply === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} AI Suggested Reply
                            </button>
                            {expandedReply === c.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-3 space-y-2">
                                <p className="text-sm text-[--text-secondary] font-body leading-relaxed p-3 rounded-lg bg-[--bg-tertiary]">{c.ai_suggested_reply || 'No suggested reply available.'}</p>
                                <Button variant="secondary" size="sm" onClick={() => copyReply(c.ai_suggested_reply || '', c.id)}>
                                  {copiedId === c.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === c.id ? 'Copied' : 'Copy Reply'}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-[--border]">
                            <Button variant="secondary" size="sm" onClick={() => toast('Opening Facebook comment...')}><Reply size={14} /> Reply</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleHide(c.id)}><EyeOff size={14} /> Hide</Button>
                            <Button variant="ghost" size="sm" className="text-[--danger] hover:text-[--danger]" onClick={() => setDeleteConfirm(c.id)}><Trash2 size={14} /> Delete</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleIgnore(c.id)}><X size={14} /> Ignore</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Sentiment Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: 'Mon', score: 65 }, { date: 'Tue', score: 72 }, { date: 'Wed', score: 58 },
                    { date: 'Thu', score: 70 }, { date: 'Fri', score: 68 }, { date: 'Sat', score: 75 }, { date: 'Sun', score: 71 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={60} stroke="var(--text-muted)" strokeDasharray="4 4" label={{ value: 'Healthy', fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke={(stats?.avgSentimentScore || 50) > 60 ? 'var(--success)' : (stats?.avgSentimentScore || 50) > 40 ? 'var(--warning)' : 'var(--danger)'} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-center">
                <p className="text-2xl font-bold text-[--text-primary] font-display tabular-nums">{stats?.avgSentimentScore || 0}</p>
                <p className="text-xs text-[--text-muted] font-body">Average Sentiment Score</p>
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Comment Categories This Week</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { category: 'Praise', count: 345 }, { category: 'Question', count: 289 },
                    { category: 'Complaint', count: 283 }, { category: 'Hostile', count: 67 }, { category: 'Other', count: 300 },
                  ]} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      <Cell fill="var(--success)" /><Cell fill="var(--accent-secondary)" /><Cell fill="var(--danger)" /><Cell fill="var(--danger)" /><Cell fill="var(--text-muted)" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Comment">
        <div className="space-y-4">
          <p className="text-sm text-[--text-secondary] font-body">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
