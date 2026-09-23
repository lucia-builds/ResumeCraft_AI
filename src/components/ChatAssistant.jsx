import React, { useEffect, useMemo, useState } from 'react'
import { Bot, ChevronDown, HelpCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { askResumeAssistant } from '../services/gemini'

const quickQuestions = [
  'How do I create my first resume?',
  'How does the ATS score work?',
  'How do I edit my resume by voice?',
  'How do I download a PDF?',
]

function localAnswer(question, pathname) {
  const q = question.toLowerCase()
  if (q.includes('voice') || q.includes('speak') || q.includes('microphone')) return 'In the Resume Builder, look for the Speak button beside editable fields. Allow microphone access, speak naturally, and the transcript will be added to that field.'
  if (q.includes('ats') || q.includes('score') || q.includes('job description')) return 'Open ATS Checker, upload or paste your resume, then paste the exact job description. The checker compares the two and shows matched terms, missing terms, section checks, and an action plan. A higher score means stronger alignment with that job description—not a guarantee of selection.'
  if (q.includes('pdf') || q.includes('download')) return 'Open a resume in the builder and use the PDF button. The browser print dialog lets you choose Save as PDF.'
  if (q.includes('create') || q.includes('first') || q.includes('resume')) return 'Start from the dashboard with Create Resume, fill the sections, and use the live A4 preview on the right to review changes as you type.'
  if (pathname.includes('ats-checker')) return 'You are in the ATS workspace. Upload your resume first, then paste the target job description. Review missing keywords and the 95+ action plan before editing the resume.'
  if (pathname.includes('/edit')) return 'You are in the Resume Builder. Use the tabs to move through Personal Details, Summary, Experience, Education, and Skills. The preview updates live.'
  if (pathname.includes('dashboard')) return 'From the dashboard you can create resumes, search your resume library, or open the ATS Checker to tailor a resume to a specific job.'
  return 'Welcome! I can guide you through creating a resume, using voice editing, checking ATS alignment, downloading PDFs, and understanding each part of the site.'
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([])
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'

  useEffect(() => {
    const seen = localStorage.getItem('resumecraft_chat_seen')
    if (!seen && pathname === '/') {
      setTimeout(() => setOpen(true), 1000)
      localStorage.setItem('resumecraft_chat_seen', '1')
    }
  }, [pathname])

  useEffect(() => {
    if (!open || messages.length) return
    setMessages([{ role: 'assistant', text: 'Hi! I’m your Resume Guide. Ask me anything about the website, resumes, voice editing, or ATS checks.' }])
  }, [open, messages.length])

  const suggestions = useMemo(() => quickQuestions, [])

  const send = async (question = input) => {
    const text = question.trim()
    if (!text || busy) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setBusy(true)
    try {
      const answer = await askResumeAssistant({ question: text, pathname })
      setMessages(prev => [...prev, { role: 'assistant', text: answer || localAnswer(text, pathname) }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: localAnswer(text, pathname) }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chatbot-shell no-print">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-head">
            <div className="flex items-center gap-3">
              <div className="chatbot-avatar"><Bot size={18}/></div>
              <div>
                <div className="text-sm font-black text-slate-950">Resume Guide</div>
                <div className="text-[10px] font-semibold text-emerald-600">Here to help</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="chatbot-icon-btn" aria-label="Close assistant"><X size={16}/></button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-tip"><Sparkles size={14}/><span>I can explain the site or answer resume questions.</span></div>
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}>
                  {m.text}
                </div>
              ))}
              {busy && <div className="chat-message chat-message-assistant">Thinking…</div>}
            </div>
            {!busy && messages.length < 4 && (
              <div className="chatbot-quick-grid">
                {suggestions.slice(0, 3).map(item => <button key={item} onClick={() => send(item)}>{item}</button>)}
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send() }} className="chatbot-input-row">
            <HelpCircle size={16} className="text-slate-400"/>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question…" />
            <button type="submit" disabled={!input.trim() || busy} className="chatbot-send"><Send size={15}/></button>
          </form>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)} className="chatbot-fab" aria-label="Open resume assistant">
        {open ? <ChevronDown size={19}/> : <MessageCircle size={19}/>}
        <span>{open ? 'Close' : 'Help'}</span>
      </button>
    </div>
  )
}
