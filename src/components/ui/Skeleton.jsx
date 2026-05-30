import { cn } from '../../lib/utils'

export default function Skeleton({ className, variant = 'text' }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[--bg-tertiary]',
        variant === 'text' && 'h-4 w-full',
        variant === 'card' && 'h-32 w-full',
        variant === 'circle' && 'h-10 w-10 rounded-full',
        className
      )}
    />
  )
}
