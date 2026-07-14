import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    const fn = mode === 'login' ? signIn : signUp
    const { error } = await fn(email.trim(), password)
    setBusy(false)
    if (error) {
      setError(error)
      return
    }
    if (mode === 'register') {
      // If email confirmation is off, signUp returns a session and the
      // listener redirects. Otherwise, prompt the user to sign in.
      setInfo('Account created. You can sign in now.')
      setMode('login')
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-monday-purple/10 via-monday-bg to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-monday-purple text-lg font-bold text-white">
            m
          </div>
          <span className="text-xl font-semibold">mondayC</span>
        </div>

        <h1 className="text-2xl font-semibold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 mb-6 text-sm text-monday-muted">
          {mode === 'login'
            ? 'Sign in to manage your tasks.'
            : 'Register to start managing tasks.'}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-monday-border px-3 py-2.5 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-monday-border px-3 py-2.5 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-prio-urgent/10 px-3 py-2 text-sm text-prio-urgent">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg bg-status-done/10 px-3 py-2 text-sm text-status-done">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-monday-purple py-2.5 font-medium text-white transition hover:bg-monday-purple/90 disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-monday-muted">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError(null)
              setInfo(null)
            }}
            className="font-medium text-monday-purple hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
