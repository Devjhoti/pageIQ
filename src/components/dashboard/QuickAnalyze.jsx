import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

export default function QuickAnalyze() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (url.trim()) {
      navigate('/dashboard/new', { state: { url: url.trim() } })
    }
  }

  return (
    <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[--text-primary] font-display mb-1">Quick Analyze</h3>
      <p className="text-xs text-[--text-muted] font-body mb-4">
        Paste a Facebook page URL to start immediately
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
          <input
            type="text"
            placeholder="facebook.com/yourbrand"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-10 rounded-lg border border-[--border] bg-[--bg-tertiary] pl-9 pr-3 text-sm text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent] font-body"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          <ArrowRight size={16} />
        </Button>
      </form>
    </div>
  )
}
