import { forwardRef, useId } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className, id: externalId, ...props },
  ref
) {
  const generatedId = useId()
  const id = externalId || generatedId

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[--text-secondary] font-body"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted] pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 rounded-lg border border-[--border] bg-[--bg-tertiary] px-3 text-sm text-[--text-primary] placeholder:text-[--text-muted] transition-colors duration-200',
            'focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error && 'border-[--danger] focus:border-[--danger] focus:ring-[--danger]',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[--danger] font-body">{error}</p>
      )}
    </div>
  )
})

export default Input
