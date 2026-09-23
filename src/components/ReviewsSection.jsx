import React, { useMemo, useState } from 'react'
import { Award, BriefcaseBusiness, CheckCircle2, MessageSquareQuote, Send, Star, Users } from 'lucide-react'
import { getReviewStats, getReviews, saveReview } from '../services/reviews'

function Stars({ value }) {
  return <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />)}
  </div>
}

export default function ReviewsSection({ compact = false }) {
  const [reviews, setReviews] = useState(() => getReviews())
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const stats = useMemo(() => getReviewStats(reviews), [reviews])
  const featured = reviews.slice(0, 3)

  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const review = {
      id: crypto.randomUUID(),
      name: String(fd.get('name') || 'Community member'),
      role: String(fd.get('role') || 'Job seeker'),
      rating: Number(fd.get('rating') || 5),
      outcome: String(fd.get('outcome') || 'interview'),
      text: String(fd.get('text') || '').trim(),
      verified: false,
      demo: false,
    }
    if (!review.text) return
    const next = saveReview(review)
    setReviews(next)
    setShowForm(false)
    setSubmitted(true)
    e.currentTarget.reset()
  }

  return <section className={compact ? 'mt-8' : 'section-space bg-slate-50/80'}>
    <div className="mx-auto max-w-7xl px-5">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Community feedback</p>
          <h2>See how people are using the workspace.</h2>
        </div>
        <p>
          Ratings and outcomes here are user-reported. In local demo mode the page starts with example reviews;
          connect your production database before presenting hiring totals as verified platform statistics.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric icon={<BriefcaseBusiness size={17}/>} label="Offers reported" value={stats.offers || '—'} hint="Based on submitted outcome reports" />
        <Metric icon={<Users size={17}/>} label="Reviews" value={stats.reviews} hint={reviews.some(r => r.demo) ? 'Includes demo examples' : 'User-submitted feedback'} />
        <Metric icon={<Award size={17}/>} label="Average rating" value={stats.averageRating ? `${stats.averageRating.toFixed(1)}/5` : '—'} hint="Calculated from submitted ratings" />
      </div>

      {submitted && <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={16}/> Thanks — your feedback was added to this local demo.</div>}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {featured.map((review) => <article key={review.id} className="review-card">
          <div className="flex items-start justify-between gap-3"><Stars value={review.rating}/><span className="review-outcome">{review.outcome === 'offer' ? 'Offer reported' : review.outcome === 'interview' ? 'Interview reported' : 'In progress'}</span></div>
          <p className="mt-4 text-sm leading-7 text-slate-600">“{review.text}”</p>
          <div className="mt-5 flex items-center gap-3"><div className="review-avatar">{review.name.slice(0,1).toUpperCase()}</div><div><div className="text-sm font-black text-slate-900">{review.name}{review.verified && <span className="ml-2 text-[10px] font-bold text-emerald-600">Verified</span>}</div><div className="text-xs text-slate-500">{review.role}</div></div></div>
          {review.demo && <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-400">Example review — demo content</div>}
        </article>)}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><MessageSquareQuote size={18}/></div><div><div className="text-sm font-black text-slate-900">Used the platform?</div><div className="text-xs text-slate-500">Share your rating and the stage you reached.</div></div></div>
        <button onClick={() => setShowForm(v => !v)} className="primary-btn"><Send size={15}/> {showForm ? 'Close form' : 'Leave a review'}</button>
      </div>

      {showForm && <form onSubmit={submit} className="mt-4 review-form">
        <div className="grid gap-4 md:grid-cols-2"><input name="name" required className="input-modern" placeholder="Your name"/><input name="role" className="input-modern" placeholder="Role you applied for"/></div>
        <div className="grid gap-4 md:grid-cols-2"><select name="rating" className="input-modern" defaultValue="5"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><select name="outcome" className="input-modern" defaultValue="interview"><option value="interview">Reached interview stage</option><option value="offer">Received an offer</option><option value="applied">Applied / still in progress</option></select></div>
        <textarea name="text" required rows="4" className="textarea-modern" placeholder="What helped you most?"></textarea>
        <div className="flex justify-end"><button type="submit" className="primary-btn">Submit feedback <Send size={15}/></button></div>
      </form>}
    </div>
  </section>
}

function Metric({ icon, label, value, hint }) {
  return <div className="soft-card flex items-start gap-3 p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">{icon}</div><div><p className="text-[11px] font-black uppercase tracking-[.14em] text-slate-400">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></div></div>
}
