import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, Compass, Megaphone, Rocket } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from './Reveal'

const audienceCards = [
  {
    id: 'Founders',
    index: '01',
    icon: Rocket,
    title: 'Founders',
    tagline: 'Category vision, AI moats & founder-led storytelling.',
    highlights: [
      'Private founder roundtables & investor intros',
      'Zero-to-one product launch playbooks',
      'Scaling engineering and design culture early',
    ],
  },
  {
    id: 'Design Leads',
    index: '02',
    icon: Compass,
    title: 'Design Leads',
    tagline: 'Spatial interfaces, multi-brand systems & editorial craft.',
    highlights: [
      'Hands-on token & motion architecture labs',
      'AI-native prototyping workflows',
      'Leading high-autonomy product design teams',
    ],
  },
  {
    id: 'Marketers',
    index: '03',
    icon: Megaphone,
    title: 'Marketers',
    tagline: 'Brand gravity, launch choreography & community momentum.',
    highlights: [
      'Turning technical releases into cultural moments',
      'High-converting narrative & positioning clinics',
      'Creator & developer ecosystem growth models',
    ],
  },
  {
    id: 'Engineers',
    index: '04',
    icon: Code2,
    title: 'Engineers',
    tagline: 'Sub-50ms inference, WebGPU & resilient frontend systems.',
    highlights: [
      'Production multimodal AI pipelines',
      '120fps React & GPU motion engineering',
      'Distributed reliability at global conference scale',
    ],
  },
]

export function AudienceSection({ onSelectTrack }) {
  const [activeId, setActiveId] = useState('Design Leads')

  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
                04 // CURATED TRACKS
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
                WOULD BE USEFUL FOR
              </h2>
            </div>
            <p className="max-w-md text-sm text-zinc-400">
              Every session is engineered for cross-functional builders. Select a discipline to
              preview its tailored summit outcomes.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audienceCards.map((card, idx) => {
            const Icon = card.icon
            const isActive = activeId === card.id
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => {
                  setActiveId(card.id)
                  onSelectTrack?.(card.id)
                }}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-6 transition-all duration-300 sm:p-7 ${
                  isActive
                    ? 'border-[#FF2E93] bg-gradient-to-b from-[#FF2E93]/12 to-[#0B0B0E] shadow-[0_0_40px_-15px_rgba(255,46,147,0.4)]'
                    : 'border-white/10 bg-[#0B0B0E] hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-xs tracking-widest text-zinc-500">
                      {card.index}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                        isActive
                          ? 'border-[#FF2E93] bg-[#FF2E93] text-white'
                          : 'border-white/10 bg-white/[0.03] text-[#FF2E93] group-hover:border-[#FF2E93]/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-7 font-display text-2xl font-bold tracking-tight text-white uppercase">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{card.tagline}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                    {card.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2E93]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex items-center justify-between pt-2 font-mono-label text-[11px] font-semibold tracking-widest uppercase">
                  <span className={isActive ? 'text-[#FF7AC6]' : 'text-zinc-400'}>
                    {isActive ? 'ACTIVE TRACK' : 'EXPLORE TRACK'}
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isActive ? 'text-[#FF2E93]' : 'text-zinc-500 group-hover:text-white'
                    }`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
