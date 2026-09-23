import React, { useMemo, useState } from 'react'
import { Check, Filter, LayoutTemplate } from 'lucide-react'
import { resumeTemplates } from '../data'

export default function TemplateGallery({ value, onChange, inline=false }) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(resumeTemplates.map(t=>t.category))]
  const list = useMemo(()=>filter==='All'?resumeTemplates:resumeTemplates.filter(t=>t.category===filter),[filter])
  return <div className={inline ? '' : 'rounded-2xl border border-slate-200 bg-white p-4'}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><div className="flex items-center gap-2"><LayoutTemplate size={16} className="text-blue-600"/><h3 className="font-black text-slate-900">Resume templates</h3></div><p className="mt-1 text-xs text-slate-500">ATS-first layouts inspired by recruiter-friendly resume conventions.</p></div>
      <div className="flex flex-wrap gap-1.5"><Filter size={14} className="mt-2 text-slate-400"/>{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold ${filter===c?'bg-slate-900 text-white':'bg-slate-100 text-slate-600'}`}>{c}</button>)}</div>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {list.map(t=><button key={t.id} type="button" onClick={()=>onChange(t.id)} className={`group text-left rounded-2xl border p-3 transition ${value===t.id?'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100':'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'}`}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2.5"><TemplateMini template={t}/></div>
        <div className="mt-3 flex items-start justify-between gap-3"><div><p className="text-sm font-black text-slate-900">{t.name}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{t.description}</p></div>{value===t.id && <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white"><Check size={14}/></span>}</div>
      </button>)}
    </div>
  </div>
}

function TemplateMini({template}) {
  const accent = template.accent
  return <div className="template-mini-paper">
    <div className="border-b pb-2" style={{borderColor:accent}}><div className="h-2.5 w-24 rounded" style={{background:accent}}/><div className="mt-1.5 h-1.5 w-16 rounded bg-slate-200"/><div className="mt-2 h-1 w-36 max-w-full rounded bg-slate-100"/></div>
    {[0,1,2,3].map(i=><div key={i} className="mt-3"><div className="h-1.5 w-14 rounded" style={{background:accent,opacity:.8}}/><div className="mt-1.5 h-1 w-full rounded bg-slate-100"/><div className="mt-1 h-1 w-11/12 rounded bg-slate-100"/>{i===1 && <div className="mt-1 h-1 w-9/12 rounded bg-slate-100"/>}</div>)}
  </div>
}
