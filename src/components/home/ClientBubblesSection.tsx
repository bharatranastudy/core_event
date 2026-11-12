import Link from "next/link";
import { CLIENT_BUBBLES } from "@/config/site";

export function ClientBubblesSection() {
  const firstRow = CLIENT_BUBBLES.slice(0, 8);
  const secondRow = CLIENT_BUBBLES.slice(8, 12);

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
      <div className="text-center">
        <h2 className="font-display section-headline text-white">
          Companies we&apos;ve worked with
        </h2>
      </div>

      {/* Floating logo bubbles */}
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {firstRow.map((client, idx) => (
            <div
              key={client.name}
              title={client.name}
              style={{ animationDelay: `${idx * 0.32}s` }}
              className={`animate-bubble-float flex h-12 w-12 items-center justify-center rounded-full border border-[#262626] bg-[#08080a] text-xs font-semibold text-white/90 transition-colors hover:border-[#0a6cf0] hover:text-white sm:h-14 sm:w-14 ${
                idx % 2 === 1 ? "translate-y-2" : "-translate-y-1"
              }`}
            >
              <span aria-label={client.name}>{client.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {secondRow.map((client, idx) => (
            <div
              key={client.name}
              title={client.name}
              style={{ animationDelay: `${(idx + 3) * 0.35}s` }}
              className={`animate-bubble-float flex h-12 w-12 items-center justify-center rounded-full border border-[#262626] bg-[#08080a] text-xs font-semibold text-white/90 transition-colors hover:border-[#0a6cf0] hover:text-white sm:h-14 sm:w-14 ${
                idx % 2 === 0 ? "translate-y-1" : "-translate-y-1"
              }`}
            >
              <span aria-label={client.name}>{client.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Central blue circular CTA */}
      <div className="mt-10 flex justify-center">
        <div className="flex h-[250px] w-[250px] flex-col items-center justify-center rounded-full bg-[#0a6cf0] p-8 text-center shadow-[0_0_80px_rgba(10,108,240,0.28)] sm:h-[280px] sm:w-[280px]">
          <p className="font-display text-2xl leading-[1.04] text-white sm:text-[28px]">
            Planning an event? Tell us about it
          </p>
          <Link
            href="/enquiry"
            className="mt-5 inline-flex items-center justify-center rounded-[8px] border border-white bg-white px-5 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Send enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
