import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, TrendingUp, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,170,0.3) 0%, transparent 70%)',
            animation: 'gradient-shift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(31,111,235,0.3) 0%, transparent 70%)',
            animation: 'gradient-shift 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,170,0.2) 0%, transparent 70%)',
            animation: 'gradient-shift 8s ease-in-out infinite',
          }}
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[--text-primary] font-display leading-tight tracking-tight">
              Know Every Brand.
              <br />
              <span className="text-[--accent]">Own Every Market.</span>
            </h1>
            <p className="mt-4 text-lg text-[--text-secondary] font-body max-w-xl leading-relaxed">
              PageIQ uses AI and Facebook Business API to deliver deep brand intelligence reports — 
              competitor analysis, audience insights, market trends, and actionable recommendations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/#sample-report">
                <Button variant="ghost" size="lg">
                  See Sample Report
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-[--text-muted] font-body">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-[--accent]" />
                <span>Deep Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[--accent]" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[--accent]" />
                <span>Actionable Insights</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative border border-[--border] bg-[--bg-secondary] rounded-xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[--border] bg-[--bg-tertiary]">
                <div className="w-3 h-3 rounded-full bg-[--danger]" />
                <div className="w-3 h-3 rounded-full bg-[--warning]" />
                <div className="w-3 h-3 rounded-full bg-[--success]" />
                <span className="ml-2 text-xs text-[--text-muted] font-mono">dashboard.pageiq.io</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 rounded bg-[--bg-tertiary]" />
                  <div className="h-8 w-8 rounded-full bg-[--accent]/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[84, 72, 91].map((score, i) => (
                    <div key={i} className="border border-[--border] rounded-lg p-3 bg-[--bg-tertiary]/50">
                      <div className="h-2 w-16 rounded bg-[--bg-tertiary] mb-2" />
                      <div className="text-lg font-bold text-[--accent] font-display">{score}</div>
                      <div className="text-[10px] text-[--text-muted] font-body">Brand Score</div>
                    </div>
                  ))}
                </div>
                <div className="h-24 border border-[--border] rounded-lg p-3 bg-[--bg-tertiary]/50 flex items-end gap-2">
                  {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, var(--accent), rgba(0,212,170,0.3))`,
                        opacity: 0.6 + (i / 14),
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-[--text-muted] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[--accent]" />
                    Engagement +24%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[--accent-secondary]" />
                    Reach +18%
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[--accent]/20 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[--accent]/10 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
