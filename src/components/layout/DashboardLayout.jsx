import { useLocation, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileSpreadsheet, Plus, Settings, Target, MessageSquare } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import logoSrc from '../../assets/logo.svg'

const bottomNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/dashboard/new', icon: Plus, label: 'New' },
  { to: '/dashboard/reports', icon: FileSpreadsheet, label: 'Reports' },
  { to: '/dashboard/competitors', icon: Target, label: 'Intel' },
  { to: '/dashboard/comments', icon: MessageSquare, label: 'Comments' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const { user } = useAuth()

  const pageName = bottomNavItems.find(
    (item) => item.to === location.pathname || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
  )?.label || 'Report'

  return (
    <div className="min-h-screen bg-[--bg-primary]">
      <Sidebar />

      <div className="md:ml-[260px] pb-20 md:pb-0">
        <header className="sticky top-0 z-20 h-16 border-b border-[--border] bg-[--bg-primary]/80 backdrop-blur-md flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-[--text-primary] font-display">
            {pageName}
          </h1>
          {user && (
            <div className="flex items-center gap-3 md:hidden">
              <div className="w-8 h-8 rounded-full bg-[--accent]/20 flex items-center justify-center text-xs font-semibold text-[--accent] font-display">
                {user.name?.charAt(0) || 'U'}
              </div>
            </div>
          )}
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[--border] bg-[--bg-secondary]">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const isActive = item.to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                  isActive
                    ? 'text-[--accent]'
                    : 'text-[--text-muted] hover:text-[--text-secondary]'
                )}
              >
                <item.icon size={18} />
                <span className="text-[10px] font-body">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
