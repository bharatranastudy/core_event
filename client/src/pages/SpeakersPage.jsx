import { motion } from 'framer-motion'
import { ArrowUpRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SpeakerModal } from '../components/SpeakerModal'
import { conferenceService } from '../services/conferenceService'

const TRACKS = ['All', 'Design Craft', 'AI & Systems', 'Growth & Brand', 'Engineering', 'Leadership']

export function SpeakersPage() {
  const [speakers, setSpeakers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [track, setTrack] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const [spkRes, evtRes] = await Promise.all([
          conferenceService.getSpeakers({ track, search }),
          conferenceService.getEvents(),
        ])
        if (active) {
          setSpeakers(spkRes.speakers)
          setEvents(evtRes.events)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(load, 150)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [track, search])

  return (
    <div className="min-h-screen bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="border-b border-white/10 pb-10">
          <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
            CONNECTSPHERE 2026 ROSTER
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            SPEAKERS
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Founders, principal architects, and creative directors building the next decade of
            intelligent products.
          </p>
        </div>

        {/* Search & Track Filter */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0B0B0E] p-5 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search speaker or company..."
              className="w-full rounded-xl border border-white/15 bg-[#050505] py-2.5 pr-4 pl-11 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF2E93]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTrack(t)}
                className={`rounded-full border px-4 py-1.5 font-mono-label text-[11px] font-semibold tracking-widest uppercase transition ${
                  track === t
                    ? 'border-[#FF2E93] bg-[#FF2E93] text-white'
                    : 'border-white/10 bg-[#050505] text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[35vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker, idx) => (
              <motion.div
                key={speaker._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                onClick={() => setSelectedSpeaker(speaker)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E] transition hover:border-[#FF2E93]/60"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#050505]">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/75 px-3 py-1 font-mono-label text-[10px] tracking-widest text-zinc-200 uppercase">
                    {speaker.track}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white uppercase">
                        {speaker.name}
                      </h2>
                      <p className="mt-1 text-xs font-semibold text-[#FF2E93] uppercase">
                        {speaker.role} • {speaker.company}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 transition group-hover:text-[#FF2E93]" />
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">{speaker.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <SpeakerModal
        speaker={selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        relatedEvents={
          selectedSpeaker ? events.filter((e) => e.speakerName === selectedSpeaker.name) : []
        }
      />
    </div>
  )
}
