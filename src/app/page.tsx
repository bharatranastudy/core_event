import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { GiantMarquee } from "@/components/home/GiantMarquee";
import { AudienceCards } from "@/components/home/AudienceCards";
import { ClientBubblesSection } from "@/components/home/ClientBubblesSection";
import { ClosingCtaSection } from "@/components/home/ClosingCtaSection";
import { ServiceFeatureCard } from "@/components/shared/ServiceFeatureCard";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageTransition } from "@/components/layout/PageTransition";
import { SERVICES } from "@/config/site";
import { getGalleryItems } from "@/lib/gallery";
import { getPublicSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

function computeMonogram(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CE";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default async function HomePage() {
  const [settings, gallery] = await Promise.all([
    getPublicSettings(),
    getGalleryItems({ limit: 6, fallbackToPlaceholders: true }),
  ]);

  const featuredServices = SERVICES.filter((s) => s.featuredOnHome);
  const monogram = computeMonogram(settings.company_name);

  return (
    <PageTransition>
      <HeroSection cityRegion={settings.city_region} />

      <GiantMarquee />

      <AudienceCards />

      {/* Events we organise */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="font-display section-headline text-center text-white">
          Events we organise
        </h2>

        <div className="mt-10 space-y-6">
          {featuredServices.map((service) => (
            <ServiceFeatureCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/what-we-do"
            className="inline-flex items-center justify-center rounded-[8px] border border-[#262626] bg-transparent px-5 py-2.5 text-xs font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            See everything we do
          </Link>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-medium text-[#9a9a9a]">Recent work</p>
          <h2 className="font-display section-headline mt-2 text-white">
            Gallery
          </h2>
        </div>

        <div className="mt-10">
          <GalleryGrid
            items={gallery.items}
            usingPlaceholders={gallery.usingPlaceholders}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#e54b09]"
          >
            Open gallery
          </Link>
        </div>
      </section>

      <ClientBubblesSection />

      <ClosingCtaSection monogram={monogram} />
    </PageTransition>
  );
}
