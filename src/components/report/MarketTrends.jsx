import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { mockReportData } from '../../lib/mockData'
import Card from '../ui/Card'

export default function MarketTrends({ reportId = 'b1' }) {
  const data = mockReportData(reportId)
  const { marketTrends } = data

  const directionIcon = {
    up: { icon: TrendingUp, color: 'text-[--success]' },
    down: { icon: TrendingDown, color: 'text-[--danger]' },
    stable: { icon: Minus, color: 'text-[--text-muted]' },
  }

  return (
    <section className="space-y-6">
      <Card>
        <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Industry Keyword Trends</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketTrends.keywordTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="smartHome" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} name="Smart Home" />
              <Line type="monotone" dataKey="aiDevices" stroke="var(--accent-secondary)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-secondary)' }} name="AI Devices" />
              <Line type="monotone" dataKey="iot" stroke="var(--warning)" strokeWidth={2} dot={{ r: 3, fill: 'var(--warning)' }} name="IoT" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-[--text-muted] font-body">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-[--accent]" /> Smart Home</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-[--accent-secondary]" /> AI Devices</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-[--warning]" /> IoT</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Trending Topics</h4>
          <div className="space-y-2">
            {marketTrends.trendingTopics.map((t) => {
              const { icon: Icon, color } = directionIcon[t.direction]
              return (
                <div key={t.topic} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                  <span className="text-sm text-[--text-secondary] font-body">{t.topic}</span>
                  <Icon size={14} className={color} />
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Market Opportunity Score</h4>
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="relative w-32 h-32">
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56"
                  fill="none"
                  stroke="var(--accent-secondary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - marketTrends.marketOpportunityScore / 100)}
                  transform="rotate(-90 64 64)"
                />
                <text x="64" y="64" textAnchor="middle" dominantBaseline="central" fill="var(--text-primary)" fontSize="28" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                  {marketTrends.marketOpportunityScore}
                </text>
              </svg>
            </div>
            <p className="text-sm text-[--text-muted] font-body mt-3 text-center max-w-xs">
              Your industry shows strong growth potential in smart home and AI device categories.
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
