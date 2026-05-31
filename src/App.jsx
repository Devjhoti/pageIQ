import { BrowserRouter, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReportProvider } from './context/ReportContext'
import AppRoutes from './router'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <AppRoutes key={location.pathname} />
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportProvider>
          <AnimatedRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
        </ReportProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
