import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, Target, MoreHorizontal, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { listCompetitors, addCompetitor, deleteCompetitor } from '../lib/services/competitorsService'
import { formatDate } from '../lib/utils'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const threatColors = { High: 'text-[--danger] border-[--danger]/30 bg-[--danger]/10', Medium: 'text-[--warning] border-[--warning]/30 bg-[--warning]/10', Low: 'text-[--success] border-[--success]/30 bg-[--success]/10' }

export default function CompetitorIntelligence() {
  const [competitors, setCompetitors] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [fbUrl, setFbUrl] = useState('')
  const [menuOpen, setMenuOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    listCompetitors()
      .then(setCompetitors)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleAddCompetitor() {
    if (!fbUrl.trim()) return
    const name = fbUrl.match(/(?:facebook\.com\/)([^\s?/]+)/)?.[1]?.replace(/-/g, ' ')?.replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown'
    try {
      const comp = await addCompetitor(fbUrl, name, '')
      setCompetitors((prev) => [comp, ...prev])
      setAddOpen(false)
      setFbUrl('')
    } catch (err) {
      console.error('Failed to add competitor:', err)
    }
  }

  async function handleRemoveCompetitor(id) {
    try {
      await deleteCompetitor(id)
      setCompetitors((prev) => prev.filter((c) => c.id !== id))
      setMenuOpen(null)
    } catch (err) {
      console.error('Failed to remove competitor:', err)
    }
  }

  const analyzed = competitors.filter((c) => c.status === 'analyzed')

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[--text-primary] font-display">Competitor Intelligence</h1>
            <p className="text-sm text-[--text-secondary] font-body mt-0.5">Track, analyze and outmaneuver your competition</p>
          </div>
          <Button variant="primary" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Competitor</Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2].map((i) => (<div key={i} className="h-36 rounded-xl bg-[--bg-tertiary]" />))}
          </div>
        ) : competitors.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-[--border] bg-[--bg-secondary] rounded-xl p-16 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[--bg-tertiary] flex items-center justify-center"><Target size={32} className="text-[--text-muted]" /></div>
            <h3 className="text-base font-semibold text-[--text-primary] font-display mb-1">No competitors tracked yet</h3>
            <p className="text-sm text-[--text-secondary] font-body mb-5">Add your first competitor to start building intelligence</p>
            <Button variant="primary" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Competitor</Button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {competitors.map((comp, i) => (
                <motion.div key={comp.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative border border-[--border] bg-[--bg-secondary] rounded-xl p-5 hover:border-[--border-accent] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[--text-primary] font-display">{comp.page_name}</h3>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium font-body', threatColors[comp.threat_level] || threatColors.Low)}>
                          {comp.threat_level?.charAt(0).toUpperCase() + comp.threat_level?.slice(1) || 'Low'}
                        </span>
                      </div>
                      <p className="text-xs text-[--text-muted] font-body mt-0.5">{comp.category}</p>
                    </div>
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === comp.id ? null : comp.id)} className="p-1 rounded text-[--text-muted] hover:text-[--text-primary] hover:bg-[--bg-tertiary] transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpen === comp.id && (
                        <div className="absolute right-0 top-8 w-40 border border-[--border] bg-[--bg-secondary] rounded-lg shadow-xl shadow-black/40 z-10 py-1" onClick={() => setMenuOpen(null)}>
                          {comp.status === 'analyzed' && <button onClick={() => { setMenuOpen(null); navigate(`/dashboard/competitors/${comp.id}`) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-tertiary] font-body"><ExternalLink size={14} />View Report</button>}
                          <button onClick={() => { setMenuOpen(null) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-tertiary] font-body"><RefreshCw size={14} />Re-analyze</button>
                          <button onClick={() => handleRemoveCompetitor(comp.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[--danger] hover:bg-[--bg-tertiary] font-body"><Trash2 size={14} />Remove</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[--text-muted] font-body mb-3">
                    <Users size={14} /> {comp.followers?.toLocaleString() || 0} followers
                  </div>

                  {comp.overall_sentiment !== null && comp.overall_sentiment !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-[--text-muted] font-body mb-1">
                        <span>Sentiment Score</span>
                        <span>{comp.overall_sentiment}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[--bg-tertiary] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${comp.overall_sentiment}%`, background: comp.overall_sentiment > 60 ? 'var(--success)' : comp.overall_sentiment > 40 ? 'var(--warning)' : 'var(--danger)' }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[--border]">
                    {comp.status === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-xs text-[--accent] font-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse" />Analyzing...
                      </span>
                    ) : (
                      <button onClick={() => navigate(`/dashboard/competitors/${comp.id}`)} className="text-xs text-[--accent] hover:underline font-body">View Full Report →</button>
                    )}
                    <span className="text-[10px] text-[--text-muted] font-body">{comp.last_analyzed ? `Last analyzed ${formatDate(comp.last_analyzed)}` : 'Not yet analyzed'}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {analyzed.length >= 2 && (
              <Card>
                <h3 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Landscape Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: 'Brand Awareness', you: 75, them: 68 },
                      { metric: 'Engagement', you: 82, them: 71 },
                      { metric: 'Content Quality', you: 70, them: 78 },
                      { metric: 'Audience Growth', you: 65, them: 72 },
                      { metric: 'Sentiment', you: 88, them: 64 },
                      { metric: 'Response Rate', you: 55, them: 70 },
                    ]}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                      <PolarRadiusAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Radar name="Your Brand" dataKey="you" stroke="#00D4AA" fill="#00D4AA" fillOpacity={0.12} strokeWidth={2} />
                      {analyzed.slice(0, 3).map((c, i) => {
                        const colors = ['#1F6FEB', '#F85149', '#D29922']
                        return <Radar key={c.id} name={c.page_name} dataKey="them" stroke={colors[i]} fill={colors[i]} fillOpacity={0.05} strokeWidth={1.5} />
                      })}
                      <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Competitor">
        <div className="space-y-4">
          <Input label="Facebook Page URL" type="url" placeholder="https://facebook.com/competitorpage" value={fbUrl} onChange={(e) => setFbUrl(e.target.value)} icon={Target} />
          <p className="text-xs text-[--text-muted] font-body">We will analyze their public posts, engagement patterns and comment sentiment</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddCompetitor}>Start Analysis</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
