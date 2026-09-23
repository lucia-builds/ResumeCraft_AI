import React from 'react'
import { ArrowRight, BriefcaseBusiness, Check, FileText, MessageCircle, Mic, ScanSearch, Sparkles, WandSparkles } from 'lucide-react'
import ReviewsSection from '../components/ReviewsSection'

const templates = [
  { name: 'Modern', tone: 'blue', lines: ['Software Engineer', 'Experience', 'Projects', 'Skills'] },
  { name: 'Executive', tone: 'ink', lines: ['Product Manager', 'Profile', 'Experience', 'Education'] },
  { name: 'Minimal', tone: 'emerald', lines: ['Frontend Developer', 'Summary', 'Work Experience', 'Technical Skills'] },
  { name: 'Academic', tone: 'violet', lines: ['Research Candidate', 'Education', 'Experience', 'Projects'] },
]

export default function Landing({ onGetStarted, onAts }) {
  return <div className="min-h-screen overflow-hidden bg-white text-slate-950">
    <main>
      <section className="hero-shell">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.03fr_.97fr] lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="eyebrow"><Sparkles size={14}/> AI-powered resume workspace</div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">Create a resume that is <span className="text-blue-600">ready for the job.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">Build from scratch or upload an existing resume. Tailor it to a specific job description, identify missing keywords, and improve your resume with practical guidance.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onGetStarted} className="primary-btn"><span>Create my resume</span><ArrowRight size={17}/></button>
              <button onClick={onAts} className="secondary-btn"><ScanSearch size={17}/> Upload & check ATS</button>
            </div>
            <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              {['Live A4 preview','Job-description matching','Voice editing'].map(x=><div key={x} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={12}/></span>{x}</div>)}
            </div>
          </div>
          <div className="relative z-10">
            <div className="hero-preview-wrap">
              <div className="hero-floating-card hero-floating-top"><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-slate-500"><WandSparkles size={13}/> Resume score</div><div className="mt-1 text-2xl font-black text-slate-950">87<span className="text-sm text-slate-400">/100</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full w-[87%] rounded-full bg-blue-600"/></div></div>
              <div className="mock-resume-large">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div><div className="h-3 w-40 rounded bg-slate-900"/><div className="mt-2 h-2 w-28 rounded bg-slate-200"/><div className="mt-3 text-[10px] text-slate-500">Kolkata • +91 9xxxx • email@example.com</div></div>
                  <div className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">OPEN TO WORK</div>
                </div>
                {[['SUMMARY',4],['EXPERIENCE',5],['PROJECTS',4],['EDUCATION',3]].map(([label,count])=><div key={label} className="mt-5"><div className="text-[9px] font-black tracking-[.2em] text-blue-600">{label}</div>{Array.from({length:count}).map((_,i)=><div key={i} className={`mt-2 h-2 rounded ${i===0?'w-11/12':'w-full'} bg-slate-100`}/>)}</div>)}
                <div className="mt-5"><div className="text-[9px] font-black tracking-[.2em] text-blue-600">SKILLS</div><div className="mt-2 flex flex-wrap gap-1.5">{['React','Node.js','TypeScript','SQL','Git'].map(s=><span key={s} className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-700">{s}</span>)}</div></div>
              </div>
              <div className="hero-floating-card hero-floating-bottom"><div className="text-[11px] font-bold text-slate-500">Target role</div><div className="mt-1 text-sm font-black text-slate-950">Software Engineer</div><div className="mt-3 flex flex-wrap gap-1.5"><span className="pill pill-green">React ✓</span><span className="pill pill-green">REST APIs ✓</span><span className="pill pill-amber">TypeScript •</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 text-xs font-bold uppercase tracking-[.16em] text-slate-400 sm:justify-between">
          <span>Simple to build</span><span>Easy to edit</span><span>Job-specific</span><span>ATS-aware</span><span>PDF ready</span>
        </div>
      </section>

      <section className="section-space bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-5">
          <div className="section-heading"><div><p className="section-kicker">One clean workflow</p><h2>Everything you need to prepare one strong application.</h2></div><p>Keep the UI simple. Keep the decisions clear. Move from editing to job matching without losing your resume context.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            <FeatureCard number="01" icon={<FileText/>} title="Build or upload" text="Start from scratch or upload a PDF/DOCX and edit the extracted content." />
            <FeatureCard number="02" icon={<Mic/>} title="Edit by voice" text="Dictate into resume fields with the Speak control when typing feels slow." />
            <FeatureCard number="03" icon={<ScanSearch/>} title="Match the job" text="Compare a resume with the exact job description to find alignment gaps." />
            <FeatureCard number="04" icon={<MessageCircle/>} title="Get guided help" text="Use the built-in Resume Guide for onboarding and quick questions." />
            <FeatureCard number="05" icon={<BriefcaseBusiness/>} title="Find matching jobs" text="Search job listings against your resume and keep an application pipeline." />
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="section-heading"><div><p className="section-kicker">Templates</p><h2>A small set of professional starting points.</h2></div><button onClick={onGetStarted} className="text-sm font-bold text-blue-600 hover:text-blue-700">Browse in builder <ArrowRight size={15} className="ml-1 inline"/></button></div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {templates.map(t=><TemplateCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="section-space bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.22em] text-blue-300">ATS resume fixer</p><h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Know what the job description is asking for.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Upload your resume, paste the job description, and see matched terms, missing terms, section checks, and a clear path toward stronger alignment.</p><button onClick={onAts} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100"><ScanSearch size={17}/> Open ATS checker</button></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Keyword match','Section detection','Contact checks','Impact signals','Action verbs','Formatting signals'].map((x,i)=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.05] p-5"><div className="text-2xl font-black text-white">0{i+1}</div><div className="mt-5 text-sm font-bold text-slate-100">{x}</div><div className="mt-2 text-xs leading-5 text-slate-400">Clear, explainable checks instead of opaque scoring.</div></div>)}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-center md:items-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-blue-100">Ready when you are</p><h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Build once. Tailor it for every role.</h2><p className="max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">Create your base resume, then use the ATS workspace to adapt it to a specific opportunity.</p><div className="flex flex-wrap justify-center gap-3"><button onClick={onGetStarted} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Create a resume</button><button onClick={onAts} className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15">Check ATS score</button></div></div>
      </section>
    </main>
    <footer className="border-t border-slate-200 bg-white py-7"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left"><div className="font-bold text-slate-800">ResumeCraftAI</div><div>Build, tailor, review, download.</div></div></footer>
  </div>
}

function FeatureCard({number, icon, title, text}) { return <div className="soft-card p-7"><div className="flex items-start justify-between"><div className="icon-box">{React.cloneElement(icon,{size:20})}</div><span className="text-xs font-black tracking-[.18em] text-slate-300">{number}</span></div><h3 className="mt-6 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div> }
function TemplateCard({name,tone,lines}) { const accent=tone==='blue'?'#2563eb':tone==='emerald'?'#059669':tone==='violet'?'#7c3aed':'#0f172a'; return <div className="template-card"><div className="template-window"><div className="template-toolbar"><span/><span/><span/></div><div className="template-page"><div className="flex items-start justify-between gap-3"><div><div className="h-2.5 w-24 rounded" style={{background:accent}}/><div className="mt-2 h-2 w-16 rounded bg-slate-200"/></div><div className="h-5 w-5 rounded-full bg-slate-100"/></div>{lines.map((x,i)=><div key={x} className="mt-4"><div className="text-[8px] font-black uppercase tracking-[.18em]" style={{color:accent}}>{x}</div><div className="mt-1.5 h-1.5 w-full rounded bg-slate-100"/><div className="mt-1.5 h-1.5 w-11/12 rounded bg-slate-100"/></div>)}</div></div><div className="p-5"><div className="flex items-center justify-between"><h3 className="font-black">{name}</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">Template</span></div></div></div> }
