import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useReport } from '../../hooks/useReport'
import Card from '../ui/Card'

export default function AudienceInsights() {
  const { activeReport } = useReport()
  const data = activeReport || {}
  const audience = data?.audience || {}
  const reportType = data?.reportType || 'general'

  const topLocations = audience?.topLocations || []
  const ageGenderBreakdown = audience?.ageGenderBreakdown || []
  const deviceSplit = audience?.deviceSplit || null
  const peakHours = audience?.peakEngagementHours || []
  const primaryDemographic = audience?.primaryDemographic || null
  const interests = audience?.interests || []
  const peakActivity = audience?.peakActivity || null

  if (!audience) return null

  return (
    <section className="space-y-6">
      {reportType === 'general' && (
        <p className="text-xs text-[--text-muted] font-body italic">
          Audience data is estimated based on industry knowledge. Connect Facebook for real demographics.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Age & Gender</h4>
          <div className="h-64">
            {ageGenderBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGenderBreakdown} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="group" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'var(--text-primary)' }} />
                  <Bar dataKey="percentage" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : reportType === 'general' && primaryDemographic ? (
              <div className="flex flex-col justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body mb-2">Primary Demographic</p>
                <p className="text-sm text-[--text-primary] font-body">{primaryDemographic}</p>
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map(i => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-secondary] font-body">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[--text-muted] font-body mt-3 italic">
                  Connect Facebook to unlock exact age and gender breakdown.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body">No demographic data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Device Split</h4>
          <div className="h-64">
            {deviceSplit ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceSplit || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {(deviceSplit || []).map((_, i) => (
                        <Cell key={i} fill={i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs text-[--text-muted] font-body">
                  {(deviceSplit || []).map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)' }} />
                      {d.name} {d.value}%
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body">
                  {reportType === 'general'
                    ? 'Connect Facebook to unlock device data'
                    : 'No device data available'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Top Locations</h4>
          <div className="h-64">
            {topLocations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLocations} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis dataKey="location" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="percentage" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body">No location data</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-[--text-primary] font-display mb-4">Peak Engagement</h4>
          <div className="h-64">
            {peakHours.length === 24 ? (
              <div className="overflow-x-auto">
                <div className="grid gap-[2px] min-w-[500px]" style={{ gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' }}>
                  <div className="text-[8px] text-[--text-muted]" />
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="text-[8px] text-[--text-muted] text-center font-mono">{h}</div>
                  ))}
                  {peakHours.map((intensity, i) => (
                    <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: `rgba(0, 212, 170, ${(intensity || 0) / 10})` }} title={`Hour ${i}: ${intensity}`} />
                  ))}
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
            ) : peakActivity ? (
              <div className="flex flex-col justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body mb-2">Peak Activity</p>
                <p className="text-sm text-[--text-primary] font-body">{peakActivity}</p>
                <p className="text-xs text-[--text-muted] font-body mt-2 italic">
                  Connect Facebook for hour-by-hour heatmap.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-[--text-muted] font-body">No engagement data</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}
