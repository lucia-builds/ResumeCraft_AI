const STOP = new Set(`a an and are as at be been being by can could did do does doing for from had has have he her here hers him his how i if in into is it its itself me more most my no not of on or our ours she should so some than that the their theirs them themselves then there these they this those to was we were what when where which who why will with would you your yours able about after again against all also am any because before between both but during each few further get got getting just many may might must other own same such only over per very while within through using use used`.split(' '))

const FALLBACK_JOBS = [
  { id:'demo-1', title:'Frontend Developer', company:'TechNova Labs', location:'Kolkata / Remote', remote:true, type:'Full-time', level:'Entry Level', tags:['React','JavaScript','REST API','Git'], description:'Build responsive React applications, integrate REST APIs, collaborate with designers and maintain reusable UI components.', url:'https://www.linkedin.com/jobs/search/?keywords=frontend%20developer&location=Kolkata' },
  { id:'demo-2', title:'Software Engineer Intern', company:'CloudSprint', location:'Remote - India', remote:true, type:'Internship', level:'Internship', tags:['Python','SQL','Git','APIs'], description:'Work with engineers on production features, write maintainable code, test APIs and debug application issues.', url:'https://www.linkedin.com/jobs/search/?keywords=software%20engineer%20intern&location=India' },
  { id:'demo-3', title:'Full Stack Developer', company:'DataForge', location:'Bengaluru / Remote', remote:true, type:'Full-time', level:'Entry Level', tags:['React','Node.js','MongoDB','JavaScript'], description:'Develop frontend and backend features, integrate APIs, work with MongoDB and improve product reliability.', url:'https://www.linkedin.com/jobs/search/?keywords=full%20stack%20developer&location=India' },
  { id:'demo-4', title:'Junior Backend Developer', company:'Northstar Systems', location:'Remote', remote:true, type:'Full-time', level:'Entry Level', tags:['Node.js','Express','MongoDB','REST API'], description:'Build backend services, develop REST endpoints, debug production issues and collaborate across engineering teams.', url:'https://www.linkedin.com/jobs/search/?keywords=junior%20backend%20developer&location=India' },
  { id:'demo-5', title:'Data Analyst Intern', company:'BrightMetric', location:'Hyderabad / Remote', remote:true, type:'Internship', level:'Internship', tags:['Python','SQL','Excel','Pandas'], description:'Prepare datasets, build dashboards, analyze business data and communicate findings using clear metrics.', url:'https://www.linkedin.com/jobs/search/?keywords=data%20analyst%20intern&location=India' },
  { id:'demo-6', title:'Graduate Software Developer', company:'VertexWorks', location:'Pune', remote:false, type:'Full-time', level:'Entry Level', tags:['Java','SQL','Git','DSA'], description:'Join a graduate engineering team building software services, writing tests and solving application problems.', url:'https://www.linkedin.com/jobs/search/?keywords=graduate%20software%20developer&location=Pune' },
]

function normalizeJob(job, source='Arbeitnow') {
  const title = job.title || 'Untitled role'
  return {
    id: `${source}-${job.slug || job.id || title}-${job.company_name || job.company || ''}`,
    title,
    company: job.company_name || job.company?.name || job.company || 'Company',
    location: job.location || (job.remote ? 'Remote' : 'Location not specified'),
    remote: Boolean(job.remote) || /remote/i.test(job.location || ''),
    type: job.job_types?.[0] || job.type || 'Full-time',
    level: job.experience || job.level || 'Not specified',
    tags: Array.isArray(job.tags) ? job.tags.slice(0, 12) : [],
    description: (job.description || job.job_description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ').trim(),
    url: job.url || job.application_url || '#',
    date: job.date || job.created_at || '',
    source,
  }
}

function words(text) { return (text || '').toLowerCase().replace(/[^a-z0-9+#./ -]/g,' ').split(/\s+/).filter(Boolean).filter(w => !STOP.has(w) && w.length > 2) }

export function buildResumeProfile(resume) {
  const p = resume?.personal || {}
  const skills = (resume?.skills || []).map(s=>s.name).filter(Boolean)
  const exp = (resume?.experience || []).flatMap(e=>[e.position,e.description]).filter(Boolean)
  const projects = (resume?.projects || []).flatMap(p=>[p.name,p.description]).filter(Boolean)
  return {
    role: p.jobTitle || '',
    keywords: [...new Set(words([p.jobTitle, ...skills, ...exp, ...projects].join(' ')))],
    skills,
  }
}

export function matchJob(job, resume) {
  const profile = buildResumeProfile(resume)
  const jobText = `${job.title} ${job.company} ${(job.tags||[]).join(' ')} ${job.description||''}`.toLowerCase()
  const exact = profile.keywords.filter(k => jobText.includes(k))
  const unique = [...new Set(exact)]
  const titleHit = profile.role && jobText.includes(profile.role.toLowerCase().trim())
  const score = Math.max(0, Math.min(100, Math.round((unique.length / Math.max(6, profile.keywords.length)) * 70) + (titleHit ? 20 : 0) + (job.remote ? 5 : 0) + Math.min(5, profile.skills.length)))
  return { ...job, matchScore: score, matchedKeywords: unique.slice(0, 8) }
}

export async function searchJobs({ resume, query='', location='', remoteOnly=false }) {
  const profile = buildResumeProfile(resume)
  const q = query.trim() || profile.role || profile.skills.slice(0,3).join(' ')
  try {
    const url = new URL('https://arbeitnow.com/api/job-board-api')
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error(`Jobs API returned ${response.status}`)
    const data = await response.json()
    const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
    let jobs = list.map(j=>normalizeJob(j,'Arbeitnow'))
    const terms = words([q, location].join(' '))
    jobs = jobs.filter(job => {
      const hay = `${job.title} ${job.company} ${job.location} ${(job.tags||[]).join(' ')}`.toLowerCase()
      const queryHit = !terms.length || terms.some(t => hay.includes(t))
      const locHit = !location || hay.includes(location.toLowerCase()) || (remoteOnly && job.remote)
      return queryHit && locHit && (!remoteOnly || job.remote)
    })
    jobs = jobs.map(j=>matchJob(j,resume)).sort((a,b)=>b.matchScore-a.matchScore).slice(0,30)
    if (jobs.length) return { jobs, source: 'Arbeitnow', live: true }
    throw new Error('No matching live jobs')
  } catch {
    let jobs = FALLBACK_JOBS.filter(j=>{
      const hay = `${j.title} ${j.company} ${j.location} ${j.tags.join(' ')}`.toLowerCase()
      const terms = words([q, location].join(' '))
      return (!terms.length || terms.some(t=>hay.includes(t))) && (!remoteOnly || j.remote)
    }).map(j=>matchJob(j,resume)).sort((a,b)=>b.matchScore-a.matchScore)
    if (!jobs.length) jobs = FALLBACK_JOBS.map(j=>matchJob(j,resume)).sort((a,b)=>b.matchScore-a.matchScore)
    return { jobs, source: 'Demo jobs', live: false }
  }
}
