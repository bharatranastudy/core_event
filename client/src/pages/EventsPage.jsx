import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, MapPin, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { conferenceService } from '../services/conferenceService'

const CATEGORIES = ['All', 'Keynote', 'Panel', 'Workshop', 'Networking', 'Masterclass']
const STATUSES = ['All', 'LIVE', 'UPCOMING', 'REPLAY']
const DAYS = ['All', 'Day 01', 'Day 02', 'Day 03']

export function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [day, setDay] = useState('All')

  useEffect(() => {
    let active = true
    const fetchFiltered = async () => {
      setLoading(true)
      try {
        const res = await conferenceService.getEvents({ search, category, status, day })
        if (active) setEvents(res.events)
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(fetchFiltered, 150)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search, category, status, day])

  return (
    <div className="min-h-screen bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="border-b border-white/10 pb-10">
          <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
            CONNECTSPHERE PROGRAM
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            EVENTS & SESSIONS
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Filter keynotes, live labs, panels, and private networking salons across all three days
            of ConnectSphere 2026.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-[#0B0B0E] p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions, speakers, or stages..."
                className="w-full rounded-xl border border-white/15 bg-[#050505] py-3 pr-4 pl-11 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF2E93]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    Schedule: {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-1.5 font-mono-label text-[11px] font-semibold tracking-widest uppercase transition ${
                  category === cat
                    ? 'border-[#FF2E93] bg-[#FF2E93] text-white'
                    : 'border-white/10 bg-[#050505] text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="flex min-h-[35vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
          </div>
        ) : events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#0B0B0E] p-14 text-center">
            <p className="font-display text-2xl font-bold text-white uppercase">
              No Matching Events Found
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Try clearing one of your active filters or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('All')
                setStatus('All')
                setDay('All')
              }}
              className="mt-6 rounded-full bg-[#FF2E93] px-6 py-2.5 font-heading text-xs font-bold tracking-wider text-white uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((ev, idx) => (
              <motion.article
                key={ev._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E] transition hover:border-[#FF2E93]/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-black/25 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <StatusBadge status={ev.status} />
                    <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono-label text-[10px] tracking-widest text-zinc-200 uppercase">
                      {ev.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="font-mono-label text-[11px] tracking-widest text-[#FF7AC6] uppercase">
                      {ev.day} • {ev.speakerName}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-white uppercase">
                      {ev.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-2 text-sm text-zinc-400">{ev.description}</p>

                    <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#FF2E93]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#FF2E93]" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#FF2E93]" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/events/${ev._id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] py-3 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase transition group-hover:border-[#FF2E93] group-hover:bg-[#FF2E93]"
                  >
                    View Event & Join
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
