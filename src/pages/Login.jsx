import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Globe, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [googleMsg, setGoogleMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      setError(msg === 'Network Error' ? 'Cannot reach server — make sure the backend is running on port 3001' : msg)
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
          <div className="border border-[--border] bg-[--bg-secondary] rounded-xl p-8 backdrop-blur-md bg-white/5">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-[--text-primary] font-display">Sign In</h1>
              <p className="text-sm text-[--text-secondary] font-body mt-1">Welcome back to PageIQ</p>
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
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
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
              Sign in with Google
            </Button>

            <p className="mt-6 text-center text-xs text-[--text-muted] font-body">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[--accent] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
