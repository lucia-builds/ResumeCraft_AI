import React, { useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { setDemoUser } from '../services/storage'

export default function Auth({ onSignedIn }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const submit = (e) => { e.preventDefault(); const user = { name: name || email.split('@')[0] || 'Demo User', email: email || 'demo@example.com' }; setDemoUser(user); const next = new URLSearchParams(window.location.search).get('next'); onSignedIn(user, next || '/dashboard') }
  return <div className="grid min-h-screen place-items-center bg-slate-50 px-5"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"><div className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white"><FileText size={18}/></span>ResumeCraft<span className="text-blue-600">AI</span></div><h1 className="mt-8 text-2xl font-bold">Welcome back</h1><p className="mt-2 text-sm text-slate-600">This local mode mirrors the tutorial’s signed-in flow. Add Clerk credentials to switch to real authentication.</p><form onSubmit={submit} className="mt-6 space-y-4"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"/><button className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800">Continue</button></form><button onClick={()=>history.back()} className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={15}/> Back</button></div></div>
}
