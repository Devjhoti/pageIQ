import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo.svg'

const sections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Sample Report', to: '/#sample-report' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '#' },
      { label: 'Blog', to: '#' },
      { label: 'Careers', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '#' },
      { label: 'Terms', to: '#' },
      { label: 'Cookies', to: '#' },
    ],
  },
]

const socials = [
  { label: 'Twitter', to: '#' },
  { label: 'LinkedIn', to: '#' },
  { label: 'GitHub', to: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--bg-primary]">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-3">
              <img src={logoSrc} alt="PageIQ" className="h-6" />
            </Link>
            <p className="text-sm text-[--text-muted] font-body max-w-xs leading-relaxed">
              Brand Intelligence, Redefined. AI-powered analysis for Facebook business pages.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-[--text-primary] font-body mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[--text-secondary] hover:text-[--text-primary] transition-colors font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-[--text-primary] font-body mb-3">
              Social
            </h4>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.to}
                    className="text-sm text-[--text-secondary] hover:text-[--text-primary] transition-colors font-body"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[--border]">
          <p className="text-xs text-[--text-muted] font-body">
            &copy; {new Date().getFullYear()} PageIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
