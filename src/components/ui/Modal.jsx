import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Modal({ isOpen, onClose, title, children, className }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && onClose) onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && onClose) onClose()
      }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-lg border border-[--border] bg-[--bg-secondary] rounded-xl shadow-2xl shadow-black/40',
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h2 className="text-lg font-semibold text-[--text-primary] font-display">
            {title}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[--text-muted] hover:text-[--text-primary] hover:bg-[--bg-tertiary] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
