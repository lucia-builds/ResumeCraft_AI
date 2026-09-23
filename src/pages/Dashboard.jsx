import React, { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, FileText, Plus, Search, ScanSearch, Trash2, UploadCloud } from 'lucide-react'
import ReviewsSection from '../components/ReviewsSection'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { createResume, deleteResume, getResumes } from '../services/storage'

export default function Dashboard({ auth }) {
  const navigate = useNavigate(); const [resumes,setResumes]=useState([]); const [query,setQuery]=useState('')
  const refresh = () => setResumes(getResumes())
  useEffect(refresh, [])
  const add = () => { const r=createResume('Untitled Resume'); refresh(); navigate(`/dashboard/resume/${r.id}/edit`) }
  const remove = (id) => { if(confirm('Delete this resume?')) { deleteResume(id); refresh() } }
  const filtered = useMemo(()=>resumes.filter(r => r.title.toLowerCase().includes(query.toLowerCase())),[resumes,query])
  return <div className="min-h-screen bg-slate-50"><Header user={auth.session}/>
    <main className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
      <section className="dashboard-hero">
        <div><p className="section-kicker">Workspace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Good resumes are built one detail at a time.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Create a tailored resume, keep versions organized, and check alignment against a real job description before you apply.</p></div>
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-0"><button onClick={()=>navigate('/dashboard/ats-checker')} className="secondary-btn"><ScanSearch size={17}/> ATS checker</button><button onClick={add} className="primary-btn"><Plus size={17}/> Create resume</button></div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Saved resumes" value={resumes.length}/><Stat label="ATS workspace" value="Ready"/><Stat label="Voice editing" value="On"/><Stat label="Resume Guide" value="Online"/></section>

      <section className="mt-7 grid gap-4 md:grid-cols-2"><button onClick={()=>navigate('/dashboard/job-tracker')} className="soft-card group flex items-center justify-between p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-blue-600"><BriefcaseBusiness size={14}/> Job tracker</div><h3 className="mt-2 font-black">Find jobs matched to your resume</h3><p className="mt-1 text-xs leading-5 text-slate-500">Search roles and open the original job description from the source.</p></div><ArrowUpRight className="text-slate-300 transition group-hover:text-blue-600" size={18}/></button><button onClick={()=>navigate('/dashboard/ats-checker')} className="soft-card group flex items-center justify-between p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-emerald-600"><ScanSearch size={14}/> Resume optimizer</div><h3 className="mt-2 font-black">Tune a resume for one job</h3><p className="mt-1 text-xs leading-5 text-slate-500">Upload a resume and compare it against a specific job description.</p></div><ArrowUpRight className="text-slate-300 transition group-hover:text-emerald-600" size={18}/></button></section>

      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:w-[360px]"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search resumes" className="w-full bg-transparent text-sm outline-none"/></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600"><UploadCloud size={14}/></span>Upload and fix an existing resume in the ATS workspace.</div></section>

      <section className="mt-8"><div className="flex items-end justify-between"><div><p className="section-kicker">Your library</p><h2 className="mt-1 text-xl font-black">My resumes</h2></div><button onClick={add} className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 sm:inline-flex items-center gap-1">New resume <ArrowUpRight size={15}/></button></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(r=><article key={r.id} className="resume-card group"><button onClick={()=>navigate(`/dashboard/resume/${r.id}/edit`)} className="w-full text-left"><div className="resume-card-preview"><div className="mini-paper"><div className="flex items-start justify-between"><div><div className="h-2 w-24 rounded bg-slate-900"/><div className="mt-1.5 h-1.5 w-14 rounded bg-slate-200"/></div><div className="h-5 w-5 rounded-full" style={{background:r.theme}}/></div>{['Summary','Experience','Education','Skills'].map((s,i)=><div key={s} className="mt-4"><div className="text-[7px] font-black uppercase tracking-[.18em]" style={{color:r.theme}}>{s}</div><div className="mt-1.5 h-1.5 w-full rounded bg-slate-100"/><div className="mt-1.5 h-1.5 w-10/12 rounded bg-slate-100"/></div>)}</div></div><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-900">{r.title}</h3><p className="mt-1 text-xs text-slate-500">Updated {new Date(r.updatedAt).toLocaleDateString()}</p></div><span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">EDIT</span></div></button><button onClick={()=>remove(r.id)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"><Trash2 size={13}/> Delete</button></article>)}
          {filtered.length===0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><FileText className="mx-auto text-slate-300" size={42}/><h3 className="mt-4 font-bold">No resumes found</h3><p className="mt-1 text-sm text-slate-500">Create a resume or try another search.</p><button onClick={add} className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Create Resume</button></div>}
        </div>
      </section>

      <ReviewsSection compact />
    </main>
  </div>
}
function Stat({label,value}){ return <div className="soft-card p-5"><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div> }
