'use client'

import { FormEvent, useState } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'

type Props = { context: Record<string, unknown>; onClose: () => void }

export function ReliefCopilot({ context, onClose }: Props) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'I can help summarize incidents, spot resource risks, and suggest response priorities. What should we review?' }])
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!question.trim() || loading) return
    const prompt = question.trim()
    setQuestion('')
    setMessages(current => [...current, { role: 'user', text: prompt }])
    setLoading(true)
    try {
      const response = await fetch('/api/copilot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: prompt, context }) })
      const data = await response.json()
      setMessages(current => [...current, { role: 'assistant', text: data.answer ?? data.error ?? 'No response was returned.' }])
    } catch {
      setMessages(current => [...current, { role: 'assistant', text: 'The copilot is temporarily unavailable.' }])
    } finally {
      setLoading(false)
    }
  }

  return <aside className="copilot-panel" aria-label="ReliefOps Copilot"><header><div className="copilot-title"><span><Bot size={17} /></span><div><strong>ReliefOps Copilot</strong><small>Decision support · advisory only</small></div></div><button className="icon-btn" onClick={onClose} aria-label="Close copilot"><X size={17} /></button></header><div className="copilot-messages">{messages.map((message, index) => <div className={`copilot-message ${message.role}`} key={`${message.role}-${index}`}>{message.role === 'assistant' && <Sparkles size={13} />}{message.text}</div>)}{loading && <div className="copilot-message assistant"><Sparkles size={13} />Reviewing the operational snapshot…</div>}</div><form onSubmit={submit} className="copilot-form"><input value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask about priorities..." aria-label="Ask the copilot" /><button className="primary-btn" disabled={loading || !question.trim()} aria-label="Send question"><Send size={15} /></button></form></aside>
}
