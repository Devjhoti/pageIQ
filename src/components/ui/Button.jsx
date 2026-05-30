import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-[--accent] text-[--bg-primary] hover:brightness-110 font-semibold',
  secondary: 'border border-[--border] bg-[--bg-tertiary] text-[--text-primary] hover:border-[--border-accent] hover:bg-[--bg-secondary]',
  ghost: 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-tertiary]',
  danger: 'bg-[--danger] text-white hover:brightness-110 font-semibold',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--bg-primary]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
