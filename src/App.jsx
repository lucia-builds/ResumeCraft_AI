import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { getDemoUser } from './services/storage'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import ResumeView from './pages/ResumeView'
import AtsChecker from './pages/AtsChecker'
import JobTracker from './pages/JobTracker'
import ChatAssistant from './components/ChatAssistant'

function Protected({ children }) {
  const user = getDemoUser()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const navigate = useNavigate()
  const [session, setSession] = useState(getDemoUser())
  useEffect(() => {
    const onStorage = () => setSession(getDemoUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const goDashboard = () => navigate(session ? '/dashboard' : '/auth')
  const auth = useMemo(() => ({ session, setSession }), [session])

  return <>
  <Routes>
    <Route path="/" element={<Landing onGetStarted={goDashboard} onAts={() => navigate(session ? '/dashboard/ats-checker' : '/auth?next=/dashboard/ats-checker')} />} />
    <Route path="/auth" element={<Auth onSignedIn={(u, next) => { setSession(u); navigate(next || '/dashboard') }} />} />
    <Route path="/dashboard" element={<Protected><Dashboard auth={auth} /></Protected>} />
    <Route path="/dashboard/resume/:id/edit" element={<Protected><Builder /></Protected>} />
    <Route path="/my-resume/:id/view" element={<ResumeView />} />
    <Route path="/dashboard/ats-checker" element={<Protected><AtsChecker /></Protected>} />
    <Route path="/dashboard/job-tracker" element={<Protected><JobTracker /></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  <ChatAssistant />
  </>
}
