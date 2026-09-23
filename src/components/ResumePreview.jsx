import React from 'react'

function html(value) { return { __html: value || '' } }

const config = {
  'ats-classic': { title:'ATS Classic', accentMode:'black', educationFirst:false, compact:false },
  'modern-clean': { title:'Modern Clean', accentMode:'theme', educationFirst:false, compact:false },
  'tech-minimal': { title:'Tech Minimal', accentMode:'teal', educationFirst:false, compact:true },
  executive: { title:'Executive', accentMode:'ink', educationFirst:false, compact:false },
  academic: { title:'Academic', accentMode:'purple', educationFirst:true, compact:false },
  'entry-level': { title:'Entry Level', accentMode:'blue', educationFirst:false, compact:true },
}

export default function ResumePreview({ resume, className = '' }) {
  const p = resume.personal || {}
  const mode = config[resume.templateId] || config['ats-classic']
  const accent = mode.accentMode === 'theme' ? resume.theme : mode.accentMode === 'teal' ? '#0f766e' : mode.accentMode === 'purple' ? '#6d28d9' : '#0f172a'
  const sections = {
    summary: resume.summary && <section><SectionTitle theme={accent}>SUMMARY</SectionTitle><p className="mt-2 text-[12.5px] leading-5 text-slate-700">{resume.summary}</p></section>,
    experience: resume.experience?.length > 0 && <section><SectionTitle theme={accent}>EXPERIENCE</SectionTitle><div className="mt-2 space-y-4">{resume.experience.map((e) => <div key={e.id}>
      <div className="flex items-baseline justify-between gap-4"><div className="min-w-0"><h3 className="font-semibold text-slate-900">{e.position || 'Role'}</h3><p className="text-xs font-medium" style={{ color: accent }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p></div><span className="whitespace-nowrap text-[10.5px] text-slate-500">{e.startDate} — {e.endDate || 'Present'}</span></div>
      {e.description && <div className="prose prose-sm mt-1 max-w-none text-[12px] leading-5 text-slate-700" dangerouslySetInnerHTML={html(e.description.includes('<') ? e.description : `<ul>${e.description.split('\n').filter(Boolean).map(x=>`<li>${x}</li>`).join('')}</ul>`)} />}
    </div>)}</div></section>,
    education: resume.education?.length > 0 && <section><SectionTitle theme={accent}>EDUCATION</SectionTitle><div className="mt-2 space-y-3">{resume.education.map((e) => <div key={e.id} className="flex items-baseline justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{e.degree || 'Degree'}</h3><p className="text-xs font-medium" style={{ color: accent }}>{e.school}{e.location ? ` • ${e.location}` : ''}</p>{e.grade && <p className="text-[10.5px] text-slate-500">{e.grade}</p>}</div><span className="whitespace-nowrap text-[10.5px] text-slate-500">{e.startDate} — {e.endDate}</span></div>)}</div></section>,
    projects: resume.projects?.length > 0 && <section><SectionTitle theme={accent}>PROJECTS</SectionTitle><div className="mt-2 space-y-3">{resume.projects.map((pr)=><div key={pr.id}><h3 className="font-semibold text-slate-900">{pr.name}</h3><p className="mt-1 text-[12px] leading-5 text-slate-700">{pr.description}</p></div>)}</div></section>,
    skills: resume.skills?.length > 0 && <section><SectionTitle theme={accent}>SKILLS</SectionTitle><div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">{resume.skills.map(s => <span key={s.id} className="text-[11px] font-semibold text-slate-700">{s.name}{s.id!==resume.skills?.at(-1)?.id ? ' •' : ''}</span>)}</div></section>,
  }
  const ordered = mode.educationFirst ? [sections.education, sections.summary, sections.experience, sections.projects, sections.skills] : [sections.summary, sections.experience, sections.projects, sections.education, sections.skills]
  return <div className={`print-area mx-auto min-h-[1123px] w-[794px] max-w-full bg-white shadow-xl ${mode.compact ? 'p-10' : 'p-12'} ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
    <div className={`${mode.accentMode === 'black' ? 'border-b' : 'border-b-2'} pb-4`} style={{ borderColor: accent }}>
      <h1 className={`${mode.accentMode === 'ink' ? 'font-serif' : ''} text-3xl font-black tracking-tight text-slate-900`}>{[p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name'}</h1>
      <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>{p.jobTitle || 'Professional Title'}</p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-600">{p.address && <span>{p.address}</span>}{p.phone && <span>{p.phone}</span>}{p.email && <span>{p.email}</span>}{p.linkedin && <span>{p.linkedin}</span>}{p.website && <span>{p.website}</span>}</div>
    </div>
    <div className={`${mode.compact ? 'mt-5 space-y-5' : 'mt-6 space-y-6'}`}>{ordered.filter(Boolean)}</div>
  </div>
}
function SectionTitle({ children, theme }) { return <h2 className="text-[10px] font-black tracking-[0.22em]" style={{ color: theme }}>{children}</h2> }
