import Image from "next/image";
import Link from "next/link";
import { HERO_CARDS } from "@/config/site";

export function HeroSection({ cityRegion }: { cityRegion: string }) {
  return (
    <section className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#9a9a9a]">
          Corporate events · {cityRegion}
        </p>
        <h1 className="font-display hero-headline mx-auto max-w-[980px] text-white">
          We run the event.
          <br />
          You enjoy it.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#9a9a9a] sm:text-base">
          Seminars, annual office events and company gatherings, planned and run
          end to end.
        </p>
        <div className="mt-7 flex justify-center">
          <Link
            href="/enquiry"
            className="inline-flex items-center justify-center rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e54b09]"
          >
            Send an enquiry
          </Link>
        </div>
      </div>

      {/* Tilted sideways-drifting stage photo strip */}
      <div
        aria-label="Event highlights strip"
        className="mt-12 overflow-hidden py-6 sm:mt-16"
      >
        <div className="animate-hero-drift gap-5 px-3">
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              aria-hidden={dupIndex === 1}
              className="flex shrink-0 items-center gap-5"
            >
              {HERO_CARDS.map((card, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={`${dupIndex}-${card.label}-${index}`}
                    className={`relative h-[180px] w-[200px] shrink-0 overflow-hidden rounded-[12px] border border-[#262626] bg-[#0a0a0e] shadow-2xl sm:h-[220px] sm:w-[250px] ${
                      isEven
                        ? "-rotate-2 translate-y-2"
                        : "rotate-2 -translate-y-2"
                    }`}
                  >
                    <Image
                      src={card.src}
                      alt={dupIndex === 0 ? card.alt : ""}
                      fill
                      sizes="250px"
                      className="object-cover"
                      priority={dupIndex === 0 && index < 4}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                      <span className="text-[11px] font-medium text-white/90">
                        {card.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
