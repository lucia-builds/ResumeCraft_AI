const KEY = 'resumecraft-reviews-v1'

export const seedReviews = [
  {
    id: 'demo-review-1',
    name: 'Aarav M.',
    role: 'Frontend Developer',
    rating: 5,
    outcome: 'interview',
    text: 'The job matching and missing-keyword view made it much easier to tailor my resume before applying.',
    verified: false,
    demo: true,
  },
  {
    id: 'demo-review-2',
    name: 'Priya S.',
    role: 'Business Analyst',
    rating: 4,
    outcome: 'offer',
    text: 'I liked having the resume builder and application tracker in one workspace. The workflow felt simple.',
    verified: false,
    demo: true,
  },
  {
    id: 'demo-review-3',
    name: 'Rohan K.',
    role: 'Software Engineer',
    rating: 5,
    outcome: 'interview',
    text: 'Voice editing was surprisingly useful for getting a first draft out quickly, then I polished it manually.',
    verified: false,
    demo: true,
  },
]

export function getReviews() {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedReviews))
    return seedReviews
  }
  try { return JSON.parse(raw) } catch { return seedReviews }
}

export function saveReview(review) {
  const next = [review, ...getReviews()]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function clearDemoReviews() {
  const keep = getReviews().filter((r) => !r.demo)
  localStorage.setItem(KEY, JSON.stringify(keep))
  return keep
}

export function getReviewStats(reviews = getReviews()) {
  const ratings = reviews.map((r) => Number(r.rating)).filter(Boolean)
  const offers = reviews.filter((r) => r.outcome === 'offer').length
  const interviewed = reviews.filter((r) => r.outcome === 'interview' || r.outcome === 'offer').length
  const averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
  return {
    reviews: reviews.length,
    offers,
    interviewed,
    averageRating,
  }
}
