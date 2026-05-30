import { motion } from 'framer-motion'
import { Lock, BarChart3, PieChart, TrendingUp } from 'lucide-react'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'

const sections = [
  { icon: BarChart3, label: 'Engagement Metrics' },
  { icon: PieChart, label: 'Audience Breakdown' },
  { icon: TrendingUp, label: 'Market Trends' },
]

export default function SampleReport() {
  return (
    <section id="sample-report" className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display">
            Sample Intelligence Report
          </h2>
          <p className="mt-3 text-[--text-secondary] font-body max-w-lg mx-auto">
            See the depth of insights PageIQ delivers. Each report covers 9 comprehensive sections.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="border border-[--border] bg-[--bg-secondary] rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[--border] bg-[--bg-tertiary]">
              <div className="w-3 h-3 rounded-full bg-[--danger]" />
              <div className="w-3 h-3 rounded-full bg-[--warning]" />
              <div className="w-3 h-3 rounded-full bg-[--success]" />
              <span className="ml-2 text-xs text-[--text-muted] font-mono">report.pageiq.io/novaTech</span>
            </div>
            <div className="p-6 space-y-5 blur-sm select-none">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-32 rounded bg-[--bg-tertiary]" />
                  <div className="h-3 w-48 rounded bg-[--bg-tertiary] mt-2" />
                </div>
                <div className="h-16 w-16 rounded-full border-2 border-[--accent]" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-[--border] rounded-lg p-3 bg-[--bg-tertiary]/50">
                    <div className="h-2 w-12 rounded bg-[--bg-tertiary] mb-2" />
                    <div className="h-5 w-16 rounded bg-[--bg-tertiary]" />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-[--border] rounded-lg p-4 bg-[--bg-tertiary]/50 h-32" />
                <div className="border border-[--border] rounded-lg p-4 bg-[--bg-tertiary]/50 h-32" />
              </div>

              <div className="flex gap-4">
                {sections.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs text-[--text-muted]">
                    <s.icon size={14} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[--bg-primary]/40 backdrop-blur-[2px] rounded-xl">
            <div className="p-3 rounded-full bg-[--accent-glow] border border-[--accent]/20 mb-4">
              <Lock size={24} className="text-[--accent]" />
            </div>
            <h3 className="text-xl font-semibold text-[--text-primary] font-display mb-2">
              Unlock the Full Report
            </h3>
            <p className="text-sm text-[--text-secondary] font-body mb-5 text-center max-w-xs">
              Sign up to access complete brand intelligence reports with live data, competitor analysis, and AI recommendations.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
