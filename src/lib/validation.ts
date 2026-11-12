import { z } from "zod";
import { ENQUIRY_STATUSES, EVENT_TYPES, GALLERY_CATEGORIES } from "@/types/database";

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
] as const;

export const ACCEPTED_MEDIA_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
] as const;

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(120, "Name is too long."),
  company: z
    .string()
    .trim()
    .min(2, "Please enter your company name.")
    .max(150, "Company name is too long."),
  work_email: z
    .string()
    .trim()
    .email("Please enter a valid work email address.")
    .max(180, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .default(""),
  event_type: z.enum(EVENT_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an event type." }),
  }),
  expected_guests: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = typeof val === "number" ? val : Number(String(val).trim());
      return Number.isFinite(num) ? Math.round(num) : NaN;
    })
    .refine(
      (val) => val === null || (!Number.isNaN(val) && val > 0 && val <= 100000),
      "Expected guests must be a positive number."
    ),
  preferred_date: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Please enter a valid date."
    ),
  city_venue: z
    .string()
    .trim()
    .max(180, "City or venue is too long.")
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few details about your event (at least 10 characters).")
    .max(4000, "Message is too long (maximum 4,000 characters)."),
  // Honeypot field: must remain empty
  website: z.string().optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type ParsedEnquiryInput = z.output<typeof enquirySchema>;

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES as [string, ...string[]]).optional(),
  notes: z.string().max(4000).optional(),
});

export const settingsSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(120),
  city_region: z
    .string()
    .trim()
    .min(2, "City or region must be at least 2 characters.")
    .max(120),
  notification_email: z
    .string()
    .trim()
    .email("Please enter a valid notification email."),
  contact_email: z
    .string()
    .trim()
    .email("Please enter a valid public contact email."),
  contact_phone: z
    .string()
    .trim()
    .min(5, "Please enter a valid contact phone number.")
    .max(40),
});

export const galleryItemCreateSchema = z.object({
  media_type: z.enum(["image", "video"]),
  storage_path: z.string().min(1),
  public_url: z.string().url(),
  thumbnail_path: z.string().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  caption: z.string().trim().max(300).optional().default(""),
  category: z
    .enum(GALLERY_CATEGORIES as [string, ...string[]])
    .optional()
    .default("General"),
  file_size_bytes: z.number().int().nonnegative().nullable().optional(),
  mime_type: z.string().max(100).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

export const galleryItemUpdateSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  category: z.enum(GALLERY_CATEGORIES as [string, ...string[]]).optional(),
});

export const galleryReorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});
