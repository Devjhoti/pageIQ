import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getGreeting } from '../lib/utils'
import { getDashboardStats } from '../lib/services/dashboardService'
import { listReports } from '../lib/services/reportsService'
import { BarChart3, FileText, Target, TrendingUp } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import StatCard from '../components/dashboard/StatCard'
import RecentReports from '../components/dashboard/RecentReports'
import QuickAnalyze from '../components/dashboard/QuickAnalyze'
import ActivityFeed from '../components/dashboard/ActivityFeed'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    listReports().then(setRecentReports).catch(() => {})
  }, [])

  const statCards = [
    { icon: FileText, label: 'Total Reports', value: stats?.totalReports ?? 0, color: 'accent', trend: null },
    { icon: BarChart3, label: 'Pages Analyzed', value: stats?.totalReports ?? 0, color: 'blue', trend: null },
    { icon: Target, label: 'Avg Brand Score', value: stats?.avgScore ?? 0, color: 'accent', trend: null },
    { icon: TrendingUp, label: 'Reports This Month', value: stats?.reportsThisMonth ?? 0, color: 'blue', trend: null },
  ]

  const activityItems = recentReports.map(r => ({
    id: r.id,
    label: `Report generated: ${r.brand_name}`,
    date: r.created_at,
    type: 'report'
  }))

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-[--text-primary] font-display">
          {getGreeting(user?.name || 'there')}
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentReports reports={recentReports} />
          </div>
          <div className="space-y-6">
            <QuickAnalyze />
            <ActivityFeed items={activityItems} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
