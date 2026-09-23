import React from 'react'
import { BriefcaseBusiness, FileText, LogOut, ScanSearch, Sparkles, UserRound } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutDemoUser } from '../services/storage'

export default function Header({ user, compact = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = () => { logoutDemoUser(); navigate('/') }
  const active = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  return <>
    <div className="announcement-bar no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[11px] font-semibold sm:text-xs">
        <Sparkles size={13} /> Smart resume building + ATS matching in one workspace.
      </div>
    </div>
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur no-print">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 ${compact ? 'h-16' : 'h-[72px]'}`}>
        <button onClick={() => navigate(user ? '/dashboard' : '/')} className="flex items-center gap-2.5 text-left">
          <span className="logo-mark"><FileText size={17}/></span>
          <span className="text-[15px] font-extrabold tracking-tight text-slate-950">ResumeCraft<span className="text-blue-600">AI</span></span>
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {!user ? <>
            <button onClick={() => navigate('/')} className="nav-link">Home</button>
            <button onClick={() => navigate('/auth')} className="nav-link">Create Resume</button>
          </> : <>
            <button onClick={() => navigate('/dashboard')} className={`nav-link ${active('/dashboard') && !active('/dashboard/resume') ? 'nav-link-active' : ''}`}>My Resumes</button>
            <button onClick={() => navigate('/dashboard/ats-checker')} className={`nav-link inline-flex items-center gap-2 ${active('/dashboard/ats-checker') ? 'nav-link-active' : ''}`}><ScanSearch size={15}/> ATS Checker</button><button onClick={() => navigate('/dashboard/job-tracker')} className={`nav-link inline-flex items-center gap-2 ${active('/dashboard/job-tracker') ? 'nav-link-active' : ''}`}><BriefcaseBusiness size={15}/> Job Tracker</button>
          </>}
        </nav>
        {user && <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 sm:flex"><UserRound size={15}/>{user.name}</div>
          <button onClick={signOut} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" title="Sign out"><LogOut size={17}/></button>
        </div>}
        {!user && <button onClick={() => navigate('/auth')} className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 sm:block">Login</button>}
      </div>
    </header>
  </>
}
