import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { startAnalysis } from '../lib/services/analysisService'
import api from '../lib/api'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import toast from 'react-hot-toast'

const steps = ['Facebook Page', 'Connect Account', 'Confirm & Analyze']

export default function NewAnalysis() {
  const [step, setStep] = useState(0)
  const [fbUrl, setFbUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [fbConnected, setFbConnected] = useState(false)
  const [fbAccessToken, setFbAccessToken] = useState(null)
  const [analysisType, setAnalysisType] = useState('general')
  const [connectingFb, setConnectingFb] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const [finalizing, setFinalizing] = useState(false)
  const navigate = useNavigate()

  const brandName = fbUrl.match(/(?:facebook\.com\/)([^\/\s?]+)/)?.[1]
    ?.replace(/-/g, ' ')
    ?.replace(/\b\w/g, (l) => l.toUpperCase()) || ''

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fbToken = params.get('fb_token')
    const fbConnectedParam = params.get('fb_connected')
    const fbError = params.get('fb_error')

    if (fbToken && fbConnectedParam === 'true') {
      sessionStorage.setItem('pageiq_fb_token', fbToken)
      setFbAccessToken(fbToken)
      setFbConnected(true)
      setAnalysisType('comprehensive')
      setStep(1)
      window.history.replaceState({}, document.title, '/dashboard/new')
    }

    if (fbError) {
      toast.error('Facebook connection failed. You can still get a general report.')
      window.history.replaceState({}, document.title, '/dashboard/new')
    }
  }, [])

  function validateUrl(url) {
    return /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.-]+\/?$/.test(url)
  }

  function handleNext() {
    if (step === 0) {
      if (!validateUrl(fbUrl)) {
        setUrlError('Please enter a standard Facebook page URL (e.g. facebook.com/yourbrand). If your page uses a /people/ URL, set a username in Facebook Page Settings first.')
        return
      }
      setUrlError('')
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    }
  }

  function handleBack() { if (step > 0) setStep(step - 1) }

  async function handleConnectFacebook() {
    setConnectingFb(true)
    try {
      const { data } = await api.get('/api/facebook/oauth-url', {
        params: { state: 'pageiq_connect' }
      })
      window.location.href = data.url
    } catch (err) {
      toast.error('Could not initiate Facebook connection')
      setConnectingFb(false)
    }
  }

  const loadingStages = analysisType === 'comprehensive'
    ? [
        { label: 'Connecting to Facebook API...', duration: 1500 },
        { label: 'Fetching your page data...', duration: 2000 },
        { label: 'Analyzing content performance...', duration: 2500 },
        { label: 'Mapping competitor landscape...', duration: 2000 },
        { label: 'Generating your report...', duration: 2000 },
      ]
    : [
        { label: 'Researching your brand...', duration: 1500 },
        { label: 'Analyzing market position...', duration: 2000 },
        { label: 'Mapping competitor landscape...', duration: 2500 },
        { label: 'Identifying opportunities...', duration: 2000 },
        { label: 'Generating your report...', duration: 2000 },
      ]

  async function startAnalysisFlow() {
    setAnalyzing(true)

    // Start API call and animation simultaneously
    const token = fbAccessToken || sessionStorage.getItem('pageiq_fb_token') || null

    const analysisPromise = startAnalysis(
      fbUrl,
      brandName || fbUrl,
      analysisType,
      token
    )

    // Run animation while API call happens in background
    for (let i = 0; i < loadingStages.length; i++) {
      setCurrentStage(i)
      const start = Date.now()
      const duration = loadingStages[i].duration
      await new Promise((resolve) => {
        function animate() {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          setStageProgress(progress)
          if (progress < 1) requestAnimationFrame(animate)
          else resolve()
        }
        requestAnimationFrame(animate)
      })
    }

    // Animation done — now wait for API if not finished yet
    setFinalizing(true)

    try {
      const result = await analysisPromise
      sessionStorage.removeItem('pageiq_fb_token')

      const reportId = result.reportId || result.id
      if (reportId) {
        navigate(`/dashboard/reports/${reportId}`)
      } else {
        toast.error('Report created but could not navigate. Check your reports.')
        navigate('/dashboard/reports')
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.')
      setAnalyzing(false)
      setFinalizing(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        {!analyzing ? (
          <>
            <div className="flex items-center justify-between mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-body transition-colors', i < step ? 'bg-[--accent] text-[--bg-primary]' : i === step ? 'border-2 border-[--accent] text-[--accent]' : 'border border-[--border] text-[--text-muted]')}>
                      {i < step ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={cn('text-sm font-body hidden sm:inline', i <= step ? 'text-[--text-primary]' : 'text-[--text-muted]')}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className={cn('w-8 sm:w-16 h-px mx-2', i < step ? 'bg-[--accent]' : 'bg-[--border]')} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Enter Facebook Page</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">Paste the URL of the Facebook business page you want to analyze.</p>
                  </div>
                  <Input label="Facebook Page URL" type="url" placeholder="https://facebook.com/yourbrand" icon={Search} value={fbUrl} onChange={(e) => { setFbUrl(e.target.value); setUrlError('') }} error={urlError} />
                  {brandName && fbUrl && !urlError && (
                    <Card className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[--accent-glow] flex items-center justify-center text-lg font-bold text-[--accent] font-display">{brandName.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-[--text-primary] font-body">{brandName}</p>
                        <p className="text-xs text-[--text-muted] font-body">Facebook Business Page</p>
                      </div>
                      <Check size={16} className="ml-auto text-[--accent]" />
                    </Card>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={handleNext} variant="primary">Continue <ArrowRight size={16} /></Button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Connect Your Account</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">Connect Facebook for a comprehensive report with real metrics, or skip for an AI-powered general report.</p>
                  </div>

                  <button
                    onClick={handleConnectFacebook}
                    disabled={connectingFb || fbConnected}
                    className={cn('w-full p-5 rounded-xl border-2 text-left transition-all duration-200 group', fbConnected ? 'border-[--accent] bg-[--accent]/5' : 'border-[--border] hover:border-[--accent] hover:bg-[--accent]/5')}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', fbConnected ? 'bg-[--accent]' : 'bg-[#1877F2]/20')}>
                        {fbConnected ? <Check size={20} className="text-[--bg-primary]" /> : <span className="text-[#1877F2] font-bold text-sm">f</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[--text-primary] font-body text-sm">
                          {fbConnected ? 'Facebook Connected ✓' : connectingFb ? 'Connecting...' : 'Connect with Facebook'}
                        </p>
                        <p className="text-xs text-[--text-secondary] font-body mt-1">
                          {fbConnected ? 'Your page metrics, audience data and insights will be included.' : 'Get real follower counts, engagement rates, audience demographics, and post performance data.'}
                        </p>
                        {!fbConnected && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {['Real metrics', 'Audience demographics', 'Post analytics', 'Engagement data'].map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[--accent]/10 text-[--accent] font-body">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {!fbConnected && <ArrowRight size={16} className="text-[--text-muted] group-hover:text-[--accent] transition-colors shrink-0 mt-1" />}
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[--border]" />
                    <span className="text-xs text-[--text-muted] font-body">or</span>
                    <div className="flex-1 h-px bg-[--border]" />
                  </div>

                  <button
                    onClick={() => { setAnalysisType('general'); setStep(2) }}
                    className={cn('w-full p-5 rounded-xl border text-left transition-all duration-200 group', analysisType === 'general' && !fbConnected ? 'border-[--border-accent] bg-[--bg-tertiary]' : 'border-[--border] hover:border-[--border-accent] hover:bg-[--bg-tertiary]')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[--bg-tertiary] border border-[--border] flex items-center justify-center shrink-0">
                        <Search size={16} className="text-[--text-muted]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[--text-primary] font-body text-sm">Skip — Get General Report</p>
                        <p className="text-xs text-[--text-secondary] font-body mt-1">AI-powered analysis using publicly available information. No login required.</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {['Brand positioning', 'Competitor landscape', 'Market trends', 'SWOT analysis'].map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[--bg-tertiary] border border-[--border] text-[--text-muted] font-body">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-[--text-muted] group-hover:text-[--text-secondary] transition-colors shrink-0 mt-1" />
                    </div>
                  </button>

                  {fbConnected && (
                    <div className="flex justify-between">
                      <Button onClick={handleBack} variant="ghost"><ArrowLeft size={16} /> Back</Button>
                      <Button onClick={() => setStep(2)} variant="primary">Continue <ArrowRight size={16} /></Button>
                    </div>
                  )}
                  {!fbConnected && (
                    <div className="flex justify-start">
                      <Button onClick={handleBack} variant="ghost"><ArrowLeft size={16} /> Back</Button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Confirm & Analyze</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">Review the details below before starting your analysis.</p>
                  </div>
                  <Card className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[--text-muted] font-body">Facebook Page</span>
                      <span className="text-[--text-primary] font-body font-medium">{brandName || fbUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[--text-muted] font-body">Report Type</span>
                      <span className={cn('font-body font-medium text-xs px-2 py-0.5 rounded-full', analysisType === 'comprehensive' ? 'bg-[--accent]/10 text-[--accent]' : 'bg-[--bg-tertiary] text-[--text-secondary]')}>
                        {analysisType === 'comprehensive' ? '⚡ Comprehensive (FB Connected)' : 'General (AI-Powered)'}
                      </span>
                    </div>
                    <div className="pt-3 text-xs text-[--text-muted] font-body space-y-1">
                      <p>✓ Brand positioning & SWOT analysis</p>
                      <p>✓ Competitor landscape mapping</p>
                      <p>✓ Market trends & opportunities</p>
                      <p>✓ AI-powered recommendations</p>
                      {analysisType === 'comprehensive' && (
                        <>
                          <p className="text-[--accent]">✓ Real follower & engagement metrics</p>
                          <p className="text-[--accent]">✓ Actual audience demographics</p>
                          <p className="text-[--accent]">✓ Post performance breakdown</p>
                          <p className="text-[--accent]">✓ Page insights data</p>
                        </>
                      )}
                    </div>
                  </Card>
                  <div className="flex justify-between">
                    <Button onClick={handleBack} variant="ghost"><ArrowLeft size={16} /> Back</Button>
                    <Button onClick={startAnalysisFlow} variant="primary">Start Analysis <ArrowRight size={16} /></Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-8">
              {loadingStages.map((stage, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn('font-body transition-colors', i < currentStage ? 'text-[--accent]' : i === currentStage ? 'text-[--text-primary]' : 'text-[--text-muted]')}>
                      {stage.label}
                    </span>
                    {i < currentStage && <CheckCircle size={16} className="text-[--accent]" />}
                    {i === currentStage && <span className="text-xs text-[--text-muted] font-mono">{Math.round(stageProgress * 100)}%</span>}
                  </div>
                  <div className="h-1 rounded-full bg-[--bg-tertiary] overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all duration-200', i < currentStage ? 'bg-[--accent] w-full' : i === currentStage ? 'bg-[--accent]' : 'w-0')} style={i === currentStage ? { width: `${stageProgress * 100}%` } : {}} />
                  </div>
                </div>
              ))}
            </div>
            {finalizing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-[--text-muted] font-body text-center mt-6"
              >
                Finalizing your report...
              </motion.p>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
