import Link from "next/link";
import type { PublicSiteSettings } from "@/types/database";
import { BrandWordmark } from "./BrandWordmark";

export function SiteFooter({ settings }: { settings: PublicSiteSettings }) {
  return (
    <footer className="border-t border-[#262626] bg-black">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h2 className="font-display text-xl tracking-wide text-white">
              What we do
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9a9a9a]">
              <li>
                <Link
                  href="/what-we-do#seminars"
                  className="transition-colors hover:text-white"
                >
                  Seminars
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do#annual-office-events"
                  className="transition-colors hover:text-white"
                >
                  Annual events
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do#team-offsites"
                  className="transition-colors hover:text-white"
                >
                  Team offsites
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do#conferences"
                  className="transition-colors hover:text-white"
                >
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-wide text-white">
              Work
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9a9a9a]">
              <li>
                <Link
                  href="/gallery?type=image"
                  className="transition-colors hover:text-white"
                >
                  Photos
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery?type=video"
                  className="transition-colors hover:text-white"
                >
                  Videos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-wide text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9a9a9a]">
              <li>
                <Link
                  href="/enquiry"
                  className="transition-colors hover:text-white"
                >
                  Send an enquiry
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {settings.contact_email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="text-[#9a9a9a]/80">{settings.city_region}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-wide text-white">
              Team
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#9a9a9a]">
              <li>
                <Link
                  href="/admin"
                  className="transition-colors hover:text-white"
                >
                  Admin login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#262626] pt-8 sm:flex-row sm:items-center">
          <Link href="/" className="rounded-[4px]">
            <BrandWordmark companyName={settings.company_name} inline />
          </Link>
          <p className="text-xs text-[#9a9a9a]">
            © {new Date().getFullYear()} {settings.company_name}.{" "}
            {settings.city_region}.
          </p>
        </div>
      </div>
    </footer>
  );
}
