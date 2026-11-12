import { ArrowUpRight, Calendar, MapPin, Ticket, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { conferenceService } from '../services/conferenceService'

export function MyEventsPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPasses = async () => {
    setLoading(true)
    try {
      const res = await conferenceService.getMyRegistrations()
      setRegistrations(res.registrations)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your registered events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPasses()
  }, [])

  const handleCancel = async (id) => {
    try {
      await conferenceService.deleteRegistration(id)
      setRegistrations((prev) => prev.filter((r) => r._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel registration.')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
              ATTENDEE DASHBOARD
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold text-white uppercase sm:text-5xl">
              MY REGISTERED EVENTS
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Signed in as <span className="text-white">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#FF2E93] px-6 py-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:self-auto"
          >
            Browse More Events
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[35vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-[#0B0B0E] p-14 text-center">
            <Ticket className="mx-auto h-10 w-10 text-[#FF2E93]" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white uppercase">
              No Registered Passes Yet
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Reserve your seat for upcoming keynotes, workshops, and salons.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-6 py-3 font-heading text-xs font-bold tracking-wider text-white uppercase"
            >
              Explore Events
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B0E] p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-mono-label text-[10px] tracking-widest text-[#FF7AC6] uppercase">
                        TICKET CODE
                      </p>
                      <p className="font-mono-label text-lg font-bold text-white">
                        {reg.ticketCode}
                      </p>
                    </div>
                    {reg.event?.status && <StatusBadge status={reg.event.status} />}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-white uppercase">
                    {reg.event?.title || 'ConnectSphere Session'}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-zinc-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#FF2E93]" />
                      <span>
                        {reg.event?.date} • {reg.event?.time}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#FF2E93]" />
                      <span>{reg.event?.location}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="rounded-full border border-white/15 px-3 py-1 font-mono-label text-[10px] text-zinc-300 uppercase">
                    {reg.ticketType} • {reg.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {reg.event?._id && (
                      <Link
                        to={`/events/${reg.event._id}`}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white uppercase transition hover:border-[#FF2E93]"
                      >
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCancel(reg._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/15"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
