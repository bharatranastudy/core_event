import api from './api'
import { fallbackAttendees, fallbackEvents, fallbackSpeakers } from './fallbackData'

const isBackendUnavailable = (error) =>
  !error.response || error.response.status === 503 || error.code === 'ECONNABORTED'

export const conferenceService = {
  async checkHealth() {
    try {
      const { data } = await api.get('/health')
      return data
    } catch {
      return { status: 'offline', database: 'disconnected' }
    }
  },

  async getEvents(params = {}) {
    try {
      const { data } = await api.get('/events', { params })
      return { events: data.events || [], fromFallback: false }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        let filtered = [...fallbackEvents]
        if (params.category && params.category !== 'All') {
          filtered = filtered.filter((e) => e.category === params.category)
        }
        if (params.status && params.status !== 'All') {
          filtered = filtered.filter((e) => e.status === params.status)
        }
        if (params.day && params.day !== 'All') {
          filtered = filtered.filter((e) => e.day === params.day)
        }
        if (params.search?.trim()) {
          const q = params.search.toLowerCase()
          filtered = filtered.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q) ||
              e.speakerName.toLowerCase().includes(q) ||
              e.location.toLowerCase().includes(q)
          )
        }
        return { events: filtered, fromFallback: true }
      }
      throw error
    }
  },

  async getEventById(id) {
    try {
      const { data } = await api.get(`/events/${id}`)
      return { event: data.event, fromFallback: false }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        const event = fallbackEvents.find((e) => e._id === id) || null
        if (!event) throw new Error('Event not found.')
        return { event, fromFallback: true }
      }
      throw error
    }
  },

  async createEvent(payload) {
    const { data } = await api.post('/events', payload)
    return data.event
  },

  async updateEvent(id, payload) {
    const { data } = await api.put(`/events/${id}`, payload)
    return data.event
  },

  async deleteEvent(id) {
    const { data } = await api.delete(`/events/${id}`)
    return data
  },

  async getSpeakers(params = {}) {
    try {
      const { data } = await api.get('/speakers', { params })
      return { speakers: data.speakers || [], fromFallback: false }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        let filtered = [...fallbackSpeakers]
        if (params.track && params.track !== 'All') {
          filtered = filtered.filter((s) => s.track === params.track)
        }
        if (params.search?.trim()) {
          const q = params.search.toLowerCase()
          filtered = filtered.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.role.toLowerCase().includes(q) ||
              s.company.toLowerCase().includes(q)
          )
        }
        return { speakers: filtered, fromFallback: true }
      }
      throw error
    }
  },

  async createSpeaker(payload) {
    const { data } = await api.post('/speakers', payload)
    return data.speaker
  },

  async updateSpeaker(id, payload) {
    const { data } = await api.put(`/speakers/${id}`, payload)
    return data.speaker
  },

  async deleteSpeaker(id) {
    const { data } = await api.delete(`/speakers/${id}`)
    return data
  },

  async createRegistration(payload) {
    try {
      const { data } = await api.post('/registrations', payload)
      return { ...data, fromFallback: false }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        // Store locally in session preview mode when MongoDB is not yet connected
        const matchedEvent = fallbackEvents.find((e) => e._id === payload.eventId) || fallbackEvents[0]
        const localReg = {
          _id: `local-${Date.now()}`,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          ticketType: payload.ticketType || 'General Pass',
          ticketCode: `CS26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          status: 'confirmed',
          event: matchedEvent,
          createdAt: new Date().toISOString(),
        }
        const existing = JSON.parse(localStorage.getItem('cs_local_registrations') || '[]')
        localStorage.setItem('cs_local_registrations', JSON.stringify([localReg, ...existing]))
        return {
          message: 'Pass reserved in local preview mode. Connect MongoDB for persistent cloud storage.',
          registration: localReg,
          fromFallback: true,
        }
      }
      throw error
    }
  },

  async getMyRegistrations() {
    try {
      const { data } = await api.get('/registrations/my')
      return { registrations: data.registrations || [], fromFallback: false }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        const local = JSON.parse(localStorage.getItem('cs_local_registrations') || '[]')
        return { registrations: local, fromFallback: true }
      }
      throw error
    }
  },

  async getAllRegistrations(params = {}) {
    const { data } = await api.get('/registrations', { params })
    return data.registrations || []
  },

  async updateRegistrationStatus(id, status) {
    const { data } = await api.patch(`/registrations/${id}`, { status })
    return data.registration
  },

  async deleteRegistration(id) {
    const { data } = await api.delete(`/registrations/${id}`)
    return data
  },

  async getAdminStats() {
    const { data } = await api.get('/admin/stats')
    return data
  },

  async getNetworkingProfiles(params = {}) {
    try {
      const { data } = await api.get('/networking/attendees', { params })
      return {
        attendees: data.attendees || [],
        speakers: data.speakers || [],
        fromFallback: false,
      }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        let attendees = [...fallbackAttendees]
        if (params.track && params.track !== 'All') {
          attendees = attendees.filter((a) => a.audienceTrack === params.track)
        }
        if (params.search?.trim()) {
          const q = params.search.toLowerCase()
          attendees = attendees.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.title.toLowerCase().includes(q) ||
              a.company.toLowerCase().includes(q)
          )
        }
        return { attendees, speakers: fallbackSpeakers, fromFallback: true }
      }
      throw error
    }
  },

  async connectWithProfile(payload) {
    const { data } = await api.post('/networking/connect', payload)
    return data
  },

  async getMyConnections() {
    const { data } = await api.get('/networking/connections')
    return data.connections || []
  },
}
