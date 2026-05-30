import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockSendResetLink } from '../lib/mockData'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email')
      return
    }
    setStatus('sending')
    try {
      await mockSendResetLink(email)
      setStatus('sent')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[--bg-primary] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-8">
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[--success]/10 flex items-center justify-center">
                  <CheckCircle size={24} className="text-[--success]" />
                </div>
                <h1 className="text-2xl font-semibold text-[--text-primary] font-display mb-1">Check Your Email</h1>
                <p className="text-sm text-[--text-secondary] font-body mb-6">
                  We&apos;ve sent a password reset link to <strong className="text-[--text-primary]">{email}</strong>
                </p>
                <p className="text-xs text-[--text-muted] font-body mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-[--accent] hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    try again
                  </button>
                </p>
                <Link to="/login">
                  <Button variant="secondary" className="w-full">
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-semibold text-[--text-primary] font-display">Reset Password</h1>
                  <p className="text-sm text-[--text-secondary] font-body mt-1">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[--danger]/10 border border-[--danger]/20 text-sm text-[--danger] font-body"
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" variant="primary" className="w-full" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <p className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body"
                  >
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
