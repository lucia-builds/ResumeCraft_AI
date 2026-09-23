import { v4 as uuid } from 'uuid'
import axios from 'axios'
import { emptyResume } from '../data'

const KEY = 'resumecraft-resumes-v1'
const USER_KEY = 'resumecraft-user-v1'

const now = () => new Date().toISOString()

export const getResumes = () => JSON.parse(localStorage.getItem(KEY) || '[]')
export const saveResumes = (resumes) => localStorage.setItem(KEY, JSON.stringify(resumes))
export const getResume = (id) => getResumes().find((r) => r.id === id)
export const createResume = (title = 'Untitled Resume') => {
  const resume = { ...emptyResume(), id: uuid(), title, createdAt: now(), updatedAt: now() }
  const resumes = [resume, ...getResumes()]
  saveResumes(resumes)
  return resume
}
export const saveResume = (resume) => {
  const next = { ...resume, updatedAt: now() }
  saveResumes(getResumes().map((r) => r.id === next.id ? next : r))
  return next
}
export const deleteResume = (id) => saveResumes(getResumes().filter((r) => r.id !== id))

export const setDemoUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const getDemoUser = () => JSON.parse(localStorage.getItem(USER_KEY) || 'null')
export const logoutDemoUser = () => localStorage.removeItem(USER_KEY)

const strapiUrl = import.meta.env.VITE_STRAPI_URL
const strapiKey = import.meta.env.VITE_STRAPI_API_KEY
const cloudReady = Boolean(strapiUrl && strapiKey)

export const backend = {
  cloudReady,
  async list(ownerEmail) {
    if (!cloudReady) return getResumes()
    const { data } = await axios.get(`${strapiUrl}/resumes`, {
      params: { 'filters[email][$eq]': ownerEmail, populate: '*' },
      headers: { Authorization: `Bearer ${strapiKey}` },
    })
    return data?.data || []
  },
}
