import { motion } from 'framer-motion'
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { conferenceService } from '../services/conferenceService'
import { Reveal } from './Reveal'

export function RegistrationSection({ events = [], preselectedEventId = '' }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventId: '',
    ticketType: 'General Pass',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

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
    if (preselectedEventId) {
      setForm((prev) => ({ ...prev, eventId: preselectedEventId }))
    } else if (events.length > 0 && !form.eventId) {
      setForm((prev) => ({ ...prev, eventId: events[0]._id }))
    }
  }, [preselectedEventId, events, form.eventId])

  const validate = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      return 'Please enter your full name.'
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      return 'Please enter a valid phone number.'
    }
    if (!form.eventId) {
      return 'Please select a conference event.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const result = await conferenceService.createRegistration(form)
      setConfirmation(result)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to complete registration. Please check your details.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="register"
      className="relative overflow-hidden bg-[#050505] bg-editorial-grid py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#FF2E93]/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Editorial Column */}
          <Reveal className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                07 // RESERVE YOUR PASS
              </p>
              <h2 className="mt-3 font-display text-4xl leading-[0.98] font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                SAVE YOUR
                <br />
                <span className="text-[#FF2E93]">SPOT NOW.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Lock in your seat for keynotes, masterclasses, and private evening salons at Pier
                27 San Francisco or join globally via 4K interactive live stream.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div className="rounded-xl border border-white/10 bg-[#0B0B0E] p-4">
                <p className="font-display text-2xl font-extrabold text-white">NOV 18–20</p>
                <p className="mt-1 font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                  3 FULL DAYS
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0B0B0E] p-4">
                <p className="font-display text-2xl font-extrabold text-[#FF2E93]">INSTANT</p>
                <p className="mt-1 font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                  DIGITAL PASS CODE
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right Form Card */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-6 shadow-2xl sm:p-10">
              {confirmation ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 font-mono-label text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    REGISTRATION CONFIRMED
                  </div>

                  <h3 className="mt-5 font-display text-3xl font-bold text-white uppercase">
                    YOU&apos;RE ON THE LIST, {confirmation.registration?.fullName}.
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">{confirmation.message}</p>

                  {/* Digital Pass Ticket */}
                  <div className="mt-6 rounded-2xl border border-[#FF2E93]/40 bg-gradient-to-br from-[#FF2E93]/15 via-[#111015] to-[#08080B] p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="font-mono-label text-[10px] tracking-widest text-[#FF7AC6] uppercase">
                          PASS CODE
                        </p>
                        <p className="mt-1 font-mono-label text-2xl font-bold tracking-wider text-white">
                          {confirmation.registration?.ticketCode}
                        </p>
                      </div>
                      <Ticket className="h-8 w-8 text-[#FF2E93]" />
                    </div>
                    <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                      <div>
                        <p className="font-mono-label text-zinc-500 uppercase">Event</p>
                        <p className="mt-0.5 font-semibold text-white">
                          {confirmation.registration?.event?.title}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono-label text-zinc-500 uppercase">Tier</p>
                        <p className="mt-0.5 font-semibold text-white">
                          {confirmation.registration?.ticketType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmation(null)}
                      className="rounded-full border border-white/15 px-5 py-2.5 font-heading text-xs font-semibold tracking-wider text-white uppercase transition hover:border-[#FF2E93]"
                    >
                      Register Another Event
                    </button>
                    <Link
                      to="/my-events"
                      className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-white uppercase"
                    >
                      View My Passes
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="reg-fullName"
                        className="mb-2 block font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
                      >
                        Full Name *
                      </label>
                      <input
                        id="reg-fullName"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Alex Rivera"
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder-zinc-600 transition outline-none focus:border-[#FF2E93]"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reg-email"
                        className="mb-2 block font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
                      >
                        Email Address *
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@studio.io"
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder-zinc-600 transition outline-none focus:border-[#FF2E93]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="reg-phone"
                        className="mb-2 block font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (415) 555-0199"
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder-zinc-600 transition outline-none focus:border-[#FF2E93]"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reg-tier"
                        className="mb-2 block font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
                      >
                        Pass Tier
                      </label>
                      <select
                        id="reg-tier"
                        value={form.ticketType}
                        onChange={(e) => setForm({ ...form, ticketType: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white transition outline-none focus:border-[#FF2E93]"
                      >
                        <option value="General Pass">General Pass</option>
                        <option value="VIP All-Access">VIP All-Access</option>
                        <option value="Virtual Stream">Virtual Stream</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-event"
                      className="mb-2 block font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
                    >
                      Select Event *
                    </label>
                    <select
                      id="reg-event"
                      value={form.eventId}
                      onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white transition outline-none focus:border-[#FF2E93]"
                      required
                    >
                      {events.map((ev) => (
                        <option key={ev._id} value={ev._id}>
                          {ev.date} — {ev.title} ({ev.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#FF2E93] px-8 py-4 font-heading text-xs font-bold tracking-[0.2em] text-white uppercase shadow-[0_0_32px_rgba(255,46,147,0.45)] transition hover:bg-[#e11d7c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirming Registration...
                      </>
                    ) : (
                      <>
                        Submit Registration
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
