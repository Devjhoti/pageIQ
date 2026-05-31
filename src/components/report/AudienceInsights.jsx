import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'

export default function AudienceInsights() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const { audience } = data

  if (!audience) return null

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Age & Gender Breakdown</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audience.ageGroups || []} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="group" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'var(--text-primary)' }} />
                <Bar dataKey="percentage" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Device Split</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={audience.deviceSplit || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {(audience.deviceSplit || []).map((_, i) => (
                    <Cell key={i} fill={i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-[--text-muted] font-body">
              {(audience.deviceSplit || []).map((d, i) => (
                <span key={d.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)' }} />
                  {d.name} {d.value}%
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Top Locations</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audience.topLocations || []} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <YAxis dataKey="location" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="percentage" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Peak Engagement Hours</h4>
          <div className="overflow-x-auto">
            <div className="grid gap-[2px] min-w-[500px]" style={{ gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' }}>
              <div className="text-[8px] text-[--text-muted]" />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-[8px] text-[--text-muted] text-center font-mono">{h}</div>
              ))}
              {(audience.peakEngagement || []).slice(0, 168).map((cell, i) => {
                const intensity = typeof cell === 'object' ? cell.intensity : cell
                const day = typeof cell === 'object' ? cell.day : ''
                const hour = typeof cell === 'object' ? cell.hour : ''
                return (
                  <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: `rgba(0, 212, 170, ${(intensity || 0) / 100})` }} title={day ? `${day} ${hour}:00 — ${intensity}%` : `${intensity}%`} />
                )
              })}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-[--text-muted] font-body">
              <span>Low</span>
              <div className="flex gap-[1px]">
                {[0.15, 0.3, 0.5, 0.7, 0.9].map((o) => (<div key={o} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(0, 212, 170, ${o})` }} />))}
              </div>
              <span>High</span>
              <span className="ml-auto">Hours (0-23)</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
