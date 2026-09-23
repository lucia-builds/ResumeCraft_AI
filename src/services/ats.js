const STOP_WORDS = new Set(`a an and are as at be been being by can could did do does doing for from had has have he her here hers him his how i if in into is it its itself me more most my no not of on or our ours she should so some than that the their theirs them themselves then there these they this those to was we were what when where which who why will with would you your yours able about across after again against all also am any because before between both but during each few further get got getting just many may might must other own same such only over per very while within through using use used`.split(' '))
const SECTION_ALIASES = {
  summary: ['summary', 'professional summary', 'profile', 'objective', 'career objective'],
  experience: ['experience', 'work experience', 'professional experience', 'employment history', 'work history'],
  education: ['education', 'academic background', 'qualifications'],
  skills: ['skills', 'technical skills', 'core skills', 'competencies'],
  projects: ['projects', 'personal projects', 'academic projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
}
const ACTION_VERBS = new Set(`built developed implemented designed created optimized optimised automated improved integrated deployed tested led delivered engineered analyzed analysed resolved debugged collaborated migrated refactored maintained architected configured`.split(' '))

function clean(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9+#./ -]/g, ' ').replace(/\s+/g, ' ').trim()
}
function words(text) {
  return clean(text).split(' ').filter(Boolean).filter(w => !STOP_WORDS.has(w) && w.length > 2)
}
function stem(w) {
  return w.replace(/(ing|ed|es|s)$/,'').replace(/ies$/,'y')
}
function keywordCandidates(jd) {
  const list = words(jd)
  const freq = new Map()
  list.forEach(w => freq.set(w, (freq.get(w) || 0) + 1))
  return [...freq.entries()]
    .filter(([w,c]) => c >= 1 && (w.length >= 4 || w.includes('#') || w.includes('+') || w.includes('.')))
    .sort((a,b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 35)
    .map(([w]) => w)
}
function hasAny(text, variants) {
  const t = clean(text)
  return variants.some(v => t.includes(v))
}
function detectSections(text) {
  const normalized = clean(text)
  return Object.fromEntries(Object.entries(SECTION_ALIASES).map(([key, aliases]) => [key, hasAny(normalized, aliases)]))
}
function countMetrics(text) {
  return (text.match(/\b\d+(?:\.\d+)?(?:%|\+|x|k|m|b)?\b/gi) || []).length
}
function countBullets(text) {
  return (text.match(/(^|\n)\s*(?:[-•*]|\d+[.)])\s+/g) || []).length
}
function countActionVerbs(text) {
  const ws = words(text)
  return ws.filter(w => ACTION_VERBS.has(stem(w))).length
}
function contactChecks(text) {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)
  const phone = /(?:\+?\d[\d\s().-]{8,}\d)/.test(text)
  const linkedin = /linkedin\.com/i.test(text)
  const location = /\b(kolkata|delhi|mumbai|bengaluru|bangalore|hyderabad|pune|remote|india|usa|uk|canada|new york|california)\b/i.test(text)
  return { email, phone, linkedin, location }
}
function formattingSignals(text) {
  const sectionMatch = detectSections(text)
  const headers = Object.values(sectionMatch).filter(Boolean).length
  const lines = text.split(/\n+/).map(x => x.trim()).filter(Boolean)
  const longLines = lines.filter(l => l.length > 180).length
  const allCapsLines = lines.filter(l => /^[A-Z\s&/-]{5,}$/.test(l)).length
  const urls = (text.match(/https?:\/\/[^\s]+/gi) || []).length
  return { headers, longLines, allCapsLines, urls, lineCount: lines.length }
}
export function analyzeATS(resumeText, jobDescription) {
  const resume = resumeText || ''
  const jd = jobDescription || ''
  const keywords = keywordCandidates(jd)
  const normalizedResume = clean(resume)
  const matched = keywords.filter(k => normalizedResume.includes(k) || normalizedResume.includes(k.replace(/\./g,'')))
  const missing = keywords.filter(k => !matched.includes(k))
  const sections = detectSections(resume)
  const contacts = contactChecks(resume)
  const metrics = countMetrics(resume)
  const bullets = countBullets(resume)
  const verbs = countActionVerbs(resume)
  const format = formattingSignals(resume)
  const keywordScore = keywords.length ? Math.round((matched.length / keywords.length) * 45) : 0
  const sectionScore = Math.round((Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 20)
  const contactScore = Math.round(((contacts.email ? 1 : 0) + (contacts.phone ? 1 : 0) + (contacts.linkedin ? 1 : 0)) / 3 * 10)
  const impactScore = Math.min(15, (metrics >= 3 ? 7 : metrics * 2) + (bullets >= 4 ? 4 : bullets) + (verbs >= 4 ? 4 : verbs))
  const formattingScore = Math.max(0, Math.min(10, 10 - format.longLines * 2 - Math.max(0, format.urls - 2)))
  const score = Math.max(0, Math.min(100, keywordScore + sectionScore + contactScore + impactScore + formattingScore))

  const recommendations = []
  if (missing.length) recommendations.push({ type:'keywords', title:'Add missing job-description keywords', text:`Your resume is missing ${missing.slice(0, 8).join(', ')}. Add only the terms that accurately describe skills, tools, responsibilities, or qualifications you actually have.` })
  if (!sections.summary) recommendations.push({ type:'section', title:'Add a clear Summary section', text:'Use a standard heading such as Professional Summary or Summary so resume parsers can identify the section reliably.' })
  if (!sections.experience) recommendations.push({ type:'section', title:'Use a standard Experience heading', text:'Label employment history as Experience or Work Experience.' })
  if (!sections.skills) recommendations.push({ type:'section', title:'Add a Technical Skills section', text:'List tools and technologies as plain text rather than relying on graphics, progress bars, or icons.' })
  if (!contacts.email || !contacts.phone) recommendations.push({ type:'contact', title:'Complete contact details', text:`${!contacts.email ? 'Add a professional email. ' : ''}${!contacts.phone ? 'Add a phone number. ' : ''}Keep contact information as selectable text.` })
  if (metrics < 3) recommendations.push({ type:'impact', title:'Quantify measurable impact', text:'Where truthful, add numbers such as users, latency, conversion, revenue, accuracy, cost, response time, or completion rate to demonstrate outcomes.' })
  if (verbs < 4) recommendations.push({ type:'impact', title:'Strengthen bullet openings', text:'Start achievement bullets with specific action verbs such as built, implemented, automated, optimized, integrated, tested, or delivered.' })
  if (format.longLines > 2) recommendations.push({ type:'format', title:'Break up long paragraphs', text:'Convert dense blocks into concise bullets. This improves scanability and makes individual achievements easier for parsers to associate with sections.' })
  recommendations.push({ type:'target', title:'How to work toward a 95+ score', text:'Prioritize relevant missing keywords, standard section headings, complete contact information, quantified achievements, and simple single-column formatting. A 95 score is a heuristic target, not a guarantee of passing every employer\'s ATS.' })

  return { score, keywords, matched, missing, sections, contacts, metrics, bullets, verbs, format, recommendations }
}
