import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started with brand intelligence.',
    features: [
      { included: true, text: '3 reports per month' },
      { included: true, text: 'Basic metrics & overview' },
      { included: true, text: 'Single brand analysis' },
      { included: false, text: 'Priority AI processing' },
      { included: false, text: 'White-label reports' },
      { included: false, text: 'Team seats' },
    ],
    cta: 'Get Started Free',
    to: '/register',
    variant: 'ghost',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professionals who need deeper insights.',
    features: [
      { included: true, text: '30 reports per month' },
      { included: true, text: 'Full analysis suite' },
      { included: true, text: 'Competitor mapping' },
      { included: true, text: 'Priority AI processing' },
      { included: false, text: 'White-label reports' },
      { included: false, text: 'Team seats' },
    ],
    cta: 'Start Pro Trial',
    to: '/register',
    variant: 'primary',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/month',
    description: 'For agencies managing multiple brands.',
    features: [
      { included: true, text: 'Unlimited reports' },
      { included: true, text: 'Full analysis suite' },
      { included: true, text: 'Competitor mapping' },
      { included: true, text: 'Priority AI processing' },
      { included: true, text: 'White-label reports' },
      { included: true, text: '5 team seats' },
    ],
    cta: 'Contact Sales',
    to: '/register',
    variant: 'ghost',
    popular: false,
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

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-t border-[--border]">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[--text-primary] font-display">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-[--text-secondary] font-body max-w-lg mx-auto">
            Choose the plan that fits your needs. Scale as you grow.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={cn(
                'relative border rounded-xl p-6 flex flex-col transition-all duration-300',
                tier.popular
                  ? 'border-[--accent] bg-[--bg-secondary] shadow-lg shadow-[--accent-glow]'
                  : 'border-[--border] bg-[--bg-secondary]/50 hover:border-[--border-accent]'
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[--accent] text-[10px] font-semibold text-[--bg-primary] font-body uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[--text-primary] font-display">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[--text-primary] font-display">{tier.price}</span>
                  <span className="text-sm text-[--text-muted] font-body">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-[--text-secondary] font-body">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check size={16} className="text-[--accent] shrink-0" />
                    ) : (
                      <X size={16} className="text-[--text-muted] shrink-0" />
                    )}
                    <span className={f.included ? 'text-[--text-primary]' : 'text-[--text-muted]'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={tier.to}>
                <Button
                  variant={tier.variant}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
