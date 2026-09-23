import React, { useEffect, useMemo, useState } from 'react'
import { Bookmark, BriefcaseBusiness, ChevronDown, ExternalLink, MapPin, RefreshCw, Search, Sparkles, Target, X } from 'lucide-react'
import Header from '../components/Header'
import { getDemoUser } from '../services/storage'
import { getResumes, getResume } from '../services/storage'
import { searchJobs } from '../services/jobs'
import { generateJobSearchProfile } from '../services/gemini'

const SAVED_KEY = 'resumecraft-job-pipeline-v1'
const getSaved = () => JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
const saveSaved = (items) => localStorage.setItem(SAVED_KEY, JSON.stringify(items))

export default function JobTracker() {
  const [resumes,setResumes] = useState(getResumes())
  const [resumeId,setResumeId] = useState(resumes[0]?.id || '')
  const [query,setQuery] = useState('')
  const [location,setLocation] = useState('')
  const [remoteOnly,setRemoteOnly] = useState(false)
  const [jobs,setJobs] = useState([])
  const [loading,setLoading] = useState(false)
  const [source,setSource] = useState('')
  const [saved,setSaved] = useState(getSaved())
  const [filter,setFilter] = useState('all')
  const [aiProfile,setAiProfile] = useState(null)

  const resume = useMemo(()=>resumeId ? getResume(resumeId) : null,[resumeId, resumes])
  const runSearch = async () => {
    setLoading(true)
    try { const result = await searchJobs({resume,query,location,remoteOnly}); setJobs(result.jobs); setSource(result.live ? result.source : `${result.source} • fallback`)}
    finally { setLoading(false) }
  }
  useEffect(()=>{ if(!resume) return; (async()=>{ setAiProfile(await generateJobSearchProfile({resume})); runSearch() })() },[resumeId])

  const toggleSaved = (job) => {
    const existing = saved.find(x=>x.id===job.id)
    const next = existing ? saved.filter(x=>x.id!==job.id) : [{...job,status:'saved'},...saved].slice(0,50)
    setSaved(next); saveSaved(next)
  }
  const updateStatus = (job,status) => {
    const exists = saved.some(x=>x.id===job.id)
    const next = exists ? saved.map(x=>x.id===job.id?{...x,status}:x) : [{...job,status},...saved].slice(0,50)
    setSaved(next); saveSaved(next)
  }
  const visible = filter==='saved' ? jobs.filter(j=>saved.some(s=>s.id===j.id)) : jobs
  return <div className="min-h-screen bg-slate-50"><Header user={getDemoUser()} compact/>
    <main className="mx-auto max-w-7xl px-5 py-8">
      <section className="job-hero">
        <div><span className="optimizer-badge"><Sparkles size={13}/> Resume-aware job matching</span><h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Find roles that fit the resume you already have.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Pick a resume, search roles, and see an explainable match score based on title, skills and resume language. Apply buttons open the original listing.</p></div>
        <div className="soft-card p-4 lg:min-w-[360px]"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Using resume</p><select value={resumeId} onChange={e=>setResumeId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"><option value="">Select a resume</option>{resumes.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select><p className="mt-2 text-[11px] text-slate-500">{resume ? `${resume.personal.jobTitle || 'No target role'} • ${(resume.skills||[]).filter(s=>s.name).length} listed skills` : 'Create a resume first to personalize results.'}</p></div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-3 lg:grid-cols-[1.3fr_.75fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runSearch()} placeholder={resume?.personal?.jobTitle || 'Search role, skill or keyword'} className="w-full bg-transparent py-3 text-sm outline-none"/></label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"><MapPin size={17} className="text-slate-400"/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full bg-transparent py-3 text-sm outline-none"/></label>
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600"><input type="checkbox" checked={remoteOnly} onChange={e=>setRemoteOnly(e.target.checked)} className="h-4 w-4 accent-blue-600"/> Remote</label>
        <button onClick={runSearch} disabled={loading || !resume} className="primary-btn justify-center disabled:opacity-50">{loading?<RefreshCw className="animate-spin" size={16}/>:<Target size={16}/>} Match jobs</button>
      </div></section>

      <section className="mt-7 flex flex-wrap items-center justify-between gap-3"><div><p className="section-kicker">Recommended jobs</p><h2 className="mt-1 text-xl font-black">{jobs.length} roles found</h2>{source&&<p className="mt-1 text-[11px] text-slate-500">Source: {source}. Job data is shown for discovery; verify details on the original listing.</p>}</div><div className="flex gap-2"><button onClick={()=>setFilter('all')} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter==='all'?'bg-slate-900 text-white':'bg-white text-slate-600 border border-slate-200'}`}>All</button><button onClick={()=>setFilter('saved')} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter==='saved'?'bg-slate-900 text-white':'bg-white text-slate-600 border border-slate-200'}`}>Saved ({saved.length})</button></div></section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        {visible.map(job=><JobCard key={job.id} job={job} saved={saved.some(s=>s.id===job.id)} status={saved.find(s=>s.id===job.id)?.status || 'saved'} onSave={()=>toggleSaved(job)} onStatusChange={(status)=>updateStatus(job,status)} />)}
        {!loading && visible.length===0 && <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><BriefcaseBusiness className="mx-auto text-slate-300" size={40}/><h3 className="mt-4 font-bold">No saved jobs in this result set</h3><p className="mt-1 text-sm text-slate-500">Run a broader search and save roles you want to revisit.</p></div>}
      </section>
    </main>
  </div>
}

function JobCard({job,saved,status,onSave,onStatusChange}) {
  const score = job.matchScore || 0
  return <article className="job-card"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{score}% match</span>{job.remote&&<span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Remote</span>}<span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{job.type}</span></div><h3 className="mt-3 text-lg font-black text-slate-950">{job.title}</h3><p className="mt-1 text-sm font-semibold text-slate-600">{job.company}</p><p className="mt-1 text-xs text-slate-500">{job.location}</p></div><button onClick={onSave} className={`rounded-xl border p-2.5 ${saved?'border-blue-200 bg-blue-50 text-blue-600':'border-slate-200 text-slate-400 hover:bg-slate-50'}`} title={saved?'Unsave':'Save'}>{saved?<Bookmark size={17} fill="currentColor"/>:<Bookmark size={17}/>}</button></div>
    <p className="mt-4 text-sm leading-6 text-slate-600">{job.description || 'Open the original listing to read the full job description.'}</p>
    {job.matchedKeywords?.length>0&&<div className="mt-4 flex flex-wrap gap-1.5">{job.matchedKeywords.map(k=><span key={k} className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">{k}</span>)}</div>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-semibold text-slate-500">Track:</span><select value={status} onChange={e=>onStatusChange(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700"><option value="saved">Saved</option><option value="applied">Applied</option><option value="interview">Interview</option><option value="rejected">Not selected</option><option value="offer">Offer</option></select><span className="text-[11px] font-semibold text-slate-500">Match is a heuristic.</span></div><a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800">Apply / view job <ExternalLink size={14}/></a></div>
  </article>
}
