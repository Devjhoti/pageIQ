import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Globe, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [googleMsg, setGoogleMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!termsAccepted) {
      setError('Please accept the terms and conditions')
      return
    }
    setSubmitting(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || err.message || ''
      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('already been registered') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('unique constraint') ||
        msg.toLowerCase().includes('user already')
      ) {
        setError('This email is already registered. Try signing in instead.')
      } else if (msg === 'Network Error') {
        setError('Cannot reach server — make sure the backend is running.')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setGoogleMsg('')
    const result = await loginWithGoogle()
    setGoogleMsg(result.message)
    setTimeout(() => setGoogleMsg(''), 3000)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[--bg-primary] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-[--text-primary] font-display">Create Account</h1>
              <p className="text-sm text-[--text-secondary] font-body mt-1">Start your brand intelligence journey</p>
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
              {googleMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[--warning]/10 border border-[--warning]/20 text-sm text-[--warning] font-body"
                >
                  <Globe size={16} />
                  <span>{googleMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                icon={Lock}
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
              />

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-[--accent]"
                />
                <span className="text-xs text-[--text-secondary] font-body leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[--accent] hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[--accent] hover:underline">Privacy Policy</a>
                </span>
              </label>

              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[--border]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-[--text-muted] bg-[--bg-secondary] font-body">or</span>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoogle}
            >
              <Globe size={16} />
              Sign up with Google
            </Button>

            <p className="mt-6 text-center text-xs text-[--text-muted] font-body">
              Already have an account?{' '}
              <Link to="/login" className="text-[--accent] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
