import {
  AlertCircle,
  Calendar,
  Edit3,
  Loader2,
  Mic2,
  Plus,
  RefreshCw,
  Ticket,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { conferenceService } from '../services/conferenceService'

const EVENT_IMAGES = [
  '/images/event-ai-stage.jpg',
  '/images/event-keynote.jpg',
  '/images/event-workshop.jpg',
  '/images/event-networking.jpg',
  '/images/hero-stage.jpg',
]

const SPEAKER_IMAGES = [
  '/images/speaker-elena.jpg',
  '/images/speaker-marcus.jpg',
  '/images/speaker-aria.jpg',
  '/images/speaker-julian.jpg',
  '/images/speaker-sora.jpg',
]

const emptyEvent = {
  title: '',
  subtitle: '',
  description: '',
  date: 'NOV 18, 2026',
  time: '10:00 AM — 11:30 AM PST',
  day: 'Day 01',
  location: 'Main Stage A • Pier 27',
  category: 'Keynote',
  status: 'UPCOMING',
  speakerName: '',
  speakerRole: '',
  image: '/images/event-ai-stage.jpg',
  capacity: 250,
  featured: true,
}

const emptySpeaker = {
  name: '',
  role: '',
  company: '',
  bio: '',
  fullBio: '',
  track: 'Design Craft',
  talkTitle: '',
  image: '/images/speaker-elena.jpg',
}

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('events')
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  })
  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  // Event modal state
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [eventForm, setEventForm] = useState(emptyEvent)
  const [saving, setSaving] = useState(false)

  // Speaker modal state
  const [speakerModalOpen, setSpeakerModalOpen] = useState(false)
  const [editingSpeakerId, setEditingSpeakerId] = useState(null)
  const [speakerForm, setSpeakerForm] = useState(emptySpeaker)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statsData, eventsRes, speakersRes, regsData] = await Promise.all([
        conferenceService.getAdminStats(),
        conferenceService.getEvents(),
        conferenceService.getSpeakers(),
        conferenceService.getAllRegistrations(),
      ])
      setStats(statsData.stats)
      setUsers(statsData.users || [])
      setEvents(eventsRes.events)
      setSpeakers(speakersRes.speakers)
      setRegistrations(regsData)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load live admin analytics. Ensure MongoDB is connected and you are signed in as admin.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const notify = (msg) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(''), 3500)
  }

  // Event CRUD
  const openCreateEvent = () => {
    setEditingEventId(null)
    setEventForm(emptyEvent)
    setEventModalOpen(true)
  }

  const openEditEvent = (ev) => {
    setEditingEventId(ev._id)
    setEventForm({
      title: ev.title || '',
      subtitle: ev.subtitle || '',
      description: ev.description || '',
      date: ev.date || '',
      time: ev.time || '',
      day: ev.day || 'Day 01',
      location: ev.location || '',
      category: ev.category || 'Keynote',
      status: ev.status || 'UPCOMING',
      speakerName: ev.speakerName || '',
      speakerRole: ev.speakerRole || '',
      image: ev.image || EVENT_IMAGES[0],
      capacity: ev.capacity || 250,
      featured: Boolean(ev.featured),
    })
    setEventModalOpen(true)
  }

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingEventId) {
        await conferenceService.updateEvent(editingEventId, eventForm)
        notify('Event updated successfully.')
      } else {
        await conferenceService.createEvent(eventForm)
        notify('New event created successfully.')
      }
      setEventModalOpen(false)
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    try {
      await conferenceService.deleteEvent(id)
      notify('Event removed.')
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.')
    }
  }

  // Speaker CRUD
  const openCreateSpeaker = () => {
    setEditingSpeakerId(null)
    setSpeakerForm(emptySpeaker)
    setSpeakerModalOpen(true)
  }

  const openEditSpeaker = (spk) => {
    setEditingSpeakerId(spk._id)
    setSpeakerForm({
      name: spk.name || '',
      role: spk.role || '',
      company: spk.company || '',
      bio: spk.bio || '',
      fullBio: spk.fullBio || '',
      track: spk.track || 'Design Craft',
      talkTitle: spk.talkTitle || '',
      image: spk.image || SPEAKER_IMAGES[0],
    })
    setSpeakerModalOpen(true)
  }

  const handleSaveSpeaker = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingSpeakerId) {
        await conferenceService.updateSpeaker(editingSpeakerId, speakerForm)
        notify('Speaker updated successfully.')
      } else {
        await conferenceService.createSpeaker(speakerForm)
        notify('Speaker added to roster.')
      }
      setSpeakerModalOpen(false)
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save speaker.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSpeaker = async (id) => {
    try {
      await conferenceService.deleteSpeaker(id)
      notify('Speaker removed.')
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete speaker.')
    }
  }

  // Registration status update
  const handleStatusChange = async (id, status) => {
    try {
      await conferenceService.updateRegistrationStatus(id, status)
      notify(`Registration marked as ${status}.`)
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update registration.')
    }
  }

  const handleDeleteRegistration = async (id) => {
    try {
      await conferenceService.deleteRegistration(id)
      notify('Registration deleted.')
      await loadDashboard()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete registration.')
    }
  }

  const kpis = [
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar },
    { label: 'Total Users', value: stats.totalUsers, icon: Users },
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: Ticket },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Mic2 },
  ]

  return (
    <div className="min-h-screen bg-[#050505] py-12 sm:py-16">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono-label text-xs tracking-[0.25em] text-[#FF2E93] uppercase">
              COMMAND CENTER
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold text-white uppercase sm:text-5xl">
              ADMIN DASHBOARD
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-mono-label text-xs text-zinc-300 uppercase transition hover:border-white/40 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreateEvent}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-white uppercase"
            >
              <Plus className="h-4 w-4" />
              New Event
            </button>
            <button
              type="button"
              onClick={openCreateSpeaker}
              className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/50 bg-[#FF2E93]/10 px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-[#FF7AC6] uppercase"
            >
              <Plus className="h-4 w-4" />
              New Speaker
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {actionMessage && (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono-label text-xs text-emerald-300">
            {actionMessage}
          </div>
        )}

        {/* KPI Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="rounded-2xl border border-white/10 bg-[#0B0B0E] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[11px] tracking-widest text-zinc-400 uppercase">
                    {kpi.label}
                  </span>
                  <Icon className="h-4 w-4 text-[#FF2E93]" />
                </div>
                <p className="mt-4 font-display text-4xl font-extrabold text-white">
                  {kpi.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'events', label: `Events (${events.length})` },
            { id: 'speakers', label: `Speakers (${speakers.length})` },
            { id: 'registrations', label: `Registrations (${registrations.length})` },
            { id: 'users', label: `Users (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 font-heading text-xs font-bold tracking-wider uppercase transition ${
                activeTab === tab.id
                  ? 'bg-[#FF2E93] text-white'
                  : 'border border-white/10 bg-[#0B0B0E] text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
          </div>
        ) : (
          <div className="mt-8">
            {/* EVENTS MANAGEMENT */}
            {activeTab === 'events' && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0B0E]">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="border-b border-white/10 font-mono-label text-[11px] tracking-widest text-zinc-400 uppercase">
                    <tr>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Schedule</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Seats</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {events.map((ev) => (
                      <tr key={ev._id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ev.image}
                              alt={ev.title}
                              className="h-11 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-heading font-bold text-white">{ev.title}</p>
                              <p className="text-xs text-zinc-400">
                                {ev.speakerName} • {ev.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-300">
                          <p>{ev.date}</p>
                          <p className="text-zinc-500">{ev.time}</p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={ev.status} />
                        </td>
                        <td className="px-6 py-4 font-mono-label text-xs text-zinc-300">
                          {ev.registeredCount || 0} / {ev.capacity}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditEvent(ev)}
                              className="rounded-lg border border-white/15 p-2 text-zinc-300 hover:border-[#FF2E93] hover:text-white"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev._id)}
                              className="rounded-lg border border-rose-500/30 p-2 text-rose-300 hover:bg-rose-500/15"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SPEAKERS MANAGEMENT */}
            {activeTab === 'speakers' && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {speakers.map((spk) => (
                  <div
                    key={spk._id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0B0E] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={spk.image}
                        alt={spk.name}
                        className="h-16 w-16 rounded-xl object-cover object-top"
                      />
                      <div>
                        <h3 className="font-display text-lg font-bold text-white uppercase">
                          {spk.name}
                        </h3>
                        <p className="text-xs text-[#FF2E93]">
                          {spk.role} • {spk.company}
                        </p>
                        <span className="mt-1 inline-block font-mono-label text-[10px] text-zinc-400 uppercase">
                          {spk.track}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400">{spk.bio}</p>
                    <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={() => openEditSpeaker(spk)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-zinc-200 hover:border-[#FF2E93]"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpeaker(spk._id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 px-3.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/15"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REGISTRATIONS MANAGEMENT */}
            {activeTab === 'registrations' && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0B0E]">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="border-b border-white/10 font-mono-label text-[11px] tracking-widest text-zinc-400 uppercase">
                    <tr>
                      <th className="px-6 py-4">Attendee</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Pass Code</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {registrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{reg.fullName}</p>
                          <p className="text-xs text-zinc-400">
                            {reg.email} • {reg.phone}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-300">
                          {reg.event?.title || 'Deleted Event'}
                        </td>
                        <td className="px-6 py-4 font-mono-label text-xs text-[#FF7AC6]">
                          {reg.ticketCode}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={reg.status}
                            onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                            className="rounded-lg border border-white/15 bg-[#050505] px-2.5 py-1.5 font-mono-label text-xs text-white outline-none focus:border-[#FF2E93]"
                          >
                            <option value="confirmed">confirmed</option>
                            <option value="checked-in">checked-in</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRegistration(reg._id)}
                            className="rounded-lg border border-rose-500/30 p-2 text-rose-300 hover:bg-rose-500/15"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0B0E]">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-white/10 font-mono-label text-[11px] tracking-widest text-zinc-400 uppercase">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role / Track</th>
                      <th className="px-6 py-4">Company</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                        <td className="px-6 py-4 text-xs text-zinc-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full border border-white/15 px-3 py-1 font-mono-label text-[10px] text-[#FF7AC6] uppercase">
                            {u.role} • {u.audienceTrack}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-300">{u.company}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EVENT MODAL */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0B0E] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-white uppercase">
                {editingEventId ? 'Edit Event' : 'Create Event'}
              </h2>
              <button
                type="button"
                onClick={() => setEventModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-5 space-y-4">
              <input
                type="text"
                required
                placeholder="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
              <textarea
                rows={3}
                required
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#FF2E93]"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  required
                  placeholder="Date (NOV 18, 2026)"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="text"
                  required
                  placeholder="Time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <select
                  value={eventForm.day}
                  onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                >
                  <option>Day 01</option>
                  <option>Day 02</option>
                  <option>Day 03</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  required
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                >
                  <option>Keynote</option>
                  <option>Workshop</option>
                  <option>Panel</option>
                  <option>Networking</option>
                  <option>Masterclass</option>
                </select>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                >
                  <option>UPCOMING</option>
                  <option>LIVE</option>
                  <option>REPLAY</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Speaker Name"
                  value={eventForm.speakerName}
                  onChange={(e) => setEventForm({ ...eventForm, speakerName: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Capacity"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono-label text-[10px] text-zinc-400 uppercase">
                  Event Image Asset
                </label>
                <select
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                >
                  {EVENT_IMAGES.map((img) => (
                    <option key={img} value={img}>
                      {img}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-zinc-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-6 py-2.5 text-xs font-bold text-white uppercase"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingEventId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPEAKER MODAL */}
      {speakerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0B0E] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-white uppercase">
                {editingSpeakerId ? 'Edit Speaker' : 'Add Speaker'}
              </h2>
              <button
                type="button"
                onClick={() => setSpeakerModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpeaker} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Speaker Name"
                  value={speakerForm.name}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <input
                  type="text"
                  required
                  placeholder="Designation / Role"
                  value={speakerForm.role}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, role: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Company"
                  value={speakerForm.company}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, company: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                />
                <select
                  value={speakerForm.track}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, track: e.target.value })}
                  className="rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
                >
                  <option>Design Craft</option>
                  <option>AI & Systems</option>
                  <option>Growth & Brand</option>
                  <option>Engineering</option>
                  <option>Leadership</option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Short Professional Bio"
                value={speakerForm.bio}
                onChange={(e) => setSpeakerForm({ ...speakerForm, bio: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#FF2E93]"
              />

              <select
                value={speakerForm.image}
                onChange={(e) => setSpeakerForm({ ...speakerForm, image: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E93]"
              >
                {SPEAKER_IMAGES.map((img) => (
                  <option key={img} value={img}>
                    {img}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSpeakerModalOpen(false)}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-zinc-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF2E93] px-6 py-2.5 text-xs font-bold text-white uppercase"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingSpeakerId ? 'Save Changes' : 'Add Speaker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
