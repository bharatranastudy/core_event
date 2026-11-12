import { AUDIENCE_CARDS } from "@/config/site";

export function AudienceCards() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <div className="text-center">
        <p className="text-xs font-medium text-[#9a9a9a]">Who we work with</p>
        <h2 className="font-display section-headline mt-2 text-white">
          Built for companies
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-[8px] border border-[#262626] sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE_CARDS.map((card, index) => (
          <div
            key={card.title}
            tabIndex={0}
            className={`group relative flex min-h-[190px] flex-col items-center justify-center border-[#262626] bg-black p-6 text-center transition-colors duration-200 hover:bg-[#0a6cf0] focus-visible:bg-[#0a6cf0] ${
              index > 0 ? "border-t sm:border-t-0 lg:border-l" : ""
            } ${index === 1 ? "sm:border-l" : ""} ${
              index >= 2 ? "sm:border-t lg:border-t-0" : ""
            } ${index === 3 ? "sm:border-l" : ""}`}
          >
            <h3 className="font-display text-2xl text-white transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 sm:text-3xl">
              {card.title}
            </h3>
            <p className="mt-2 max-h-0 overflow-hidden text-xs font-medium text-white/95 opacity-0 transition-all duration-200 group-hover:max-h-12 group-hover:opacity-100 group-focus-visible:max-h-12 group-focus-visible:opacity-100">
              {card.keywords.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
