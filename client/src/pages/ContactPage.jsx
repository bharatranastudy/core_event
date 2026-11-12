import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'General Inquiry', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="border-b border-white/10 pb-10">
          <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
            GET IN TOUCH
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            CONTACT US
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Questions about group passes, sponsorship showcases, press accreditation, or speaker
            submissions? Reach the ConnectSphere production desk directly.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <MapPin className="h-5 w-5 text-[#FF2E93]" />
              <h2 className="mt-3 font-display text-xl font-bold text-white uppercase">
                Main Venue
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Pier 27 Cruise Terminal & Brutalist Pavilion, The Embarcadero, San Francisco, CA
                94111
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <Mail className="h-5 w-5 text-[#FF2E93]" />
              <h2 className="mt-3 font-display text-xl font-bold text-white uppercase">
                Direct Channels
              </h2>
              <p className="mt-2 text-sm text-zinc-300">General: hello@connectsphere.io</p>
              <p className="mt-1 text-sm text-zinc-300">Sponsors: partners@connectsphere.io</p>
              <p className="mt-1 text-sm text-zinc-300">Press: media@connectsphere.io</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7">
              <Phone className="h-5 w-5 text-[#FF2E93]" />
              <h2 className="mt-3 font-display text-xl font-bold text-white uppercase">
                Concierge Desk
              </h2>
              <p className="mt-2 text-sm text-zinc-400">+1 (415) 890-2026 (Mon–Fri, 9am–6pm PST)</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-7 sm:p-10">
              {sent ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#FF2E93]" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-white uppercase">
                    Message Received
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Thank you, {form.name}. Our summit producer team will reply to {form.email}{' '}
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false)
                      setForm({ name: '', email: '', topic: 'General Inquiry', message: '' })
                    }}
                    className="mt-6 rounded-full border border-white/15 px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase hover:border-[#FF2E93]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jordan Blake"
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jordan@company.com"
                        className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
                      Inquiry Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white outline-none focus:border-[#FF2E93]"
                    >
                      <option>General Inquiry</option>
                      <option>Group & Enterprise Passes</option>
                      <option>Sponsorship & Exhibitor Booths</option>
                      <option>Press & Media Pass</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-mono-label text-[11px] text-zinc-400 uppercase">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full rounded-xl border border-white/15 bg-[#050505] p-4 text-sm text-white outline-none focus:border-[#FF2E93]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF2E93] py-4 font-heading text-xs font-bold tracking-[0.2em] text-white uppercase shadow-[0_0_28px_rgba(255,46,147,0.4)] transition hover:bg-[#e11d7c]"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
