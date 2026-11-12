import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Globe, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LinkedInBrandIcon, XBrandIcon } from './SocialIcons'

export function SpeakerModal({ speaker, onClose, relatedEvents = [] }) {
  return (
    <AnimatePresence>
      {speaker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E] shadow-2xl md:grid-cols-12"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close speaker profile"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[4/5] bg-[#050505] md:col-span-5 md:aspect-auto">
              <img
                src={speaker.image}
                alt={speaker.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0B0B0E]/40" />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-7">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-3 py-1 font-mono-label text-[11px] tracking-widest text-[#FF7AC6] uppercase">
                    {speaker.track || 'Keynote Speaker'}
                  </span>
                  <span className="font-mono-label text-xs text-zinc-400 uppercase">
                    {speaker.company}
                  </span>
                </div>

                <h3 className="font-display text-3xl font-bold tracking-tight text-white uppercase sm:text-4xl">
                  {speaker.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#FF2E93]">{speaker.role}</p>

                {speaker.talkTitle && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Featured Session
                    </p>
                    <p className="mt-1 font-heading text-base font-semibold text-white">
                      {speaker.talkTitle}
                    </p>
                  </div>
                )}

                <p className="mt-5 text-sm leading-relaxed text-zinc-300">
                  {speaker.fullBio || speaker.bio}
                </p>

                {relatedEvents.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-2 font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                      Scheduled Sessions
                    </p>
                    <div className="space-y-2">
                      {relatedEvents.map((ev) => (
                        <Link
                          key={ev._id}
                          to={`/events/${ev._id}`}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs transition hover:border-[#FF2E93]/60"
                        >
                          <div>
                            <p className="font-semibold text-white">{ev.title}</p>
                            <p className="text-zinc-400">
                              {ev.date} • {ev.time}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[#FF2E93]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2.5">
                  {speaker.socials?.twitter && (
                    <a
                      href={speaker.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                    >
                      <XBrandIcon className="h-4 w-4" />
                    </a>
                  )}
                  {speaker.socials?.linkedin && (
                    <a
                      href={speaker.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                    >
                      <LinkedInBrandIcon className="h-4 w-4" />
                    </a>
                  )}
                  {speaker.socials?.website && (
                    <a
                      href={speaker.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <Link
                  to="/networking"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#e11d7c]"
                >
                  Connect in Lounge
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
