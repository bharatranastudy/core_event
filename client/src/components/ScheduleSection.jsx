import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Bookmark, Check, Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { StatusBadge } from './StatusBadge'

const DAYS = [
  { id: 'Day 01', label: 'DAY 01', date: 'NOV 18' },
  { id: 'Day 02', label: 'DAY 02', date: 'NOV 19' },
  { id: 'Day 03', label: 'DAY 03', date: 'NOV 20' },
]

export function ScheduleSection({ events = [] }) {
  const [selectedDay, setSelectedDay] = useState('Day 01')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cs_saved_schedule') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cs_saved_schedule', JSON.stringify(savedIds))
  }, [savedIds])

  const categories = ['All', ...new Set(events.map((e) => e.category).filter(Boolean))]

  const filteredEvents = events.filter((ev) => {
    const dayMatch = (ev.day || 'Day 01') === selectedDay
    const catMatch = selectedCategory === 'All' || ev.category === selectedCategory
    return dayMatch && catMatch
  })

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <section id="schedule" className="border-b border-white/10 bg-[#050505] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                05 // DAY-BY-DAY PROGRAM
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                CONFERENCE SCHEDULE
              </h2>
            </div>

            {/* Day Selector Tabs */}
            <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#0B0B0E] p-1.5">
              {DAYS.map((day) => {
                const active = selectedDay === day.id
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDay(day.id)}
                    className={`rounded-xl px-4 py-2.5 text-left transition ${
                      active
                        ? 'bg-[#FF2E93] text-white shadow-[0_0_24px_rgba(255,46,147,0.35)]'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="block font-display text-xs font-bold tracking-wider uppercase">
                      {day.label}
                    </span>
                    <span
                      className={`block font-mono-label text-[10px] ${
                        active ? 'text-pink-100' : 'text-zinc-500'
                      }`}
                    >
                      {day.date}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Category Filter Pills */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-4 py-1.5 font-mono-label text-[11px] font-semibold tracking-widest uppercase transition ${
                selectedCategory === cat
                  ? 'border-[#FF2E93] bg-[#FF2E93]/15 text-[#FF7AC6]'
                  : 'border-white/10 bg-[#0B0B0E] text-zinc-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Schedule Rows */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDay}-${selectedCategory}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E]"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((session) => {
                const isSaved = savedIds.includes(session._id)
                return (
                  <div
                    key={session._id}
                    className="group grid items-center gap-5 p-6 transition hover:bg-white/[0.02] md:grid-cols-12 md:px-8 md:py-7"
                  >
                    {/* Time & Status */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 font-mono-label text-xs font-semibold text-white">
                        <Clock className="h-3.5 w-3.5 text-[#FF2E93]" />
                        <span>{session.time}</span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <StatusBadge status={session.status} />
                        <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono-label text-[10px] tracking-widest text-zinc-300 uppercase">
                          {session.category}
                        </span>
                      </div>
                    </div>

                    {/* Session Title & Location */}
                    <div className="md:col-span-5">
                      <Link
                        to={`/events/${session._id}`}
                        className="font-display text-lg font-bold tracking-tight text-white uppercase transition group-hover:text-[#FF2E93] sm:text-xl"
                      >
                        {session.title}
                      </Link>
                      <p className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{session.location}</span>
                      </p>
                    </div>

                    {/* Speaker */}
                    <div className="md:col-span-2">
                      <p className="font-mono-label text-[10px] tracking-widest text-zinc-500 uppercase">
                        Speaker
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        {session.speakerName}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 md:col-span-2">
                      <button
                        type="button"
                        onClick={() => toggleSave(session._id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono-label text-[10px] font-semibold tracking-wider uppercase transition ${
                          isSaved
                            ? 'border-[#FF2E93] bg-[#FF2E93]/15 text-[#FF7AC6]'
                            : 'border-white/15 text-zinc-300 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3.5 w-3.5" />
                            Save
                          </>
                        )}
                      </button>

                      <Link
                        to={`/events/${session._id}`}
                        aria-label={`View ${session.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:bg-[#FF2E93] hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-12 text-center">
                <p className="font-heading text-base font-semibold text-zinc-300">
                  No sessions match this filter on {selectedDay}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="mt-3 font-mono-label text-xs tracking-widest text-[#FF2E93] uppercase underline"
                >
                  Reset Category Filter
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
