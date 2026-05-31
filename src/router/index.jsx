import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'

import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import Dashboard from '../pages/Dashboard'
import NewAnalysis from '../pages/NewAnalysis'
import ReportView from '../pages/ReportView'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import Pricing from '../pages/Pricing'
import NotFound from '../pages/NotFound'
import CompetitorIntelligence from '../pages/CompetitorIntelligence'
import CompetitorReport from '../pages/CompetitorReport'
import CommentIntelligence from '../pages/CommentIntelligence'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/new"
        element={
          <ProtectedRoute>
            <DashboardLayout><NewAnalysis /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout><ReportView /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout><Reports /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout><Settings /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/competitors"
        element={
          <ProtectedRoute>
            <DashboardLayout><CompetitorIntelligence /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/competitors/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout><CompetitorReport /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/comments"
        element={
          <ProtectedRoute>
            <DashboardLayout><CommentIntelligence /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
