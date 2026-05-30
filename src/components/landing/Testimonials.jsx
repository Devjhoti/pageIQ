import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director, TechSphere',
    content: 'PageIQ gave us competitive intelligence we previously paid agencies thousands for. The SWOT analysis alone transformed our Q3 strategy.',
    rating: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'Founder, River Creative Agency',
    content: 'We use PageIQ for all our client onboarding. The audience insights and content analysis help us build better strategies from day one.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Brand Strategist, Elevate Brands',
    content: 'The market trend tracking is incredibly accurate. PageIQ spotted a shift in our industry two weeks before it hit the mainstream.',
    rating: 5,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display">
            Trusted by Brand Leaders
          </h2>
          <p className="mt-3 text-[--text-secondary] font-body max-w-lg mx-auto">
            Marketing professionals and agency founders rely on PageIQ for brand intelligence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="border border-[--border] bg-[--bg-secondary] rounded-xl p-6 min-w-[300px] md:min-w-0"
            >
              <Quote size={24} className="text-[--accent]/30 mb-4" />
              <p className="text-sm text-[--text-secondary] font-body leading-relaxed mb-5">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[--accent] text-sm">★</span>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[--text-primary] font-body">{t.name}</p>
                <p className="text-xs text-[--text-muted] font-body">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
