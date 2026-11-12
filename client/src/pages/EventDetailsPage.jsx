import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Mic2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { conferenceService } from '../services/conferenceService'

export function EventDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: 'General Pass',
  })
  const [submitting, setSubmitting] = useState(false)
  const [regError, setRegError] = useState('')
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await conferenceService.getEventById(id)
        if (active) setEvent(res.event)
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || 'Event not found.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    if (!form.fullName.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.phone.trim().length < 7) {
      setRegError('Please provide valid full name, email, and phone number.')
      return
    }
    setSubmitting(true)
    try {
      const res = await conferenceService.createRegistration({
        ...form,
        eventId: event._id,
      })
      setTicket(res.registration)
      setEvent((prev) => ({ ...prev, registeredCount: (prev.registeredCount || 0) + 1 }))
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#050505]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-bold text-white uppercase">Event Not Found</h1>
        <p className="mt-3 text-sm text-zinc-400">{error}</p>
        <Link
          to="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-6 py-3 text-xs font-bold tracking-wider text-white uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] py-14 sm:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-mono-label text-xs tracking-widest text-zinc-400 uppercase transition hover:text-[#FF2E93]"
        >
          <ArrowLeft className="h-4 w-4" />
          All Events
        </Link>

        {/* Hero Banner */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E]">
          <div className="relative aspect-[21/9] min-h-[260px] w-full overflow-hidden">
            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-black/35 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <StatusBadge status={event.status} />
                  <span className="rounded-full border border-white/15 bg-black/75 px-3 py-1 font-mono-label text-[11px] text-zinc-200 uppercase">
                    {event.category} • {event.day}
                  </span>
                </div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-white uppercase sm:text-5xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Registration Split */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <h2 className="font-display text-xl font-bold text-white uppercase">Session Overview</h2>
              <p className="mt-4 leading-relaxed text-zinc-300">{event.description}</p>

              <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-[#FF2E93]" />
                  <div>
                    <p className="font-mono-label text-[10px] text-zinc-500 uppercase">Date</p>
                    <p className="text-sm font-semibold text-white">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-[#FF2E93]" />
                  <div>
                    <p className="font-mono-label text-[10px] text-zinc-500 uppercase">Time</p>
                    <p className="text-sm font-semibold text-white">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#FF2E93]" />
                  <div>
                    <p className="font-mono-label text-[10px] text-zinc-500 uppercase">Location</p>
                    <p className="text-sm font-semibold text-white">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-[#FF2E93]" />
                  <div>
                    <p className="font-mono-label text-[10px] text-zinc-500 uppercase">Capacity</p>
                    <p className="text-sm font-semibold text-white">
                      {event.registeredCount || 0} / {event.capacity || 250} Registered
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <p className="font-mono-label text-[11px] tracking-widest text-[#FF2E93] uppercase">
                Featured Speaker
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/15">
                  <Mic2 className="h-6 w-6 text-[#FF2E93]" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase">
                    {event.speakerName}
                  </h3>
                  <p className="text-sm text-zinc-400">{event.speakerRole}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <p className="font-mono-label text-[11px] tracking-widest text-[#FF2E93] uppercase">
                INSTANT RESERVATION
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white uppercase">
                JOIN THIS EVENT
              </h2>

              {ticket ? (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-heading text-sm font-bold uppercase">
                      Seat Reserved — {ticket.ticketCode}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    Your pass for <strong>{event.title}</strong> is confirmed. View it anytime in
                    My Passes.
                  </p>
                  <Link
                    to="/my-events"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF2E93] py-3.5 font-heading text-xs font-bold tracking-wider text-white uppercase"
                  >
                    Go to My Passes
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Alex Rivera"
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@studio.io"
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (415) 555-0199"
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Pass Tier
                    </label>
                    <select
                      value={form.ticketType}
                      onChange={(e) => setForm({ ...form, ticketType: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                    >
                      <option value="General Pass">General Pass</option>
                      <option value="VIP All-Access">VIP All-Access</option>
                      <option value="Virtual Stream">Virtual Stream</option>
                    </select>
                  </div>

                  {regError && (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF2E93] py-3.5 font-heading text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_0_24px_rgba(255,46,147,0.45)] transition hover:bg-[#e11d7c] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Reserving...
                      </>
                    ) : (
                      <>
                        Reserve My Seat
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
