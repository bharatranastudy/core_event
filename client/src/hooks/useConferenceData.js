import { useCallback, useEffect, useState } from 'react'
import { conferenceService } from '../services/conferenceService'

export function useConferenceData() {
  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [usingFallback, setUsingFallback] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [eventsRes, speakersRes, networkingRes] = await Promise.all([
        conferenceService.getEvents(),
        conferenceService.getSpeakers(),
        conferenceService.getNetworkingProfiles(),
      ])
      setEvents(eventsRes.events)
      setSpeakers(speakersRes.speakers)
      setAttendees(networkingRes.attendees)
      setUsingFallback(
        Boolean(eventsRes.fromFallback || speakersRes.fromFallback || networkingRes.fromFallback)
      )
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load conference data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    events,
    speakers,
    attendees,
    loading,
    error,
    usingFallback,
    refresh,
  }
}
