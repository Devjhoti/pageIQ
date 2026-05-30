import { cn } from '../../lib/utils'

export default function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        'border border-[--border] bg-[--bg-secondary] rounded-xl p-5',
        hover && 'transition-all duration-200 hover:border-[--border-accent] hover:shadow-lg hover:shadow-black/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
