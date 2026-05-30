import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative border border-[--border] bg-[--bg-secondary] rounded-2xl p-12 sm:p-16 text-center overflow-hidden"
        >
          <div
            className="absolute top-[-50%] left-[-20%] w-[70%] h-[70%] rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(0,212,170,0.4) 0%, transparent 70%)',
              animation: 'gradient-shift 10s ease-in-out infinite',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display mb-4">
              Ready to Know Your Brand Better?
            </h2>
            <p className="text-[--text-secondary] font-body max-w-md mx-auto mb-8">
              Join thousands of marketing professionals who use PageIQ to make data-driven brand decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Start Your Free Analysis
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/#how-it-works">
                <Button variant="ghost" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
