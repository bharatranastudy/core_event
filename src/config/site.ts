import type { EventType, GalleryItem } from "@/types/database";

const rawCompanyName =
  process.env.NEXT_PUBLIC_COMPANY_NAME?.trim() || "Core Events";

function splitWordmark(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return [parts[0] || "CORE", "EVENTS"];
  }
  const last = parts.pop() || "";
  return [parts.join(" "), last];
}

const [wordmarkTop, wordmarkBottom] = splitWordmark(rawCompanyName);

export const siteConfig = {
  companyName: rawCompanyName,
  wordmarkTop: wordmarkTop.toUpperCase(),
  wordmarkBottom: wordmarkBottom.toUpperCase(),
  monogram: `${wordmarkTop.charAt(0) || "C"}${wordmarkBottom.charAt(0) || "E"}`.toUpperCase(),
  cityRegion: process.env.NEXT_PUBLIC_CITY_REGION?.trim() || "Bengaluru, India",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@yourcompany.com",
  contactPhone:
    process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "+91 98000 00000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
};

export interface ServiceItem {
  slug: string;
  title: string;
  eventType: EventType;
  typicalSize: string;
  tags: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  featuredOnHome: boolean;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "seminars",
    title: "Seminars",
    eventType: "Seminar",
    typicalSize: "Typical size: 50 to 500 guests",
    tags: "Planning, venue, AV, registration",
    description: "Speakers, schedule and on-site crew",
    highlights: [
      "Venue sourcing & stage lighting",
      "AV, sound & presentation cues",
      "Guest check-in & on-site coordination",
    ],
    image: "/placeholders/stage-1.svg",
    imageAlt: "Stage-lit seminar speaker silhouette with blue and amber bokeh",
    featuredOnHome: true,
  },
  {
    slug: "annual-office-events",
    title: "Annual office events",
    eventType: "Annual office event",
    typicalSize: "Typical size: 100 to 1,000 guests",
    tags: "Awards, performances, dinners",
    description: "Theme, stage, catering and entertainment",
    highlights: [
      "Awards show production & scripting",
      "Live performances, DJ & lighting",
      "Hospitality, catering & floor management",
    ],
    image: "/placeholders/stage-2.svg",
    imageAlt: "Annual office gala stage lit in magenta and amber bokeh",
    featuredOnHome: true,
  },
  {
    slug: "team-offsites",
    title: "Team offsites",
    eventType: "Team offsite",
    typicalSize: "Typical size: 20 to 200 guests",
    tags: "Travel and activities",
    description: "Venues, transport and team-building",
    highlights: [
      "Resort & retreat venue curation",
      "Transfers, rooming & itineraries",
      "Facilitated workshops & group activities",
    ],
    image: "/placeholders/stage-3.svg",
    imageAlt: "Team offsite evening gathering with blue and pink stage lights",
    featuredOnHome: false,
  },
  {
    slug: "conferences",
    title: "Conferences",
    eventType: "Conference",
    typicalSize: "Typical size: 200+ guests",
    tags: "Multi-day programmes",
    description: "Tracks, exhibitors and hybrid streaming",
    highlights: [
      "Multi-track scheduling & stage crews",
      "Sponsor & exhibitor booth builds",
      "Live streaming & multi-camera capture",
    ],
    image: "/placeholders/stage-4.svg",
    imageAlt: "Large corporate conference stage with amber and blue spotlights",
    featuredOnHome: false,
  },
];

export interface AudienceCardItem {
  title: string;
  keywords: [string, string, string];
}

export const AUDIENCE_CARDS: AudienceCardItem[] = [
  {
    title: "HR & people teams",
    keywords: ["Annual days", "Awards", "Offsites"],
  },
  {
    title: "Corporate offices",
    keywords: ["Town halls", "Summits", "Dinners"],
  },
  {
    title: "Startups",
    keywords: ["Launches", "Retreats", "All-hands"],
  },
  {
    title: "Institutions",
    keywords: ["Symposiums", "Panels", "Galas"],
  },
];

export const CLIENT_BUBBLES: { label: string; name: string }[] = [
  { label: "A", name: "Acme Corp" },
  { label: "B", name: "Brightline" },
  { label: "C", name: "Crestworks" },
  { label: "D", name: "DataPulse" },
  { label: "E", name: "Evergreen" },
  { label: "F", name: "Foundry Labs" },
  { label: "G", name: "Gridscale" },
  { label: "H", name: "Harbor Tech" },
  { label: "I", name: "Indigo Health" },
  { label: "J", name: "Junction AI" },
  { label: "K", name: "Kestrel Bio" },
  { label: "L", name: "Loomworks" },
];

export const HERO_CARDS: {
  src: string;
  alt: string;
  label: string;
}[] = [
  {
    src: "/placeholders/stage-1.svg",
    alt: "Keynote seminar stage with blue and orange spotlight bokeh",
    label: "Leadership seminar",
  },
  {
    src: "/placeholders/stage-2.svg",
    alt: "Annual awards stage lit with magenta and gold spotlights",
    label: "Annual awards night",
  },
  {
    src: "/placeholders/stage-3.svg",
    alt: "Corporate gathering under blue and pink stage lighting",
    label: "Company town hall",
  },
  {
    src: "/placeholders/stage-4.svg",
    alt: "Conference main stage with warm amber and blue illumination",
    label: "Annual conference",
  },
  {
    src: "/placeholders/stage-5.svg",
    alt: "Team offsite evening event with dramatic stage lighting",
    label: "Team offsite",
  },
  {
    src: "/placeholders/stage-6.svg",
    alt: "Gala dinner and live performance stage lighting",
    label: "Gala dinner",
  },
];

export const PLACEHOLDER_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "placeholder-1",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-1.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-1.svg",
    caption: "Seminar (placeholder)",
    category: "Seminar",
    sort_order: 1,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 900,
    created_at: "2026-01-15T10:00:00.000Z",
    is_placeholder: true,
  },
  {
    id: "placeholder-2",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-3.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-3.svg",
    caption: "Offsite (placeholder)",
    category: "Team offsite",
    sort_order: 2,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 1100,
    created_at: "2026-01-14T10:00:00.000Z",
    is_placeholder: true,
  },
  {
    id: "placeholder-3",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-5.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-5.svg",
    caption: "Conference (placeholder)",
    category: "Conference",
    sort_order: 3,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 1450,
    created_at: "2026-01-13T10:00:00.000Z",
    is_placeholder: true,
  },
  {
    id: "placeholder-4",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-2.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-2.svg",
    caption: "Annual day (placeholder)",
    category: "Annual office event",
    sort_order: 4,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 1450,
    created_at: "2026-01-12T10:00:00.000Z",
    is_placeholder: true,
  },
  {
    id: "placeholder-5",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-4.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-4.svg",
    caption: "Awards night (placeholder)",
    category: "Annual office event",
    sort_order: 5,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 850,
    created_at: "2026-01-11T10:00:00.000Z",
    is_placeholder: true,
  },
  {
    id: "placeholder-6",
    media_type: "image",
    storage_path: "",
    public_url: "/placeholders/stage-6.svg",
    thumbnail_path: null,
    thumbnail_url: "/placeholders/stage-6.svg",
    caption: "Dinner (placeholder)",
    category: "Annual office event",
    sort_order: 6,
    file_size_bytes: null,
    mime_type: "image/svg+xml",
    width: 1200,
    height: 1100,
    created_at: "2026-01-10T10:00:00.000Z",
    is_placeholder: true,
  },
];
