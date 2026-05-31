import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileSpreadsheet, Plus, Settings, LogOut, Target, MessageSquare } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'
import logoSrc from '../../assets/logo.svg'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/new', icon: Plus, label: 'New Analysis' },
  { to: '/dashboard/reports', icon: FileSpreadsheet, label: 'Reports' },
  { to: '/dashboard/competitors', icon: Target, label: 'Competitor Intel' },
  { to: '/dashboard/comments', icon: MessageSquare, label: 'Comment Intelligence' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] border-r border-[--border] bg-[--bg-secondary] z-30">
      <div className="flex items-center h-16 px-6 border-b border-[--border]">
        <img src={logoSrc} alt="PageIQ" className="h-6" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200',
                isActive
                  ? 'bg-[--accent]/10 text-[--accent] border border-[--accent]/20'
                  : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-tertiary] border border-transparent'
              )
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[--border] space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[--accent]/20 flex items-center justify-center text-xs font-semibold text-[--accent] font-display">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[--text-primary] font-body truncate">
                {user.name}
              </p>
              <p className="text-xs text-[--text-muted] font-body">{user.plan}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[--text-secondary] hover:text-[--danger] hover:bg-[--bg-tertiary] transition-all duration-200 font-body border border-transparent"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
