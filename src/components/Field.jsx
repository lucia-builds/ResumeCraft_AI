import React from 'react'
import VoiceButton from './VoiceButton'

export default function Field({ label, value, onChange, placeholder, type='text', rows }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="field-label">{label}</span>
        <VoiceButton value={value} onChange={onChange} />
      </div>
      {rows ? (
        <textarea rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="textarea-modern" />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-modern" />
      )}
    </label>
  )
}
