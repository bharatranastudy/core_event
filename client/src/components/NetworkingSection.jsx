import { motion } from 'framer-motion'
import { ArrowUpRight, Check, MessageSquare, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { conferenceService } from '../services/conferenceService'
import { Reveal } from './Reveal'

export function NetworkingSection({ attendees = [], speakers = [] }) {
  const { isAuthenticated } = useAuth()
  const [roleFilter, setRoleFilter] = useState('All')
  const [connectedIds, setConnectedIds] = useState([])
  const [feedback, setFeedback] = useState('')

  const combinedProfiles = [
    ...speakers.slice(0, 2).map((s) => ({
      _id: s._id,
      name: s.name,
      title: s.role,
      company: s.company,
      audienceTrack: 'Speaker',
      bio: s.bio,
      interests: [s.track, 'Keynote'],
      image: s.image,
      isSpeaker: true,
    })),
    ...attendees.map((a) => ({ ...a, isSpeaker: false })),
  ]

  const filters = ['All', 'Speaker', 'Founders', 'Design Leads', 'Marketers', 'Engineers']
  const visibleProfiles =
    roleFilter === 'All'
      ? combinedProfiles.slice(0, 6)
      : combinedProfiles.filter((p) => p.audienceTrack === roleFilter)

  const handleConnect = async (profile) => {
    if (connectedIds.includes(profile._id)) return
    setConnectedIds((prev) => [...prev, profile._id])
    setFeedback(`Connection request sent to ${profile.name}.`)
    setTimeout(() => setFeedback(''), 3500)

    if (isAuthenticated) {
      try {
        await conferenceService.connectWithProfile({
          targetId: profile._id,
          targetName: profile.name,
          targetRole: `${profile.title} at ${profile.company}`,
        })
      } catch {
        // Optimistic preview kept if backend offline
      }
    }
  }

  return (
    <section id="networking" className="border-b border-white/10 bg-[#050505] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                06 // ATTENDEE & SPEAKER LOUNGE
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                NETWORKING
              </h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">
                Discover fellow attendees, founders, and keynote speakers before doors open.
                Build your 1:1 coffee-chat roster directly inside ConnectSphere.
              </p>
            </div>

            <Link
              to="/networking"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 font-heading text-xs font-semibold tracking-[0.16em] text-zinc-200 uppercase transition hover:border-[#FF2E93] hover:text-white md:self-auto"
            >
              <Users className="h-4 w-4 text-[#FF2E93]" />
              Open Full Lounge
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Filter Bar + Feedback */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setRoleFilter(filter)}
                className={`rounded-full border px-4 py-1.5 font-mono-label text-[11px] font-semibold tracking-widest uppercase transition ${
                  roleFilter === filter
                    ? 'border-[#FF2E93] bg-[#FF2E93]/15 text-[#FF7AC6]'
                    : 'border-white/10 bg-[#0B0B0E] text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {feedback && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-4 py-1.5 font-mono-label text-xs text-[#FF7AC6]">
              <Check className="h-3.5 w-3.5" />
              {feedback}
            </span>
          )}
        </div>

        {/* Interactive Networking Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProfiles.map((profile, idx) => {
            const isConnected = connectedIds.includes(profile._id)
            return (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B0E] p-6 transition hover:border-[#FF2E93]/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="h-12 w-12 rounded-full border border-white/15 object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/15 font-display text-sm font-bold text-[#FF7AC6]">
                          {profile.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-heading text-base font-bold text-white">
                          {profile.name}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {profile.title} • {profile.company}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono-label text-[10px] font-semibold tracking-wider uppercase ${
                        profile.isSpeaker
                          ? 'border border-[#FF2E93]/50 bg-[#FF2E93]/15 text-[#FF7AC6]'
                          : 'border border-white/10 bg-white/5 text-zinc-300'
                      }`}
                    >
                      {profile.audienceTrack}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{profile.bio}</p>

                  {profile.interests?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {profile.interests.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono-label text-[10px] text-zinc-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2.5 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleConnect(profile)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-heading text-xs font-bold tracking-wider uppercase transition ${
                      isConnected
                        ? 'border border-[#FF2E93]/50 bg-[#FF2E93]/15 text-[#FF7AC6]'
                        : 'bg-white text-[#050505] hover:bg-[#FF2E93] hover:text-white'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        Connect
                      </>
                    )}
                  </button>

                  <Link
                    to="/networking"
                    aria-label={`Message ${profile.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
