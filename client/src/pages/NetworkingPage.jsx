import { Check, Search, Send, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { conferenceService } from '../services/conferenceService'

const TRACKS = ['All', 'Founders', 'Design Leads', 'Marketers', 'Engineers']

export function NetworkingPage() {
  const { isAuthenticated } = useAuth()
  const [attendees, setAttendees] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState('All')
  const [noteTarget, setNoteTarget] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await conferenceService.getNetworkingProfiles({ search, track })
        if (active) {
          setAttendees(res.attendees)
          setSpeakers(res.speakers)
        }
        if (isAuthenticated) {
          const conns = await conferenceService.getMyConnections()
          if (active) setConnections(conns.map((c) => c.targetId))
        }
      } catch {
        // Keep UI graceful
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(load, 150)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search, track, isAuthenticated])

  const sendConnection = async (profile, customNote = '') => {
    setConnections((prev) => (prev.includes(profile._id) ? prev : [...prev, profile._id]))
    setToast(`Connected with ${profile.name}!`)
    setTimeout(() => setToast(''), 3500)
    setNoteTarget(null)
    setNoteText('')

    if (isAuthenticated) {
      try {
        await conferenceService.connectWithProfile({
          targetId: profile._id,
          targetName: profile.name,
          targetRole: `${profile.title || profile.role} • ${profile.company}`,
          note: customNote || undefined,
        })
      } catch {
        // Already shown optimistic state
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
              CONNECTSPHERE COMMUNITY
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
              NETWORKING LOUNGE
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Discover founders, design leads, marketers, engineers, and ConnectSphere speakers.
              Send intro notes and schedule 1:1 conversations.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0B0E] px-4 py-2 font-mono-label text-xs text-zinc-300">
            <Users className="h-4 w-4 text-[#FF2E93]" />
            <span>{connections.length} Active Connections</span>
          </div>
        </div>

        {/* Search & Track Filter */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0B0B0E] p-5 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendees by name, role, or company..."
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

        {toast && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/15 px-5 py-2 font-mono-label text-xs text-[#FF7AC6]">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
          </div>
        ) : (
          <>
            {/* Speakers to Connect With */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-white uppercase">
                Connect With Speakers
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {speakers.map((s) => {
                  const connected = connections.includes(s._id)
                  return (
                    <div
                      key={s._id}
                      className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B0E] p-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-14 w-14 rounded-full border border-[#FF2E93]/40 object-cover object-top"
                        />
                        <div>
                          <h3 className="font-heading text-base font-bold text-white">{s.name}</h3>
                          <p className="text-xs text-[#FF2E93]">
                            {s.role} • {s.company}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-zinc-400">{s.bio}</p>
                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => sendConnection(s)}
                          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-heading text-xs font-bold tracking-wider uppercase transition ${
                            connected
                              ? 'border border-[#FF2E93]/50 bg-[#FF2E93]/15 text-[#FF7AC6]'
                              : 'bg-[#FF2E93] text-white hover:bg-[#e11d7c]'
                          }`}
                        >
                          {connected ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                          {connected ? 'Connected' : 'Connect'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoteTarget(s)}
                          className="rounded-full border border-white/15 px-4 py-2.5 font-heading text-xs font-semibold text-zinc-200 uppercase transition hover:border-white/40"
                        >
                          Note
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Attendees Directory */}
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-white uppercase">
                Fellow Attendees
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {attendees.map((a) => {
                  const connected = connections.includes(a._id)
                  return (
                    <div
                      key={a._id}
                      className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B0E] p-6"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/15 font-display text-sm font-bold text-[#FF7AC6]">
                            {a.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono-label text-[10px] text-zinc-300 uppercase">
                            {a.audienceTrack}
                          </span>
                        </div>
                        <h3 className="mt-4 font-heading text-base font-bold text-white">
                          {a.name}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {a.title} • {a.company}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-zinc-400">{a.bio}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => sendConnection(a)}
                        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-heading text-xs font-bold tracking-wider uppercase transition ${
                          connected
                            ? 'border border-[#FF2E93]/50 bg-[#FF2E93]/15 text-[#FF7AC6]'
                            : 'bg-white text-[#050505] hover:bg-[#FF2E93] hover:text-white'
                        }`}
                      >
                        {connected ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                        {connected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Quick Intro Note Modal */}
        {noteTarget && (
          <div
            onClick={() => setNoteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0E] p-6"
            >
              <h3 className="font-display text-xl font-bold text-white uppercase">
                Message {noteTarget.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Include a short intro note for your coffee-chat request.
              </p>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Hi! Loved your work on spatial design systems—would love to connect at Pier 27."
                className="mt-4 w-full rounded-xl border border-white/15 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteTarget(null)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => sendConnection(noteTarget, noteText)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-5 py-2 text-xs font-bold text-white uppercase"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
