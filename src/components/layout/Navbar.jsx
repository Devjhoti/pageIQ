import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import logoSrc from '../../assets/logo.svg'

const links = [
  { to: '/#features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/#how-it-works', label: 'How It Works' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[--border] bg-[--bg-primary]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="PageIQ" className="h-6" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm text-[--text-secondary] hover:text-[--text-primary] transition-colors font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[--text-secondary] hover:text-[--text-primary]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={cn(
        'md:hidden border-t border-[--border] bg-[--bg-primary] transition-all duration-200 overflow-hidden',
        open ? 'max-h-64' : 'max-h-0'
      )}>
        <div className="px-6 py-4 space-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="block text-sm text-[--text-secondary] hover:text-[--text-primary] transition-colors font-body"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[--border] space-y-2">
            <Link to="/login" className="block" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
            </Link>
            <Link to="/register" className="block" onClick={() => setOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
