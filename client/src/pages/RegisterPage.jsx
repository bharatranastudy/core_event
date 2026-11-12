import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    title: '',
    company: '',
    audienceTrack: 'Design Leads',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/my-events', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to register. Ensure the backend server and MongoDB are connected.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#050505] bg-editorial-grid px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0B0E] p-8 shadow-2xl">
        <p className="font-mono-label text-[11px] tracking-[0.24em] text-[#FF2E93] uppercase">
          CREATE PROFILE
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-white uppercase">
          JOIN CONNECTSPHERE
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Create your attendee account to manage passes and connect with peers.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Rivera"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@studio.io"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Password *
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (415) 555-0199"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Role / Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Product Designer"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                Company
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Linearity Labs"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
              Primary Discipline
            </label>
            <select
              value={form.audienceTrack}
              onChange={(e) => setForm({ ...form, audienceTrack: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
            >
              <option value="Founders">Founders</option>
              <option value="Design Leads">Design Leads</option>
              <option value="Marketers">Marketers</option>
              <option value="Engineers">Engineers</option>
            </select>
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#FF2E93] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
