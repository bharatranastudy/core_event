export function GiantMarquee() {
  const text =
    "Seminars · Annual events · Conferences · Team offsites · ";

  return (
    <section
      aria-label="Event types"
      className="overflow-hidden border-y border-[#262626] bg-black py-4 sm:py-6"
    >
      <div className="animate-marquee">
        {[0, 1].map((idx) => (
          <div
            key={idx}
            aria-hidden={idx === 1}
            className="font-display flex shrink-0 items-center whitespace-nowrap text-[44px] tracking-wide text-white sm:text-[68px] md:text-[84px]"
          >
            <span className="pr-4">{text}</span>
            <span className="pr-4">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
