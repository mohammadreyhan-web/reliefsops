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

  return <main className="auth-screen"><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><ShieldCheck size={22} /></span><div><b>RELIEFOPS</b><span>COMMAND CENTER</span></div></div><span className="eyebrow">SECURE OPERATIONS ACCESS</span><h1>{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h1><p className="auth-subtitle">Sign in to coordinate accountable disaster relief operations.</p><form onSubmit={submit}>{mode === 'sign-up' && <label>Full name<input value={name} onChange={event => setName(event.target.value)} autoComplete="name" required /></label>}<label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-btn auth-submit" disabled={loading}>{loading ? 'Signing in…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button></form><button className="auth-toggle" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button></section></main>
}
