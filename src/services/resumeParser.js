import mammoth from 'mammoth/mammoth.browser'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractResumeText(file) {
  if (!file) throw new Error('Please choose a resume file.')
  const ext = file.name.toLowerCase().split('.').pop()
  if (ext === 'txt') return (await file.text()).trim()
  if (ext === 'docx') return extractDocx(file)
  if (ext === 'pdf') return extractPdf(file)
  throw new Error('Supported formats: PDF, DOCX, or TXT.')
}

async function extractDocx(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

async function extractPdf(file) {
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map(item => item.str || '').join(' '))
  }
  return pages.join('\n\n').replace(/[ \t]+/g, ' ').trim()
}
