export type EventType =
  | "Seminar"
  | "Annual office event"
  | "Conference"
  | "Team offsite"
  | "Other";

export const EVENT_TYPES: EventType[] = [
  "Seminar",
  "Annual office event",
  "Conference",
  "Team offsite",
  "Other",
];

export type EnquiryStatus = "New" | "Contacted" | "Won" | "Lost";

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  "New",
  "Contacted",
  "Won",
  "Lost",
];

export type GalleryMediaType = "image" | "video";

export type GalleryCategory =
  | "Seminar"
  | "Annual office event"
  | "Team offsite"
  | "Conference"
  | "General";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Seminar",
  "Annual office event",
  "Team offsite",
  "Conference",
  "General",
];

export interface GalleryItem {
  id: string;
  media_type: GalleryMediaType;
  storage_path: string;
  public_url: string;
  thumbnail_path: string | null;
  thumbnail_url: string | null;
  caption: string;
  category: string;
  sort_order: number;
  file_size_bytes: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at?: string;
  is_placeholder?: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  company: string;
  work_email: string;
  phone: string | null;
  event_type: EventType;
  expected_guests: number | null;
  preferred_date: string | null;
  city_venue: string | null;
  message: string;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  company_name: string;
  city_region: string;
  notification_email: string;
  contact_email: string;
  contact_phone: string;
  updated_at?: string;
}

export interface PublicSiteSettings {
  company_name: string;
  city_region: string;
  contact_email: string;
  contact_phone: string;
}
