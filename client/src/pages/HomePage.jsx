import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AudienceSection } from '../components/AudienceSection'
import { HeroSection } from '../components/HeroSection'
import { NetworkingSection } from '../components/NetworkingSection'
import { RegistrationSection } from '../components/RegistrationSection'
import { ScheduleSection } from '../components/ScheduleSection'
import { SpeakerModal } from '../components/SpeakerModal'
import { SpeakersSection } from '../components/SpeakersSection'
import { UpcomingEventsSection } from '../components/UpcomingEventsSection'
import { useConferenceData } from '../hooks/useConferenceData'

export function HomePage() {
  const { events, speakers, attendees, loading } = useConferenceData()
  const [selectedSpeaker, setSelectedSpeaker] = useState(null)
  const [preselectedEventId, setPreselectedEventId] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#register') {
      const el = document.getElementById('register')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120)
      }
    }
  }, [location.hash])

  const scrollToRegister = (eventId = '') => {
    if (eventId) setPreselectedEventId(eventId)
    const el = document.getElementById('register')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const relatedEvents = selectedSpeaker
    ? events.filter((e) => e.speakerName === selectedSpeaker.name)
    : []

  return (
    <div className="bg-[#050505]">
      <HeroSection onRegisterClick={() => scrollToRegister()} />

      {loading && events.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF2E93]" />
        </div>
      ) : (
        <>
          <UpcomingEventsSection
            events={events}
            onSelectEventForRegister={(id) => scrollToRegister(id)}
          />
          <SpeakersSection
            speakers={speakers}
            onSelectSpeaker={(speaker) => setSelectedSpeaker(speaker)}
          />
          <AudienceSection />
          <ScheduleSection events={events} />
          <NetworkingSection attendees={attendees} speakers={speakers} />
          <RegistrationSection events={events} preselectedEventId={preselectedEventId} />
        </>
      )}

      <SpeakerModal
        speaker={selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        relatedEvents={relatedEvents}
      />
    </div>
  )
}
