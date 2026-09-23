import React from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import { getResume } from '../services/storage'

export default function ResumeView(){ const {id}=useParams(); const navigate=useNavigate(); const resume=getResume(id); if(!resume) return <div className="grid min-h-screen place-items-center"><div className="text-center"><h1 className="text-xl font-bold">Resume unavailable</h1><button onClick={()=>navigate('/')} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">Go home</button></div></div>; return <div className="min-h-screen bg-slate-100 py-6"><div className="no-print mx-auto mb-5 flex max-w-[850px] justify-between px-4"><button onClick={()=>navigate('/dashboard')} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"><ArrowLeft size={15}/> Back</button><button onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"><Download size={15}/> Download PDF</button></div><div className="overflow-auto px-4"><ResumePreview resume={resume}/></div></div> }
