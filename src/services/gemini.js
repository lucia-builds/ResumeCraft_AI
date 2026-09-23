import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateSummary({ jobTitle, experience, skills }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) {
    const skillText = skills?.slice(0, 5).map((s) => s.name).join(', ') || 'modern development tools'
    const role = jobTitle || 'Software Engineer'
    return `Motivated ${role} with hands-on experience delivering web applications using ${skillText}. Strong at translating requirements into maintainable interfaces, integrating APIs, and debugging end-to-end user flows. Focused on practical engineering, clear communication, and continuous improvement.`
  }

  const ai = new GoogleGenerativeAI(key)
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = `Write a concise professional resume summary (3-4 sentences) for a candidate targeting ${jobTitle || 'Software Engineer'}. Use only the provided facts. Experience: ${JSON.stringify(experience || [])}. Skills: ${JSON.stringify(skills || [])}. Do not invent employers, dates, achievements, technologies, or metrics.`
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function askResumeAssistant({ question, pathname = '/' }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) {
    const q = question.toLowerCase()
    if (q.includes('voice') || q.includes('speak') || q.includes('microphone')) return 'Use the Speak button beside editable fields in the Resume Builder. Allow microphone access, speak naturally, and the transcript is added to that field.'
    if (q.includes('ats') || q.includes('score') || q.includes('job description')) return 'Open ATS Checker, upload or paste your resume, then paste the exact job description. You will see alignment, matched terms, missing terms, section checks, and a practical action plan. The score is an alignment indicator, not a hiring guarantee.'
    if (q.includes('pdf') || q.includes('download')) return 'Open your resume in the builder and click PDF. In the browser print dialog choose Save as PDF.'
    if (q.includes('create') || q.includes('first') || q.includes('resume')) return 'Start from the dashboard with Create Resume, complete the sections, and use the live A4 preview to review your changes.'
    if (pathname.includes('ats-checker')) return 'You are in the ATS workspace. Upload your resume, paste the target job description, then review missing keywords and the improvement plan.'
    if (pathname.includes('/edit')) return 'You are in the Resume Builder. Use the section tabs, the Speak buttons for voice editing, and the live preview on the right.'
    if (pathname.includes('dashboard')) return 'From the dashboard you can create resumes, search your library, or open the ATS Checker to tailor a resume to a specific role.'
    return 'I can help you understand the site, build or edit a resume, use voice editing, check ATS alignment, or download a PDF. Try asking a specific question.'
  }

  const ai = new GoogleGenerativeAI(key)
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = `You are ResumeCraftAI's friendly onboarding assistant. Answer the user's question clearly and practically in 2-5 short sentences. Help newcomers understand this website and common resume/ATS tasks. Never invent features that are not supported. Do not guarantee a hiring outcome or an exact ATS score. Current page: ${pathname}. User question: ${question}`
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}


export async function generateJobSearchProfile({ resume }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  const fallback = {
    roles: [resume?.personal?.jobTitle || 'Software Engineer'].filter(Boolean),
    keywords: [...new Set((resume?.skills || []).map(s => s.name).filter(Boolean))].slice(0, 12),
  }
  if (!key) return fallback
  const ai = new GoogleGenerativeAI(key)
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = `Analyze this resume for job discovery. Return ONLY valid JSON with keys roles (array of up to 5 realistic job titles) and keywords (array of up to 15 skills/technologies/responsibilities). Use only evidence from the resume. Do not invent qualifications. Resume: ${JSON.stringify(resume)}`
  const result = await model.generateContent(prompt)
  const raw = result.response.text().replace(/```json|```/g, '').trim()
  try {
    const parsed = JSON.parse(raw)
    return { roles: Array.isArray(parsed.roles) ? parsed.roles.slice(0,5) : fallback.roles, keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0,15) : fallback.keywords }
  } catch {
    return fallback
  }
}
