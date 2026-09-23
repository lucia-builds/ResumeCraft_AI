import React, { useEffect, useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'

export default function VoiceButton({ value = '', onChange, className = '' }) {
  const recognitionRef = useRef(null)
  const baseValueRef = useRef(value || '')
  const onChangeRef = useRef(onChange)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return undefined
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const spoken = Array.from(event.results).map((result) => result[0]?.transcript || '').join(' ').trim()
      if (!spoken) return
      const before = baseValueRef.current?.trim()
      onChangeRef.current?.(before ? `${before}${before.endsWith('.') ? ' ' : '\n'}${spoken}` : spoken)
    }
    recognitionRef.current = recognition
    return () => {
      recognition.onresult = null
      try { recognition.stop() } catch {}
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!listening) baseValueRef.current = value || ''
  }, [value, listening])

  if (!supported) return null

  const toggle = () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    if (listening) {
      try { recognition.stop() } catch {}
      return
    }
    baseValueRef.current = value || ''
    try { recognition.start() } catch {}
  }

  return (
    <button type="button" onClick={toggle} title={listening ? 'Stop listening' : 'Edit by voice'} aria-label={listening ? 'Stop listening' : 'Edit this field by voice'} className={`voice-btn ${listening ? 'voice-btn-active' : ''} ${className}`}>
      {listening ? <MicOff size={14} /> : <Mic size={14} />}
      <span>{listening ? 'Listening…' : 'Speak'}</span>
    </button>
  )
}
