import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/my-events'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin' && from === '/my-events') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to sign in. Verify your credentials and ensure the backend & MongoDB are running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#050505] bg-editorial-grid px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0E] p-8 shadow-2xl">
        <p className="font-mono-label text-[11px] tracking-[0.24em] text-[#FF2E93] uppercase">
          ATTENDEE & ADMIN PORTAL
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-white uppercase">
          SIGN IN
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Access your conference passes, saved schedule, and networking lounge.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF2E93] py-3.5 font-heading text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_0_25px_rgba(255,46,147,0.4)] transition hover:bg-[#e11d7c] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Don&apos;t have a ConnectSphere account?{' '}
          <Link to="/register" className="font-semibold text-[#FF2E93] hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}
