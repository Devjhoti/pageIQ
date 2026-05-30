import { Search, Key, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Enter Your Facebook Page',
    description: 'Paste any Facebook business page link. PageIQ instantly recognizes the brand and prepares for deep analysis.',
  },
  {
    number: '02',
    icon: Key,
    title: 'Connect Your API',
    description: 'Link your Facebook Business API key securely. Your data is encrypted and never stored without permission.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Receive Your Intelligence Report',
    description: 'Get a comprehensive brand analysis with SWOT, competitor mapping, audience insights, and AI-powered recommendations.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display">
            How It Works
          </h2>
          <p className="mt-3 text-[--text-secondary] font-body max-w-lg mx-auto">
            Three simple steps to unlock brand intelligence that drives decisions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-[--border-accent] to-transparent" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative text-center md:text-left"
            >
              <div className="flex flex-col items-center md:items-start">
                <span className="text-4xl font-bold text-[--accent]/20 font-display select-none">
                  {step.number}
                </span>
                <div className="mt-2 mb-4 p-3 rounded-lg bg-[--accent-glow] border border-[--accent]/10">
                  <step.icon size={24} className="text-[--accent]" />
                </div>
                <h3 className="text-lg font-semibold text-[--text-primary] font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[--text-secondary] font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
