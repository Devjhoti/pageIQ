import { motion } from 'framer-motion'
import { Brain, Users, TrendingUp, Target, BarChart3, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Brand Identity Analysis',
    description: 'Deep AI analysis of brand voice, positioning, and market perception across your Facebook presence.',
  },
  {
    icon: Users,
    title: 'Competitor Intelligence',
    description: 'Map your competitive landscape with multi-brand comparison across key performance metrics.',
  },
  {
    icon: TrendingUp,
    title: 'Market Trend Tracking',
    description: 'Real-time tracking of industry keywords and trending topics that affect your brand.',
  },
  {
    icon: Target,
    title: 'Audience Demographics',
    description: 'Understand who engages with your brand — age, gender, location, device, and peak hours.',
  },
  {
    icon: BarChart3,
    title: 'Content Performance',
    description: 'See which content types and themes drive engagement, with posting frequency analysis.',
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Recommendations',
    description: 'Actionable, prioritized recommendations based on data patterns and industry benchmarks.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Features() {
  return (
    <section id="features" className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-[--text-secondary] font-body max-w-lg mx-auto">
            From brand identity to competitive insights — PageIQ covers every dimension of your Facebook presence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group border border-[--border] bg-[--bg-secondary] rounded-xl p-6 transition-all duration-300 hover:border-[--accent]/40 hover:shadow-lg hover:shadow-[--accent-glow] hover:bg-[--bg-tertiary]"
            >
              <div className="mb-4 p-2.5 rounded-lg bg-[--accent-glow] w-fit group-hover:bg-[--accent]/20 transition-colors">
                <feature.icon size={20} className="text-[--accent]" />
              </div>
              <h3 className="text-base font-semibold text-[--text-primary] font-display mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[--text-secondary] font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
