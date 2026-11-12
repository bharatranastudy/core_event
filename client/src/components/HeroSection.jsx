import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Calendar, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HeroSection({ onRegisterClick }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050505] bg-editorial-grid pt-10 pb-16 sm:pt-14 sm:pb-24">
      {/* Subtle pink ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-[#FF2E93]/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        {/* Top Metadata Strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-3.5 py-1 font-mono-label text-[11px] font-semibold tracking-[0.2em] text-[#FF7AC6] uppercase">
              <Sparkles className="h-3.5 w-3.5 text-[#FF2E93]" />
              EDITION 04 // HYBRID SUMMIT
            </span>
            <span className="inline-flex items-center gap-2 font-mono-label text-xs tracking-wider text-zinc-300 uppercase">
              <Calendar className="h-3.5 w-3.5 text-[#FF2E93]" />
              NOV 18–20, 2026
            </span>
            <span className="inline-flex items-center gap-2 font-mono-label text-xs tracking-wider text-zinc-400 uppercase">
              <MapPin className="h-3.5 w-3.5 text-[#FF2E93]" />
              PIER 27, SAN FRANCISCO & GLOBAL STREAM
            </span>
          </div>

          <span className="hidden font-mono-label text-xs tracking-[0.2em] text-zinc-500 uppercase md:inline">
            2,400+ CREATORS • 40+ SESSIONS
          </span>
        </motion.div>

        {/* Oversized Editorial Typography */}
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            <h1 className="font-display text-[2.6rem] leading-[0.94] font-extrabold tracking-[-0.03em] text-white uppercase sm:text-6xl md:text-7xl xl:text-[5.5rem]">
              WHERE DIGITAL
              <br />
              <span className="text-[#FF2E93]">VISIONARIES</span>
              <br />
              CONVERGE.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-end lg:col-span-4 lg:pb-2"
          >
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              Three immersive days of live keynotes, hands-on systems workshops, and curated
              after-hours networking for founders, design leads, marketers, and engineers.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRegisterClick}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#FF2E93] px-7 py-3.5 font-heading text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_0_36px_rgba(255,46,147,0.5)] transition hover:bg-[#e11d7c]"
              >
                REGISTER NOW
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3.5 font-heading text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:border-[#FF2E93] hover:text-[#FF7AC6]"
              >
                EXPLORE EVENTS
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Main Stage Visual Composition */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0D] sm:mt-12"
        >
          <div className="relative aspect-[16/9] max-h-[580px] w-full overflow-hidden">
            <img
              src="/images/hero-stage.jpg"
              alt="ConnectSphere Main Auditorium Stage"
              className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/75 via-transparent to-[#050505]/40" />

            {/* Top Left Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-3 sm:top-6 sm:left-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/50 bg-black/75 px-3.5 py-1.5 font-mono-label text-[11px] font-semibold tracking-widest text-white uppercase backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF2E93]" />
                MAIN STAGE • 4K HYBRID STREAM
              </span>
            </div>

            {/* Bottom Overlay Telemetry */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end sm:p-8">
              <div>
                <p className="font-mono-label text-[11px] tracking-[0.22em] text-[#FF7AC6] uppercase">
                  FEATURED OPENING NIGHT
                </p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight text-white uppercase sm:text-3xl">
                  THE AUTONOMOUS DESIGN & AI KEYNOTE
                </p>
              </div>

              <div className="flex items-center gap-6 border-t border-white/15 pt-3 sm:border-t-0 sm:pt-0">
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">5</p>
                  <p className="font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                    CURATED TRACKS
                  </p>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <p className="font-display text-2xl font-extrabold text-[#FF2E93]">94%</p>
                  <p className="font-mono-label text-[10px] tracking-widest text-zinc-400 uppercase">
                    PASSES CLAIMED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-between"
        >
          <a
            href="#upcoming-events"
            className="group inline-flex items-center gap-3 font-mono-label text-xs tracking-[0.2em] text-zinc-400 uppercase transition hover:text-white"
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 group-hover:border-[#FF2E93]"
            >
              <ArrowDown className="h-3.5 w-3.5 text-[#FF2E93]" />
            </motion.span>
            SCROLL TO EXPLORE LINEUP
          </a>

          <span className="hidden font-mono-label text-[11px] tracking-[0.2em] text-zinc-600 uppercase sm:inline">
            01 // HERO OVERVIEW
          </span>
        </motion.div>
      </div>
    </section>
  )
}
