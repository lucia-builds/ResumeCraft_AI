# ResumeCraft AI — AI Resume Builder

A from-scratch implementation of the feature flow in the TubeGuruji tutorial **“Build & Deploy AI Resume Builder App Using React, Vite, Tailwind CSS, Strapi, Clerk”**.

Tutorial reference: https://youtu.be/RiUh_8VTGYM

## Implemented flow

- Landing page
- Authentication entry (local/demo mode; Clerk-ready configuration)
- Dashboard and resume list
- Create / edit / delete resumes
- Personal details
- Professional summary
- Gemini-assisted summary generation with a local fallback when no API key exists
- Multiple experience entries
- Multiple education entries
- Skills with proficiency levels
- Live A4 resume preview
- Theme color selection
- Print / browser “Save as PDF” export
- Shareable resume route
- LocalStorage persistence
- Optional Strapi / Axios service hook

The original tutorial uses React/Vite, Tailwind CSS, Clerk, Strapi and Gemini, and covers the same core CRUD, preview, AI, download/share, theme and deployment sequence. See the tutorial chapter list in the video description. citeturn457154youtube23turn457154search5

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173.

### Demo mode
No API keys are required. The app uses LocalStorage for auth/session and resume data, and uses a deterministic AI-summary fallback.

### Enable Gemini
Set:

```env
VITE_GEMINI_API_KEY=your_key
```

### Enable the Strapi hook
Set:

```env
VITE_STRAPI_URL=http://localhost:1337/api
VITE_STRAPI_API_KEY=your_token
```

You can then wire `src/services/storage.js` to your Strapi collection. The frontend is intentionally usable without the cloud backend so you can build/test the product first.

### Enable Clerk
Set `VITE_CLERK_PUBLISHABLE_KEY` and replace the demo `Auth` flow with the Clerk provider/components from `@clerk/clerk-react`. The dependency is already included.

## Tutorial-to-project mapping

- 00:06:52 Project Setup → Vite + React project scaffold
- 00:20:05 React Routing → React Router pages
- 00:30:06 Authentication → `/auth` entry + Clerk-ready setup
- 00:41:01 Header → `Header.jsx`
- 00:48:10 Strapi Backend Setup → backend service abstraction in `services/storage.js`
- 01:03:05 Create New Resume → dashboard create flow
- 01:32:56 Dynamic Route & Resume List → `/dashboard/resume/:id/edit`
- 01:52:21 Resume Preview Section → `ResumePreview.jsx`
- 02:22:03 Personal Detail → builder tab 1
- 02:53:06 Summary → builder tab 2
- 03:04:40 Generate Summary with AI → Gemini service
- 03:19:30 Experience → builder tab 3
- 03:55:26 Education → builder tab 4
- 04:12:45 Skills → builder tab 5
- 04:28:17 Edit Resume → live state + LocalStorage persistence
- 04:47:38 Download & Share Resume → print-to-PDF + copied view URL
- 05:08:03 Delete Resume → dashboard CRUD
- 05:19:07 Theme Color → theme selector
- 05:28:27 Deploy Strapi on Cloud / 05:36:01 Deploy App → deployment notes above; choose your hosting provider and add environment variables there.

## Notes

The source/tutorial repository is MIT licensed, but this implementation is written independently around the tutorial’s public feature flow. The tutorial is from June 17, 2024. citeturn457154youtube23

## New: Upload + ATS Resume Fixer

Open **Upload & ATS Check** from the dashboard. The checker accepts **PDF, DOCX, or TXT**, extracts selectable text in the browser, and lets the user edit the extracted text before analysis. Paste the exact target job description to get:

- a 0–100 ATS alignment score (heuristic)
- matched and missing job-description keywords
- section/contact/formatting checks
- measurable-impact and action-verb checks
- a prioritized list of changes to work toward a 95+ target

The tool deliberately does **not** invent qualifications, experience, technologies, or metrics. A 95 score is a target within this analyzer, not a guarantee of a specific employer ATS result.

### Upload dependencies

PDF extraction uses `pdfjs-dist`; DOCX extraction uses `mammoth`. Run `npm install` after extracting the updated project.

## UI refresh
The landing page, workspace dashboard, and ATS checker now use a simple professional SaaS-style interface inspired by the uploaded reference video: clean white surfaces, restrained blue accents, soft cards, clear hierarchy, template previews, and a dedicated ATS optimization flow. The layout is intentionally original rather than a copy of the reference.


## New UI + assistant features
- **Voice editing:** browser speech recognition adds spoken text into supported resume fields. Works best in Chromium-based browsers with microphone permission enabled.
- **Resume Guide:** a floating help assistant explains the site, onboarding, ATS workflow, voice editing, and PDF export. With `VITE_GEMINI_API_KEY`, it can answer broader questions using Gemini; otherwise it uses built-in help responses.
- **UI refresh:** more polished SaaS cards, builder panels, status pills, subtle glass effects, and clearer visual hierarchy.

### Voice editing note
The voice feature uses the browser Web Speech API. The app does not upload microphone audio; speech recognition is handled by the browser's speech-recognition implementation. Browser support and language behavior can vary.


## Job Tracker
The Job Tracker matches a selected resume to job listings using an explainable resume-aware heuristic. It can query the keyless Arbeitnow public job-board API and falls back to demo listings when the remote API is unavailable. Apply/View Job opens the original listing URL. The app also stores Saved/Applied/Interview/Not selected/Offer status locally. For production, review the provider's current API terms and consider a server-side integration for rate limiting, caching, and security.

## Template System
Six ATS-first templates are included: ATS Classic, Modern Clean, Tech Minimal, Executive, Academic, and Entry Level. They use straightforward text structure and avoid decorative resume-only graphics. The template gallery is inspired by common ATS-friendly resume conventions; it is not a copy of Enhancv or another vendor's proprietary designs.

## Community Reviews & Outcomes

The latest UI includes a community feedback section on the landing page and dashboard. It displays user-submitted ratings and reported outcomes (interview/offer). Local/demo mode starts with clearly labeled example reviews. For a production product, connect these records to a backend and verify employment outcomes before marketing them as platform statistics.

Reviews are stored in localStorage in demo mode under `resumecraft-reviews-v1`.
