import { useState } from 'react'
import { User, Key, Bell, CreditCard, AlertTriangle, Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [savedKey, setSavedKey] = useState('')
  const [showSavedKey, setShowSavedKey] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    emailReports: true,
    emailMarketing: false,
    pushAnalysisComplete: true,
    pushWeeklyDigest: false,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageWrapper>
      <div className="flex gap-8">
        <nav className="hidden md:flex flex-col w-48 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body text-left transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-[--accent]/10 text-[--accent] border border-[--accent]/20'
                  : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-tertiary] border border-transparent'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Profile</h2>
                    <p className="text-sm text-[--text-secondary] font-body">Manage your personal information</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[--accent-glow] flex items-center justify-center text-xl font-bold text-[--accent] font-display">R</div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                  </div>
                  <div className="space-y-4">
                    <Input label="Full Name" type="text" defaultValue="Rahul Sharma" />
                    <Input label="Email" type="email" defaultValue="demo@pageiq.io" />
                    <Input label="Company" type="text" placeholder="Your company" />
                  </div>
                  <Button onClick={handleSave} variant="primary">
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              )}

              {activeTab === 'api-keys' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">API Keys</h2>
                    <p className="text-sm text-[--text-secondary] font-body">Manage your Facebook Business API keys</p>
                  </div>
                  <Card>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          label="Facebook API Key"
                          type={showSavedKey ? 'text' : 'password'}
                          value={savedKey || 'EAACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
                          onChange={(e) => setSavedKey(e.target.value)}
                          icon={Key}
                        />
                        <button
                          onClick={() => setShowSavedKey(!showSavedKey)}
                          className="absolute right-3 top-[38px] text-[--text-muted] hover:text-[--text-primary]"
                        >
                          {showSavedKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <Button variant="primary">Update Key</Button>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[--text-primary] font-body">Facebook App (Optional)</p>
                        <p className="text-xs text-[--text-muted] font-body">Connected as PageIQ App</p>
                      </div>
                      <Badge variant="success" className="text-xs">Connected</Badge>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Notifications</h2>
                    <p className="text-sm text-[--text-secondary] font-body">Choose what notifications you receive</p>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(notifications).map(([key, val]) => (
                      <label key={key} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[--bg-tertiary]/50 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm text-[--text-primary] font-body">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className="accent-[--accent]"
                        />
                      </label>
                    ))}
                  </div>
                  <Button onClick={handleSave} variant="primary">
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </Button>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Billing</h2>
                    <p className="text-sm text-[--text-secondary] font-body">Manage your subscription and billing</p>
                  </div>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-[--text-primary] font-body">Current Plan</p>
                        <p className="text-xs text-[--text-muted] font-body">You are on the Pro plan</p>
                      </div>
                      <Badge variant="info">Pro</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-t border-[--border]">
                      <span className="text-[--text-secondary] font-body">Price</span>
                      <span className="text-[--text-primary] font-body font-medium">$29/month</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-t border-[--border]">
                      <span className="text-[--text-secondary] font-body">Reports Used</span>
                      <span className="text-[--text-primary] font-body">3 / 30</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="secondary" className="w-full">Upgrade to Agency</Button>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-lg font-semibold text-[--text-primary] font-display">Danger Zone</h2>
                    <p className="text-sm text-[--text-secondary] font-body">Irreversible account actions</p>
                  </div>
                  <Card className="border-[--danger]/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[--text-primary] font-body">Delete Account</p>
                        <p className="text-xs text-[--text-secondary] font-body">
                          Permanently remove your account and all associated data
                        </p>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Delete Account">
        <div className="space-y-4">
          <p className="text-sm text-[--text-secondary] font-body leading-relaxed">
            This action is <strong className="text-[--danger]">irreversible</strong>. All your reports, API keys, and account data will be permanently deleted.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setDeleteConfirmOpen(false); handleSave() }}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

function Badge({ variant = 'default', className, children }) {
  const variants = {
    default: 'bg-[--bg-tertiary] text-[--text-secondary] border-[--border]',
    success: 'bg-[--success]/10 text-[--success] border-[--success]/20',
    info: 'bg-[--accent-secondary]/10 text-[--accent-secondary] border-[--accent-secondary]/20',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  )
}
