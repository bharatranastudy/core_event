import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Speaker from '../models/Speaker.js'
import User from '../models/User.js'

dotenv.config()

const speakersSeed = [
  {
    name: 'Elena Vance',
    role: 'VP of Product Architecture',
    company: 'Linearity Labs',
    bio: 'Pioneering spatial interfaces and real-time collaborative design engines for hyper-scale product teams.',
    fullBio:
      'Elena leads product architecture at Linearity Labs, where she oversees multi-player creative tooling used by 2M+ designers worldwide. Previously Head of Design Systems at Atelier Cloud.',
    image: '/images/speaker-elena.jpg',
    track: 'Design Craft',
    featured: true,
    talkTitle: 'The Post-Grid Interface: Designing Fluid AI Workspaces',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    name: 'Marcus Chen',
    role: 'Chief AI Systems Architect',
    company: 'NeuralCore',
    bio: 'Architecting deterministic inference pipelines and latency-free multimodal agents for enterprise software.',
    fullBio:
      'Marcus has spent over a decade building distributed runtime infrastructure and low-latency neural inference clusters powering real-time creative applications.',
    image: '/images/speaker-marcus.jpg',
    track: 'AI & Systems',
    featured: true,
    talkTitle: 'Zero-Latency Intelligence at Scale',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    name: 'Aria Lindqvist',
    role: 'Founder & Creative Partner',
    company: 'Nordic Form Studio',
    bio: 'Crafting iconic editorial brand identities and typography-driven digital flagships across Europe and the US.',
    fullBio:
      'Aria founded Nordic Form Studio in Stockholm and San Francisco, shaping category-defining visual languages for high-growth tech ventures and cultural institutions.',
    image: '/images/speaker-aria.jpg',
    track: 'Growth & Brand',
    featured: true,
    talkTitle: 'Editorial Gravity: Why Bold Typography Wins Trust',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    name: 'Julian Brooks',
    role: 'Principal Design Engineer',
    company: 'Vercel Collective',
    bio: 'Bridging GPU-accelerated motion choreography with accessible, rock-solid React component architecture.',
    fullBio:
      'Julian specializes in high-framerate web animation systems, compiler-assisted design tokens, and ultra-responsive interaction engineering.',
    image: '/images/speaker-julian.jpg',
    track: 'Engineering',
    featured: true,
    talkTitle: 'Motion Systems That Feel Physical on the Web',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    name: 'Soraia Patel',
    role: 'Head of Brand Experience',
    company: 'Kinetix Global',
    bio: 'Leading experiential storytelling, live launch keynotes, and community-led growth movements for B2B leaders.',
    fullBio:
      'Soraia directs global brand experiences and flagship developer summits, transforming product launches into cultural moments.',
    image: '/images/speaker-sora.jpg',
    track: 'Leadership',
    featured: true,
    talkTitle: 'From Launch Event to Cultural Moment',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
]

const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required in server/.env before running the seed script.')
    process.exit(1)
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  const demoPassword = process.env.SEED_DEMO_PASSWORD

  if (!adminEmail || !adminPassword || !demoPassword) {
    console.error(
      'Please define SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_DEMO_PASSWORD in server/.env before seeding.'
    )
    process.exit(1)
  }

  const connected = await connectDB()
  if (!connected) {
    process.exit(1)
  }

  await Promise.all([
    User.deleteMany({}),
    Speaker.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
  ])

  const speakers = await Speaker.insertMany(speakersSeed)

  const eventsSeed = [
    {
      title: 'OPENING KEYNOTE: THE AUTONOMOUS DESIGN ERA',
      subtitle: 'Live from Main Brutalist Hall & 4K Global Stream',
      description:
        'An unfiltered exploration of how AI-native tooling, spatial interfaces, and architectural typography are reshaping software creation in 2026.',
      date: 'NOV 18, 2026',
      time: '09:30 AM — 11:00 AM PST',
      day: 'Day 01',
      location: 'Main Stage A • Pier 27, San Francisco',
      category: 'Keynote',
      status: 'LIVE',
      speaker: speakers[0]._id,
      speakerName: speakers[0].name,
      speakerRole: `${speakers[0].role}, ${speakers[0].company}`,
      image: '/images/event-ai-stage.jpg',
      capacity: 600,
      registeredCount: 412,
      featured: true,
      tags: ['AI Interfaces', 'Keynote', 'Product Vision'],
    },
    {
      title: 'ARCHITECTING HIGH-TRUST BRAND SYSTEMS',
      subtitle: 'Executive Panel Discussion',
      description:
        'Three design and engineering leaders dissect how category-defining startups build unmistakable visual gravity from day one.',
      date: 'NOV 18, 2026',
      time: '02:00 PM — 03:30 PM PST',
      day: 'Day 01',
      location: 'Concrete Forum • Hall B',
      category: 'Panel',
      status: 'UPCOMING',
      speaker: speakers[2]._id,
      speakerName: speakers[2].name,
      speakerRole: `${speakers[2].role}, ${speakers[2].company}`,
      image: '/images/event-keynote.jpg',
      capacity: 350,
      registeredCount: 248,
      featured: true,
      tags: ['Typography', 'Brand Strategy', 'Panel'],
    },
    {
      title: 'DESIGN SYSTEMS MASTERCLASS: TOKENS TO GPU',
      subtitle: 'Hands-on Interactive Lab',
      description:
        'Deep-dive technical workshop covering multi-brand token pipelines, Framer Motion choreography, and accessible dark-mode contrast engineering.',
      date: 'NOV 19, 2026',
      time: '10:00 AM — 01:00 PM PST',
      day: 'Day 02',
      location: 'Studio Lab 04 • Pier 27',
      category: 'Workshop',
      status: 'UPCOMING',
      speaker: speakers[3]._id,
      speakerName: speakers[3].name,
      speakerRole: `${speakers[3].role}, ${speakers[3].company}`,
      image: '/images/event-workshop.jpg',
      capacity: 180,
      registeredCount: 154,
      featured: true,
      tags: ['Design Systems', 'React', 'Motion'],
    },
    {
      title: 'FOUNDERS & DESIGN LEADS AFTER-HOURS SALON',
      subtitle: 'Curated Executive Networking',
      description:
        'Private architectural lounge session pairing startup founders, VPs of Design, and staff engineers for candid 1:1 conversations.',
      date: 'NOV 19, 2026',
      time: '06:30 PM — 09:30 PM PST',
      day: 'Day 02',
      location: 'Atrium Lounge • Pier 27',
      category: 'Networking',
      status: 'UPCOMING',
      speaker: speakers[4]._id,
      speakerName: speakers[4].name,
      speakerRole: `${speakers[4].role}, ${speakers[4].company}`,
      image: '/images/event-networking.jpg',
      capacity: 220,
      registeredCount: 189,
      featured: true,
      tags: ['Networking', 'Founders', 'VIP Lounge'],
    },
    {
      title: 'ZERO-LATENCY MULTIMODAL AI INFRASTRUCTURE',
      subtitle: 'On-Demand Technical Replay',
      description:
        'Inside the distributed systems architecture powering sub-50ms voice, canvas, and code generation pipelines.',
      date: 'NOV 20, 2026',
      time: '11:30 AM — 01:00 PM PST',
      day: 'Day 03',
      location: 'Main Stage A & Stream',
      category: 'Masterclass',
      status: 'REPLAY',
      speaker: speakers[1]._id,
      speakerName: speakers[1].name,
      speakerRole: `${speakers[1].role}, ${speakers[1].company}`,
      image: '/images/hero-stage.jpg',
      capacity: 500,
      registeredCount: 380,
      featured: false,
      tags: ['AI Systems', 'Distributed Infra', 'Replay'],
    },
  ]

  const events = await Event.insertMany(eventsSeed)

  const users = await User.create([
    {
      name: 'ConnectSphere Admin',
      email: adminEmail,
      password: adminPassword,
      phone: '+1 (415) 555-0100',
      role: 'admin',
      title: 'Conference Director',
      company: 'ConnectSphere Summit',
      audienceTrack: 'Founders',
      bio: 'Curating the global ConnectSphere 2026 experience across San Francisco and worldwide live streams.',
      interests: ['Community', 'Curation', 'Live Production'],
    },
    {
      name: 'Maya Lin',
      email: 'maya.lin@atelier.dev',
      password: demoPassword,
      phone: '+1 (415) 555-0142',
      role: 'attendee',
      title: 'Staff Product Designer',
      company: 'Atelier Systems',
      audienceTrack: 'Design Leads',
      bio: 'Building spatial design tools and AI-assisted prototyping canvases.',
      interests: ['Design Systems', 'Spatial UI', 'Prototyping'],
    },
    {
      name: 'Lucas Meyer',
      email: 'lucas@orbitscale.io',
      password: demoPassword,
      phone: '+1 (415) 555-0188',
      role: 'attendee',
      title: 'Co-Founder & CTO',
      company: 'OrbitScale',
      audienceTrack: 'Founders',
      bio: 'Scaling developer-first infrastructure and real-time analytics platforms.',
      interests: ['Distributed Systems', 'Seed Fundraising', 'Developer Tools'],
    },
    {
      name: 'Nadia Okafor',
      email: 'nadia@velvetgrowth.co',
      password: demoPassword,
      phone: '+1 (415) 555-0194',
      role: 'attendee',
      title: 'VP of Brand & Growth',
      company: 'Velvet Growth',
      audienceTrack: 'Marketers',
      bio: 'Turning B2B product launches into high-conversion cultural moments.',
      interests: ['Brand Storytelling', 'Category Creation', 'Product Launches'],
    },
    {
      name: 'Liam Carter',
      email: 'liam@hyperion.eng',
      password: demoPassword,
      phone: '+1 (415) 555-0171',
      role: 'attendee',
      title: 'Principal Frontend Architect',
      company: 'Hyperion',
      audienceTrack: 'Engineers',
      bio: 'Obsessed with 120fps web motion, WebGPU, and zero-runtime CSS systems.',
      interests: ['React 19', 'WebGPU', 'Performance'],
    },
  ])

  await Registration.create([
    {
      user: users[1]._id,
      event: events[0]._id,
      fullName: users[1].name,
      email: users[1].email,
      phone: users[1].phone,
      ticketType: 'VIP All-Access',
      status: 'confirmed',
    },
    {
      user: users[2]._id,
      event: events[2]._id,
      fullName: users[2].name,
      email: users[2].email,
      phone: users[2].phone,
      ticketType: 'General Pass',
      status: 'checked-in',
    },
  ])

  console.log('[ConnectSphere Seed] Successfully seeded speakers, events, users, and registrations.')
  await mongoose.connection.close()
  process.exit(0)
}

runSeed().catch((error) => {
  console.error('[ConnectSphere Seed] Failed:', error)
  process.exit(1)
})
