import { useAuth } from '../hooks/useAuth'
import { getGreeting } from '../lib/utils'
import { mockDashboardStats } from '../lib/mockData'
import { BarChart3, FileText, Target, TrendingUp } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import StatCard from '../components/dashboard/StatCard'
import RecentReports from '../components/dashboard/RecentReports'
import QuickAnalyze from '../components/dashboard/QuickAnalyze'
import ActivityFeed from '../components/dashboard/ActivityFeed'

export default function Dashboard() {
  const { user } = useAuth()
  const stats = mockDashboardStats()

  const statCards = [
    { icon: FileText, label: 'Total Reports', value: stats.totalReports, color: 'accent', trend: 12 },
    { icon: BarChart3, label: 'Pages Analyzed', value: stats.pagesAnalyzed, color: 'blue', trend: 8 },
    { icon: Target, label: 'Avg Brand Score', value: stats.avgBrandScore, color: 'accent', trend: 5 },
    { icon: TrendingUp, label: 'Reports This Month', value: stats.reportsThisMonth, color: 'blue', trend: null },
  ]

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
            <RecentReports />
          </div>
          <div className="space-y-6">
            <QuickAnalyze />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
