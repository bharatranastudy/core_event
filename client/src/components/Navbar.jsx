import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LogOut, Menu, ShieldCheck, Ticket, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'EVENTS', to: '/events' },
  { label: 'SPEAKERS', to: '/speakers' },
  { label: 'NETWORKING', to: '/networking' },
  { label: 'CONTACT US', to: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleSaveSpot = () => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById('register')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    navigate('/#register')
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl'
          : 'border-b border-white/5 bg-[#050505]/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Conference Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-[#0D0D12] transition group-hover:border-[#FF2E93]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1.75" />
              <circle cx="12" cy="12" r="3.5" fill="#FF2E93" />
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#FF2E93" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-extrabold tracking-[0.14em] text-white uppercase sm:text-lg">
              CONNECT<span className="text-[#FF2E93]">SPHERE</span>
            </span>
            <span className="font-mono-label text-[9px] tracking-[0.26em] text-zinc-400 uppercase">
              SUMMIT // 2026
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative font-heading text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
                  isActive ? 'text-[#FF2E93]' : 'text-zinc-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#FF2E93]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/my-events"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 font-heading text-xs font-semibold tracking-wider text-zinc-200 uppercase transition hover:border-white/40 hover:text-white"
              >
                <Ticket className="h-3.5 w-3.5 text-[#FF2E93]" />
                My Passes
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-3.5 py-2 font-heading text-xs font-semibold tracking-wider text-[#FF7AC6] uppercase transition hover:bg-[#FF2E93]/20"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                title={`Signed in as ${user?.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-[#FF2E93] hover:text-[#FF2E93]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 font-heading text-xs font-semibold tracking-[0.14em] text-zinc-200 uppercase transition hover:border-white/40 hover:text-white"
            >
              <User className="h-3.5 w-3.5" />
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={handleSaveSpot}
            className="group inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-5 py-2.5 font-heading text-xs font-bold tracking-[0.16em] text-white uppercase shadow-[0_0_28px_rgba(255,46,147,0.45)] transition hover:bg-[#e11d7c]"
          >
            SAVE MY SPOT
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] text-white lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#070709] lg:hidden"
          >
            <div className="space-y-2 px-4 py-6 sm:px-6">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 font-display text-lg font-bold tracking-wider uppercase transition ${
                      isActive
                        ? 'bg-[#FF2E93]/15 text-[#FF2E93]'
                        : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="my-4 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/my-events"
                      className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                    >
                      <span>My Registered Events</span>
                      <Ticket className="h-4 w-4 text-[#FF2E93]" />
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center justify-between rounded-xl border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-4 py-3 text-sm font-semibold text-[#FF7AC6]"
                      >
                        <span>Admin Dashboard</span>
                        <ShieldCheck className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={logout}
                      className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-300"
                    >
                      <span>Sign Out ({user?.name})</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      className="rounded-xl border border-white/15 py-3 text-center text-xs font-bold tracking-widest text-white uppercase"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-xl border border-white/15 bg-white/5 py-3 text-center text-xs font-bold tracking-widest text-white uppercase"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveSpot}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF2E93] py-3.5 font-heading text-xs font-bold tracking-[0.18em] text-white uppercase"
                >
                  SAVE MY SPOT
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
