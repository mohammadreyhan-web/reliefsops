'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const result = mode === 'sign-in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name })
      if (result.error) { setError(mode === 'sign-in' ? 'Email or password is incorrect. If you are new, create an account first.' : 'Could not create your account. Check the details and try again.'); return }
      router.replace('/'); router.refresh()
    } catch {
      setError('The authentication service is unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-screen"><div className="auth-visual"><div className="auth-visual-shade" /><div className="auth-visual-copy"><span className="auth-status"><i /> OPERATIONS NETWORK ONLINE</span><h1>Coordinate help<br /><em>where it matters.</em></h1><p>One clear view for people, supplies, and decisions when communities need them most.</p><div className="auth-stat-row"><span><b>24/7</b><small>FIELD COVERAGE</small></span><span><b>100%</b><small>ACCOUNTABLE</small></span></div></div><span className="auth-caption">FIELD RESPONSE // EASTERN REGION // 2026</span></div><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><ShieldCheck size={22} /></span><div><b>RELIEFOPS</b><span>COMMAND CENTER</span></div></div><span className="eyebrow">SECURE OPERATIONS ACCESS</span><h2>{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h2><p className="auth-subtitle">{mode === 'sign-in' ? 'Sign in to continue coordinating relief operations.' : 'Create an account to access the relief operations workspace.'}</p><form onSubmit={submit}>{mode === 'sign-up' && <label>Full name<input value={name} onChange={event => setName(event.target.value)} autoComplete="name" required /></label>}<label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-btn auth-submit" disabled={loading}>{loading ? 'Signing in…' : mode === 'sign-in' ? 'Sign in securely' : 'Create account'}</button></form><button type="button" className="auth-toggle" onClick={() => { setError(''); setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in') }}>{mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button><p className="auth-footer"><ShieldCheck size={13} /> Protected access for authorized response teams</p></section></main>
}
