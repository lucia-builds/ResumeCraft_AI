# ResumeCraft AI

ResumeCraft AI is an AI-powered career platform designed to help students and job seekers create, improve, and manage resumes while preparing for job applications.

The platform combines resume building, ATS optimization, job matching, voice-based editing, and career assistance in a single application.
### 🚀 Live Demo

[**Try ResumeCraft AI →**](resume-craft-ai-one-ivory.vercel.app)

## Overview

Creating a resume that is both recruiter-friendly and aligned with a specific job description can be challenging, especially for students and fresh graduates.

ResumeCraft AI addresses this by providing tools to:

- Build professional resumes using ATS-friendly templates
- Improve an existing resume through ATS analysis
- Compare a resume against a specific job description
- Identify missing skills and keywords
- Get actionable suggestions for improving resume content
- Edit resume content using voice input
- Discover relevant job opportunities
- Track job application progress
- Get guidance through an AI-powered career assistant

## Key Features

### AI Resume Builder
- Create and edit resumes through a structured form
- Personal information, summary, education, experience, skills and projects
- Multiple resume templates
- Live resume preview
- Customizable theme colors
- Download resumes as PDF
- Save and manage multiple resumes

### ATS Resume Analyzer
- Upload an existing PDF, DOCX or TXT resume
- Extract and edit resume content before analysis
- Add a target job description
- Generate an ATS alignment score
- Identify matched and missing keywords
- Check important resume sections
- Detect missing contact information
- Analyze action verbs and measurable achievements
- Generate a prioritized improvement plan

The ATS score is an application-level heuristic intended to help users improve keyword and content alignment. It does not guarantee a specific score from an external Applicant Tracking System or employer.

### AI-Assisted Resume Writing
- Generate and improve professional resume summaries
- Get content suggestions based on the selected job context
- Provide more concise and professional wording while preserving the user's actual experience

### Voice Resume Editing
- Edit supported resume fields using voice input
- Browser-based speech recognition
- Useful for quickly entering summaries, experience descriptions and other resume information
- No microphone recording is directly stored by the application

### AI Job Tracker
- Select a resume as the job-search profile
- Find relevant job opportunities based on skills and target roles
- Display resume-to-job matching information
- Search and filter job listings
- Save interesting jobs
- Track application progress

Application statuses include:

`Saved → Applied → Interview → Not Selected → Offer`

The Apply button opens the original job listing so the user can review the complete job description and application process.

### Resume Guide Assistant
A lightweight AI assistant helps new users understand the platform and provides guidance related to:

- Creating a resume
- Using ATS analysis
- Improving resume content
- Using templates
- Using voice editing
- Understanding the job tracker
- Navigating the platform

### Community Reviews
- Display user-submitted ratings and feedback
- Show reported application outcomes
- Provide a section where users can share their experience

Demo review data is clearly separated from real production statistics. Employment outcomes should be verified before being presented as official platform statistics.

## Resume Templates

ResumeCraft AI provides multiple ATS-friendly templates designed for different career stages and application styles:

- ATS Classic
- Modern Clean
- Tech Minimal
- Executive
- Academic
- Entry Level

The templates prioritize:

- Clear section headings
- Readable typography
- Simple layouts
- Consistent spacing
- Text-based content
- ATS-friendly structure

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- JavaScript
- Lucide Icons

### AI
- Google Gemini API
- AI-assisted resume content generation
- AI career assistance

### Resume Processing
- `pdfjs-dist` for PDF text extraction
- `mammoth` for DOCX text extraction
- Browser Web Speech API for voice input

### Data & Services
- LocalStorage for local/demo persistence
- Axios for API communication
- Optional Strapi integration
- Optional Clerk authentication

### Deployment
- Vercel

## Application Flow

```text
Landing Page
     │
     ├── Create Resume
     │      ├── Choose Template
     │      ├── Enter Resume Details
     │      ├── AI Assistance
     │      ├── Voice Editing
     │      └── Download / Share
     │
     ├── ATS Checker
     │      ├── Upload Resume
     │      ├── Add Job Description
     │      ├── Analyze Resume
     │      ├── View ATS Score
     │      └── Improve Missing Areas
     │
     ├── Job Tracker
     │      ├── Select Resume
     │      ├── Find Relevant Jobs
     │      ├── View Match Information
     │      ├── Save Jobs
     │      └── Track Applications
     │
     └── Resume Guide
            └── User Assistance
