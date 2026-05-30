import { BrowserRouter, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReportProvider } from './context/ReportContext'
import AppRoutes from './router'
import { AnimatePresence } from 'framer-motion'

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
        </ReportProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
