import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-[--bg-tertiary] text-[--text-secondary] border-[--border]',
  success: 'bg-[--success]/10 text-[--success] border-[--success]/20',
  warning: 'bg-[--warning]/10 text-[--warning] border-[--warning]/20',
  danger: 'bg-[--danger]/10 text-[--danger] border-[--danger]/20',
  info: 'bg-[--accent-secondary]/10 text-[--accent-secondary] border-[--accent-secondary]/20',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function Badge({ variant = 'default', size = 'md', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium font-body whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
