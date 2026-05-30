import { useState, useRef } from 'react'
import { cn } from '../../lib/utils'

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export default function Tooltip({ content, position = 'top', children, className }) {
  const [show, setShow] = useState(false)
  const timeoutRef = useRef(null)

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => setShow(true), 200)
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShow(false)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {show && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-body text-[--text-primary] bg-[--bg-tertiary] border border-[--border] rounded-md whitespace-nowrap pointer-events-none',
            positions[position],
            className
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}
