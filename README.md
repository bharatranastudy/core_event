# Core Events — Corporate Event Management Website

A dark, editorial, stage-lit corporate event management website built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase** (Postgres, Storage, Auth), and **Resend**.

Designed for B2B corporate event agencies that organise **seminars**, **annual office events**, **team offsites**, and **conferences** end to end — focused on converting visitors into event enquiries and showcasing past work in a photo/video gallery.

---

## Project Structure

```text
src/
├── app/
│   ├── page.tsx                              # Home (Hero, Marquee, Audience, Featured Events, Gallery teaser, Client bubbles, Tilt CTA)
│   ├── what-we-do/page.tsx                   # Full list of 4 service categories
│   ├── gallery/page.tsx                      # Masonry photo/video gallery with All/Photos/Videos filters & lightbox
│   ├── enquiry/page.tsx                      # "Plan my event" enquiry form with ?type= pre-selection
│   ├── admin/
│   │   ├── login/page.tsx                    # Owner-only Supabase Auth login
│   │   └── (protected)/
│   │       ├── layout.tsx                    # Server-side auth guard + new enquiry counter
│   │       ├── page.tsx                      # Gallery Manager (drag-and-drop upload, resize/compress, thumbnails, reorder, delete)
│   │       ├── enquiries/page.tsx            # Enquiries Inbox (search, status workflow, detail modal, reply, CSV export)
│   │       └── settings/page.tsx             # Notification email & footer contact settings
│   └── api/
│       ├── enquiries/route.ts                # Public enquiry submission (validation, honeypot, rate limiting, DB save, Resend emails)
│       └── admin/                            # Protected admin-only route handlers
├── components/
│   ├── layout/                               # Sticky header, footer, scroll progress bar, page transition, wordmark
│   ├── home/                                 # Hero, giant marquee, audience cards, client bubbles, 3D tilt CTA
│   ├── shared/                               # Reusable service feature card
│   ├── gallery/                              # Masonry grid, inline video player, accessible photo lightbox
│   ├── enquiry/                              # Client-validated enquiry form with retry handling
│   └── admin/                                # Login form, admin nav, gallery manager, enquiries inbox, settings form
├── config/site.ts                            # Company defaults, service copy, audience cards, placeholder assets
├── lib/                                      # Supabase clients, auth guard, validation schemas, rate limiter, Resend emailer, media compression
├── types/database.ts                         # TypeScript interfaces for enquiries, gallery_items, settings
└── middleware.ts                             # Refreshes Supabase cookies and protects /admin/* routes
supabase/
└── migrations/001_initial_schema.sql         # Tables (enquiries, gallery_items, settings), storage bucket, RLS policies
```

---

## 1. Local Development Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The public site renders immediately with stage-lit SVG placeholders even before Supabase keys are added. To enable the enquiry form, gallery uploads, and `/admin`, complete the Supabase and Resend steps below.

---

## 2. Setting Up Supabase (Database, Storage & Auth)

1. Create a new project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (keep secret!) → `SUPABASE_SERVICE_ROLE_KEY`
3. Open **SQL Editor** in the Supabase dashboard, paste the contents of `supabase/migrations/001_initial_schema.sql`, and run it.
   - Before running, update `'owner@yourcompany.com'` inside `public.is_admin()` (and the default row in `public.settings`) to match your real admin email.
   - This creates:
     - `public.enquiries` (with Row-Level Security)
     - `public.gallery_items` (with public read + admin write RLS)
     - `public.settings` + `public.public_settings` view
     - `gallery` Storage bucket (public read, 200 MB ceiling, admin-only upload/delete)

---

## 3. Adding Your Admin User

Only your specific account is allowed into `/admin`:

1. In the Supabase dashboard, go to **Authentication → Providers → Email** and **disable "Allow new users to sign up"** (or disable sign-ups under **Authentication → Settings**) so visitors cannot register accounts.
2. Go to **Authentication → Users → Add user → Create new user**.
3. Enter your admin email and a strong password, and check **Auto Confirm User**.
4. Set `ADMIN_EMAIL` in `.env.local` (and in Vercel) to that exact email address. Both the Next.js middleware, server layouts, and every `/api/admin/*` route verify `user.email === ADMIN_EMAIL`.

---

## 4. Setting Up Resend (Enquiry Emails)

1. Create an account at [resend.com](https://resend.com).
2. Verify your sending domain under **Domains** (recommended for production so confirmation emails reach visitors reliably).
   - For quick testing before verifying a domain, Resend allows sending to your own Resend account email using `onboarding@resend.dev`.
3. Create an API key under **API Keys** and set it in `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL=Core Events <noreply@yourdomain.com>
   ADMIN_NOTIFICATION_EMAIL=owner@yourdomain.com
   ```

---

## 5. Changing the Company Name, Contact Details & Notification Email

You can update these in **two** places:

- **Live via Admin UI (recommended after setup):** Sign in at `/admin`, open **Settings**, update **Company name**, **City / region**, **Notification email**, **Public contact email**, and **Public contact phone**, then click **Save settings**. Changes apply immediately to the footer and incoming enquiry emails.
- **Via Environment Variables (`.env.local` / Vercel):** Update `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_CITY_REGION`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, and `ADMIN_NOTIFICATION_EMAIL` as fallback defaults.

---

## 6. Deploying to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project in [vercel.com](https://vercel.com) (Framework Preset: **Next.js**, Root Directory: `./`).
3. Add all variables from `.env.example` under **Project Settings → Environment Variables** (`NEXT_PUBLIC_SITE_URL` should be your `https://...` Vercel/custom domain).
4. Deploy.
5. In Supabase **Authentication → URL Configuration**, add your production URL to **Site URL** and **Redirect URLs**.
