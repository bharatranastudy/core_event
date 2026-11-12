import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "@/config/site";

export function ServiceFeatureCard({
  service,
  showHighlights = false,
}: {
  service: ServiceItem;
  showHighlights?: boolean;
}) {
  const isPlaceholder = service.image.includes("/placeholders/");

  return (
    <article
      id={service.slug}
      className="group grid overflow-hidden rounded-[12px] border border-[#262626] bg-[#060608] transition-colors hover:border-white/25 md:grid-cols-12"
    >
      <div className="relative min-h-[240px] overflow-hidden bg-[#0a0a0e] sm:min-h-[300px] md:col-span-7">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {isPlaceholder && (
          <span className="absolute bottom-3 left-3 rounded-[4px] bg-black/60 px-2 py-0.5 text-[11px] text-[#9a9a9a]">
            Photo placeholder
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8 md:col-span-5 md:p-10">
        <p className="text-xs text-[#9a9a9a]">{service.typicalSize}</p>
        <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">
          {service.title}
        </h3>
        <div className="mt-3">
          <span className="inline-block rounded-full bg-[#e8508c] px-3 py-1 text-[11px] font-medium text-white">
            {service.tags}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#d4d4d4]">
          {service.description}
        </p>

        {showHighlights && (
          <ul className="mt-4 space-y-1.5 text-xs text-[#9a9a9a]">
            {service.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a14]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Link
            href={`/enquiry?type=${encodeURIComponent(service.eventType)}`}
            className="inline-flex items-center justify-center rounded-[8px] border border-white/25 bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#0a6cf0] hover:bg-[#0a6cf0]"
          >
            Plan this event
          </Link>
        </div>
      </div>
    </article>
  );
}
