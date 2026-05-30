import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Key, Check, ArrowRight, ArrowLeft, Eye, EyeOff, HelpCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const steps = ['Facebook Page', 'Connect API', 'Confirm & Analyze']

const loadingStages = [
  { label: 'Connecting to Facebook API...', duration: 1500 },
  { label: 'Fetching page data...', duration: 2000 },
  { label: 'Running brand analysis...', duration: 2500 },
  { label: 'Mapping competitor landscape...', duration: 2000 },
  { label: 'Generating your report...', duration: 2000 },
]

export default function NewAnalysis() {
  const [step, setStep] = useState(0)
  const [fbUrl, setFbUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [appId, setAppId] = useState('')
  const [urlError, setUrlError] = useState('')
  const [helpOpen, setHelpOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const navigate = useNavigate()

  const brandName = fbUrl.match(/(?:facebook\.com\/)([^\/\s?]+)/)?.[1]
    ?.replace(/-/g, ' ')
    ?.replace(/\b\w/g, (l) => l.toUpperCase()) || ''

  function validateUrl(url) {
    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.-]+\/?$/
    return fbRegex.test(url)
  }

  function handleNext() {
    if (step === 0) {
      if (!validateUrl(fbUrl)) {
        setUrlError('Please enter a valid Facebook page URL')
        return
      }
      setUrlError('')
      setStep(1)
    } else if (step === 1) {
      if (!apiKey) return
      setStep(2)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  async function startAnalysis() {
    setAnalyzing(true)
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
    navigate('/dashboard/reports/r1')
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
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-body transition-colors',
                      i < step ? 'bg-[--accent] text-[--bg-primary]' :
                      i === step ? 'border-2 border-[--accent] text-[--accent]' :
                      'border border-[--border] text-[--text-muted]'
                    )}>
                      {i < step ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={cn(
                      'text-sm font-body hidden sm:inline',
                      i <= step ? 'text-[--text-primary]' : 'text-[--text-muted]'
                    )}>
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      'w-8 sm:w-16 h-px mx-2',
                      i < step ? 'bg-[--accent]' : 'bg-[--border]'
                    )} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Enter Facebook Page</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">
                      Paste the URL of the Facebook business page you want to analyze.
                    </p>
                  </div>
                  <Input
                    label="Facebook Page URL"
                    type="url"
                    placeholder="https://facebook.com/yourbrand"
                    icon={Search}
                    value={fbUrl}
                    onChange={(e) => { setFbUrl(e.target.value); setUrlError('') }}
                    error={urlError}
                  />
                  {brandName && fbUrl && !urlError && (
                    <Card className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[--accent-glow] flex items-center justify-center text-lg font-bold text-[--accent] font-display">
                        {brandName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[--text-primary] font-body">{brandName}</p>
                        <p className="text-xs text-[--text-muted] font-body">Facebook Business Page</p>
                      </div>
                      <Check size={16} className="ml-auto text-[--accent]" />
                    </Card>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={handleNext} variant="primary">
                      Continue <ArrowRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Connect Facebook API</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">
                      Your API key is encrypted and used only for analysis.
                    </p>
                  </div>
                  <div className="relative">
                    <Input
                      label="Facebook Business API Key"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="EAAC...xxxxxxxx"
                      icon={Key}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-[38px] text-[--text-muted] hover:text-[--text-primary]"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="flex items-center gap-1 text-xs text-[--text-muted] hover:text-[--accent] transition-colors font-body"
                  >
                    <HelpCircle size={14} />
                    Where do I find this?
                  </button>
                  <Input
                    label="App ID (Optional)"
                    type="text"
                    placeholder="000000000000000"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <Button onClick={handleBack} variant="ghost">
                      <ArrowLeft size={16} /> Back
                    </Button>
                    <Button onClick={handleNext} variant="primary" disabled={!apiKey}>
                      Continue <ArrowRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Confirm & Analyze</h2>
                    <p className="text-sm text-[--text-secondary] font-body mt-1">
                      Review the details below before starting your analysis.
                    </p>
                  </div>
                  <Card className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[--text-muted] font-body">Facebook Page</span>
                      <span className="text-[--text-primary] font-body font-medium">{brandName || fbUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[--text-muted] font-body">API Key</span>
                      <span className="text-[--text-primary] font-mono text-xs">
                        {apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[--text-muted] font-body">Analysis Type</span>
                      <span className="text-[--text-primary] font-body">Full Brand Intelligence</span>
                    </div>
                    <div className="pt-3 text-xs text-[--text-muted] font-body space-y-1">
                      <p>✓ Audience demographics & engagement analysis</p>
                      <p>✓ Content performance breakdown</p>
                      <p>✓ SWOT & competitor intelligence</p>
                      <p>✓ Market trend mapping</p>
                      <p>✓ AI-powered recommendations</p>
                    </div>
                  </Card>
                  <div className="flex justify-between">
                    <Button onClick={handleBack} variant="ghost">
                      <ArrowLeft size={16} /> Back
                    </Button>
                    <Button onClick={startAnalysis} variant="primary">
                      Start Analysis <ArrowRight size={16} />
                    </Button>
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
                    <span className={cn(
                      'font-body transition-colors',
                      i < currentStage ? 'text-[--accent]' :
                      i === currentStage ? 'text-[--text-primary]' :
                      'text-[--text-muted]'
                    )}>
                      {stage.label}
                    </span>
                    {i < currentStage && <CheckCircle size={16} className="text-[--accent]" />}
                    {i === currentStage && (
                      <span className="text-xs text-[--text-muted] font-mono">
                        {Math.round(stageProgress * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="h-1 rounded-full bg-[--bg-tertiary] overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-200',
                        i < currentStage ? 'bg-[--accent] w-full' :
                        i === currentStage ? 'bg-[--accent]' : 'w-0'
                      )}
                      style={i === currentStage ? { width: `${stageProgress * 100}%` } : {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Find Your API Key">
        <div className="space-y-3 text-sm text-[--text-secondary] font-body leading-relaxed">
          <p>To find your Facebook Business API key:</p>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Go to <strong className="text-[--text-primary]">developers.facebook.com</strong></li>
            <li>Create or select your app from the dashboard</li>
            <li>Navigate to <strong className="text-[--text-primary]">Settings &gt; Basic</strong></li>
            <li>Copy your <strong className="text-[--text-primary]">App Secret</strong> or generate an <strong className="text-[--text-primary]">Access Token</strong></li>
            <li>Paste it in the API key field above</li>
          </ol>
          <p className="text-xs text-[--text-muted] pt-2">
            Your API key is encrypted in transit and never stored on our servers after analysis.
          </p>
        </div>
      </Modal>
    </PageWrapper>
  )
}
