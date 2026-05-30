import { motion } from 'framer-motion'
import { mockReportData } from '../../lib/mockData'

const quadrantStyles = [
  { bg: 'bg-[--accent]/5', border: 'border-[--accent]/20', label: 'Strengths', labelColor: 'text-[--accent]' },
  { bg: 'bg-[--danger]/5', border: 'border-[--danger]/20', label: 'Weaknesses', labelColor: 'text-[--danger]' },
  { bg: 'bg-[--accent-secondary]/5', border: 'border-[--accent-secondary]/20', label: 'Opportunities', labelColor: 'text-[--accent-secondary]' },
  { bg: 'bg-[--warning]/5', border: 'border-[--warning]/20', label: 'Threats', labelColor: 'text-[--warning]' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const quadrantVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export default function SWOTMatrix({ reportId = 'b1' }) {
  const data = mockReportData(reportId)
  const { swot } = data
  const items = [swot.strengths, swot.weaknesses, swot.opportunities, swot.threats]

  return (
    <section>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid sm:grid-cols-2 gap-4"
      >
        {items.map((list, i) => (
          <motion.div
            key={quadrantStyles[i].label}
            variants={quadrantVariants}
            className={`border ${quadrantStyles[i].border} ${quadrantStyles[i].bg} rounded-xl p-5`}
          >
            <h4 className={`text-sm font-semibold font-display mb-3 ${quadrantStyles[i].labelColor}`}>
              {quadrantStyles[i].label}
            </h4>
            <ul className="space-y-2">
              {list.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[--text-secondary] font-body">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
