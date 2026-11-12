import { ArrowUpRight, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InstagramBrandIcon, LinkedInBrandIcon, XBrandIcon } from './SocialIcons'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-20 pb-10">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 pb-16 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#0D0D12]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1.75" />
                  <circle cx="12" cy="12" r="3.5" fill="#FF2E93" />
                </svg>
              </div>
              <span className="font-display text-xl font-extrabold tracking-[0.14em] text-white uppercase">
                CONNECT<span className="text-[#FF2E93]">SPHERE</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">
              The flagship global summit for product architects, design leaders, engineers, and
              brand builders shaping the next era of software and culture.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: XBrandIcon, label: 'X / Twitter', href: 'https://x.com' },
                { icon: LinkedInBrandIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: InstagramBrandIcon, label: 'Instagram', href: 'https://instagram.com' },
                { icon: Globe, label: 'Website', href: 'https://connectsphere.io' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-400 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono-label text-[11px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: 'Events & Sessions', to: '/events' },
                { label: 'Keynote Speakers', to: '/speakers' },
                { label: 'Networking Lounge', to: '/networking' },
                { label: 'My Passes', to: '/my-events' },
                { label: 'Contact Us', to: '/contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 transition hover:text-[#FF2E93]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-4">
            <h4 className="font-mono-label text-[11px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
              Contact & Venue
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2E93]" />
                <span>Pier 27 Embarcadero, San Francisco, CA 94111 & Global 4K Broadcast</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                <a href="mailto:hello@connectsphere.io" className="transition hover:text-white">
                  hello@connectsphere.io
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#FF2E93]" />
                <span>+1 (415) 890-2026</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized Editorial Signoff */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-mono-label text-xs text-zinc-500">
              © {CURRENT_YEAR} CONNECTSPHERE SUMMIT. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6 font-mono-label text-xs text-zinc-500">
              <Link to="/contact" className="transition hover:text-zinc-300">
                CODE OF CONDUCT
              </Link>
              <Link to="/contact" className="transition hover:text-zinc-300">
                PRESS & SPONSORS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
