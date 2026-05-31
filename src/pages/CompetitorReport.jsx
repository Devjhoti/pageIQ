import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Users, TrendingUp, TrendingDown, Smile, Meh, Frown, Copy, Check, ChevronDown, ChevronUp, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import toast from 'react-hot-toast'
import { getCompetitor } from '../lib/services/competitorsService'
import { formatDate, formatNumber } from '../lib/utils'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function CompetitorReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedReply, setExpandedReply] = useState(null) // eslint-disable-line no-unused-vars
  const [copiedId, setCopiedId] = useState(null)
  const [expandedOpp, setExpandedOpp] = useState(null)

  useEffect(() => {
    if (!id) return
    getCompetitor(id)
      .then(setData)
      .catch((err) => toast.error('Failed to load competitor report'))
      .finally(() => setLoading(false))
  }, [id])

  function copyReply(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 rounded-xl bg-[--bg-tertiary]" />
          <div className="h-64 rounded-xl bg-[--bg-tertiary]" />
          <div className="h-48 rounded-xl bg-[--bg-tertiary]" />
        </div>
      </PageWrapper>
    )
  }

  if (!data) {
    return (
      <PageWrapper>
        <div className="text-center py-16">
          <p className="text-sm text-[--text-muted] font-body">Competitor not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/dashboard/competitors')}>Back to Competitors</Button>
        </div>
      </PageWrapper>
    )
  }

  const report = data.report || {}

  return (
    <PageWrapper>
      <div className="space-y-8">
        <button onClick={() => navigate('/dashboard/competitors')} className="flex items-center gap-1.5 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body">
          <ArrowLeft size={14} /> Back to Competitors
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[--border]">
          <div>
            <h1 className="text-xl font-semibold text-[--text-primary] font-display">{data.page_name}</h1>
            <a href={data.page_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body mt-0.5">
              {data.page_url} <ExternalLink size={12} />
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-[--text-muted] font-body">
            <span className="flex items-center gap-1"><Users size={14} />{formatNumber(data.followers)} followers</span>
            <span>Last analyzed {data.last_analyzed ? formatDate(data.last_analyzed) : 'N/A'}</span>
          </div>
        </div>

        {report.radarData && (
          <section>
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-4">You vs Them</h3>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-3 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={report.radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Radar name="Your Brand" dataKey="you" stroke="#00D4AA" fill="#00D4AA" fillOpacity={0.15} strokeWidth={2.5} />
                    <Radar name={data.page_name} dataKey="them" stroke="#1F6FEB" fill="#1F6FEB" fillOpacity={0.1} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="md:col-span-2 space-y-3">
                {report.radarData.map((m) => (
                  <div key={m.metric}>
                    <div className="flex justify-between text-xs text-[--text-muted] font-body mb-1">
                      <span>{m.metric}</span>
                      <span className="font-mono">{m.you} / {m.them}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 rounded-full bg-[--bg-tertiary] overflow-hidden"><div className="h-full rounded-full bg-[--accent] transition-all" style={{ width: `${m.you}%` }} /></div>
                      <div className="flex-1 rounded-full bg-[--bg-tertiary] overflow-hidden"><div className="h-full rounded-full bg-[--accent-secondary] transition-all" style={{ width: `${m.them}%` }} /></div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2 text-[10px] text-[--text-muted] font-body">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[--accent]" /> Your Brand</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[--accent-secondary]" /> {data.page_name}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {report.whatsWorking && (
          <>
            <section className="pt-4 border-t border-[--border]">
              <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[--success]" /> What's Working</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {report.whatsWorking.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-[--border] bg-[--bg-secondary] rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-2">{item.title}</h4>
                    <p className="text-xs text-[--text-secondary] font-body leading-relaxed mb-3">{item.detail}</p>
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-medium bg-[--success]/10 text-[--success] font-body">{item.metric}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="pt-4 border-t border-[--border]">
              <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingDown size={14} className="text-[--danger]" /> What's Not Working</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {report.whatsNotWorking.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-[--border] bg-[--bg-secondary] rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-2">{item.title}</h4>
                    <p className="text-xs text-[--text-secondary] font-body leading-relaxed mb-3">{item.detail}</p>
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-medium bg-[--danger]/10 text-[--danger] font-body">{item.metric}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}

        {report.commentSentiment && (
          <section className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-1">Their Audience Sentiment</h3>
            <p className="text-xs text-[--text-muted] font-body mb-4">Based on analysis of {(report.commentSentiment.totalAnalyzed || 0).toLocaleString()} public comments across their recent posts</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Positive', value: report.commentSentiment.positive, icon: Smile, color: 'text-[--success]', bg: 'bg-[--success]/10' },
                { label: 'Neutral', value: report.commentSentiment.neutral, icon: Meh, color: 'text-[--text-muted]', bg: 'bg-[--bg-tertiary]' },
                { label: 'Negative', value: report.commentSentiment.negative, icon: Frown, color: 'text-[--danger]', bg: 'bg-[--danger]/10' },
              ].map((s) => (
                <Card key={s.label} className="text-center">
                  <s.icon size={20} className={cn('mx-auto mb-1', s.color)} />
                  <p className="text-2xl font-bold text-[--text-primary] font-display tabular-nums">{s.value}%</p>
                  <p className="text-xs text-[--text-muted] font-body">{s.label}</p>
                </Card>
              ))}
            </div>
            {report.topComplaints && (
              <>
                <h4 className="text-xs font-semibold text-[--text-muted] font-body uppercase tracking-wider mb-3">Top Complaint Categories</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.topComplaints} layout="vertical" barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="category" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                      <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={(value) => [`${value} complaints`, 'Count']} />
                      <Bar dataKey="count" fill="var(--danger)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>
        )}

        {report.opportunityFeed && (
          <section className="pt-4 border-t border-[--border]">
            <h3 className="text-sm font-semibold text-[--text-muted] font-display uppercase tracking-wider mb-1">Opportunity Feed</h3>
            <p className="text-xs text-[--text-muted] font-body mb-4">Unanswered comments on their posts — potential customers you can reach</p>
            <div className="p-3 mb-4 rounded-lg border border-[--warning]/20 bg-[--warning]/5 text-xs text-[--warning] font-body flex items-start gap-2">
              <Target size={14} className="shrink-0 mt-0.5" />
              These are public comments. Engage manually and thoughtfully — do not spam.
            </div>
            <div className="space-y-4">
              {report.opportunityFeed.map((opp) => (
                <Card key={opp.id} className="overflow-hidden">
                  <div className="text-xs text-[--text-muted] font-mono mb-3">POST: &ldquo;{opp.postPreview}&rdquo;</div>
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-[--text-secondary] font-body mb-1">
                        <span className="font-medium text-[--text-primary]">{opp.commenterName}</span>
                        <span>· {opp.commentTime}</span>
                        <span>· {opp.likes} likes</span>
                        {!opp.isAnswered && <span className="text-[--warning]">(unanswered)</span>}
                      </div>
                      <p className="text-sm text-[--text-primary] font-body">&ldquo;{opp.comment}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[--warning]/5 border border-[--warning]/10 text-xs text-[--warning] font-body mb-3">
                    <Target size={12} /> {opp.opportunity}
                  </div>
                  <div className="border-t border-[--border] pt-3">
                    <button onClick={() => setExpandedOpp(expandedOpp === opp.id ? null : opp.id)} className="flex items-center gap-1 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body">
                      {expandedOpp === opp.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} AI Suggested Reply
                    </button>
                    {expandedOpp === opp.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-3">
                        <p className="text-sm text-[--text-secondary] font-body leading-relaxed p-3 rounded-lg bg-[--bg-tertiary]">{opp.aiDraftReply}</p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => copyReply(opp.aiDraftReply, opp.id)}>
                            {copiedId === opp.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === opp.id ? 'Copied' : 'Copy Reply'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toast('Opening Facebook...')}><ExternalLink size={14} /> Open on Facebook</Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
