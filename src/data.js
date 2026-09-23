export const resumeTemplates = [
  { id: 'ats-classic', name: 'ATS Classic', category: 'ATS', description: 'Single-column, text-first format for maximum parsing clarity.', accent: '#0f172a' },
  { id: 'modern-clean', name: 'Modern Clean', category: 'ATS', description: 'Clean contemporary layout with restrained accent color.', accent: '#2563eb' },
  { id: 'tech-minimal', name: 'Tech Minimal', category: 'Tech', description: 'Compact technical layout for software and data roles.', accent: '#0f766e' },
  { id: 'executive', name: 'Executive', category: 'Professional', description: 'Polished, conservative structure for experienced professionals.', accent: '#334155' },
  { id: 'academic', name: 'Academic', category: 'Academic', description: 'Education-forward format with strong chronology.', accent: '#7c3aed' },
  { id: 'entry-level', name: 'Entry Level', category: 'Student', description: 'Balanced format for students, interns and early-career candidates.', accent: '#1d4ed8' },
]

export const emptyResume = () => ({
  id: '',
  title: 'My Resume',
  theme: '#2563eb',
  templateId: 'ats-classic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    firstName: '', lastName: '', jobTitle: '', address: '', phone: '', email: '', linkedin: '', website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
})

export const demoResume = () => ({
  ...emptyResume(),
  title: 'Software Engineer Resume',
  templateId: 'tech-minimal',
  personal: {
    firstName: 'Anwesha', lastName: 'Sural', jobTitle: 'Full-Stack Developer', address: 'Kolkata, West Bengal',
    phone: '+91 90000 00000', email: 'anweshasural04@gmail.com', linkedin: 'linkedin.com/in/anweshasural', website: 'github.com/anweshasural'
  },
  summary: 'Computer Science undergraduate with hands-on experience building responsive web applications with React, Node.js and Python. Comfortable with REST APIs, databases and AI integrations, with a focus on clean UI and reliable functionality.',
  experience: [
    { id: 'exp-1', position: 'Web Development Intern', company: 'Pinnacle Lab', location: 'Kolkata', startDate: 'Jul 2025', endDate: 'Aug 2025', description: '<ul><li>Built responsive React interfaces and connected frontend flows with Node.js APIs.</li><li>Worked with MongoDB data and reusable UI components to speed up development.</li></ul>' },
  ],
  education: [
    { id: 'edu-1', degree: 'B.Tech in Computer Science Engineering', school: 'Netaji Subhash Engineering College', location: 'Kolkata', startDate: '2023', endDate: '2027', grade: '8.67 CGPA' },
  ],
  skills: [
    { id: 'sk-1', name: 'React.js', level: 4 }, { id: 'sk-2', name: 'JavaScript', level: 4 }, { id: 'sk-3', name: 'Node.js', level: 3 },
    { id: 'sk-4', name: 'MongoDB', level: 3 }, { id: 'sk-5', name: 'Python', level: 3 }, { id: 'sk-6', name: 'SQL', level: 3 },
  ],
  projects: [
    { id: 'pr-1', name: 'Career Compass', description: 'Built a responsive career guidance platform with React and multi-step assessment flows.' },
  ],
})
