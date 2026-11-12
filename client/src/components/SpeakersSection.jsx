import { motion } from 'framer-motion'
import { ArrowUpRight, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { LinkedInBrandIcon, XBrandIcon } from './SocialIcons'

export function SpeakersSection({ speakers = [], onSelectSpeaker }) {
  return (
    <section id="speakers" className="border-b border-white/10 bg-[#050505] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                03 // KEYNOTE VOICES
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                SPEAKERS
              </h2>
            </div>

            <Link
              to="/speakers"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 font-heading text-xs font-semibold tracking-[0.16em] text-zinc-200 uppercase transition hover:border-[#FF2E93] hover:text-white md:self-auto"
            >
              View Full Lineup
              <ArrowUpRight className="h-4 w-4 text-[#FF2E93] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker, idx) => (
            <motion.article
              key={speaker._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              onClick={() => onSelectSpeaker?.(speaker)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E] transition duration-300 hover:border-[#FF2E93]/60 hover:shadow-[0_0_40px_-15px_rgba(255,46,147,0.45)]"
            >
              {/* Large Portrait Photography */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505]">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono-label text-[10px] tracking-widest text-zinc-200 uppercase backdrop-blur-md">
                    {speaker.track}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white opacity-80 transition group-hover:border-[#FF2E93] group-hover:bg-[#FF2E93] group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold tracking-wide text-[#FF2E93] uppercase">
                    {speaker.role} • {speaker.company}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{speaker.bio}</p>
                </div>

                <div
                  className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    {speaker.socials?.twitter && (
                      <a
                        href={speaker.socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${speaker.name} on X`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                      >
                        <XBrandIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {speaker.socials?.linkedin && (
                      <a
                        href={speaker.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${speaker.name} on LinkedIn`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                      >
                        <LinkedInBrandIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {speaker.socials?.website && (
                      <a
                        href={speaker.socials.website}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${speaker.name} Website`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSpeaker?.(speaker)}
                    className="font-mono-label text-[11px] font-semibold tracking-widest text-zinc-300 uppercase transition hover:text-[#FF2E93]"
                  >
                    Profile Details
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
