import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, MapPin, Mic2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { StatusBadge } from './StatusBadge'

export function UpcomingEventsSection({ events = [], onSelectEventForRegister }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= events.length) {
      setActiveIndex(0)
    }
  }, [events.length, activeIndex])

  const activeEvent = events[activeIndex] || events[0]

  if (!activeEvent) return null

  const fillPercent = Math.min(
    100,
    Math.round(((activeEvent.registeredCount || 0) / (activeEvent.capacity || 250)) * 100)
  )

  return (
    <section id="upcoming-events" className="border-b border-white/10 bg-[#050505] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                02 // FEATURED SESSIONS
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                UPCOMING EVENTS
              </h2>
            </div>

            <Link
              to="/events"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 font-heading text-xs font-semibold tracking-[0.16em] text-zinc-200 uppercase transition hover:border-[#FF2E93] hover:text-white md:self-auto"
            >
              Browse All Sessions
              <ArrowUpRight className="h-4 w-4 text-[#FF2E93] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Featured Cinematic Event Spotlight */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent._id}
              initial={{ opacity: 0.4, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.4, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-12"
            >
              {/* Cinematic Image */}
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[460px]">
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0B0B0E]" />

                <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2.5">
                  <StatusBadge status={activeEvent.status} />
                  <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono-label text-[11px] font-medium tracking-widest text-zinc-200 uppercase backdrop-blur-md">
                    {activeEvent.category}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <div>
                  <p className="font-mono-label text-xs tracking-[0.2em] text-[#FF2E93] uppercase">
                    {activeEvent.day} • {activeEvent.subtitle || activeEvent.category}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-[1.08] font-bold tracking-tight text-white uppercase sm:text-3xl">
                    {activeEvent.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {activeEvent.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-zinc-300">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                      <span>{activeEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                      <span>{activeEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                      <span>{activeEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mic2 className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                      <span>
                        <strong className="text-white">{activeEvent.speakerName}</strong>
                        {activeEvent.speakerRole ? ` — ${activeEvent.speakerRole}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {/* Capacity Bar */}
                  <div className="mb-5">
                    <div className="mb-1.5 flex items-center justify-between font-mono-label text-[11px] text-zinc-400 uppercase">
                      <span>Seat Allocation</span>
                      <span>
                        {activeEvent.registeredCount || 0} / {activeEvent.capacity || 250} Reserved
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-[#ff7ac6]"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectEventForRegister?.(activeEvent._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FF2E93] px-6 py-3.5 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase shadow-[0_0_24px_rgba(255,46,147,0.4)] transition hover:bg-[#e11d7c]"
                    >
                      JOIN EVENT
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/events/${activeEvent._id}`}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3.5 font-heading text-xs font-semibold tracking-[0.15em] text-white uppercase transition hover:border-white/40"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Horizontal Thumbnail Strip / Event Gallery */}
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {events.map((ev, index) => {
            const isSelected = index === activeIndex
            return (
              <button
                key={ev._id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border text-left transition sm:w-72 ${
                  isSelected
                    ? 'border-[#FF2E93] bg-[#131018] shadow-[0_0_25px_rgba(255,46,147,0.25)]'
                    : 'border-white/10 bg-[#0B0B0E] hover:border-white/30'
                }`}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <StatusBadge status={ev.status} />
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="font-mono-label text-[10px] tracking-widest text-[#FF7AC6] uppercase">
                    {ev.date} • {ev.category}
                  </p>
                  <p className="mt-1 line-clamp-1 font-heading text-sm font-bold text-white uppercase">
                    {ev.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
