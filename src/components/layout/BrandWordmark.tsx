import Link from "next/link";

function splitCompanyName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return [parts[0] || "CORE", "EVENTS"];
  }
  const last = parts.pop() || "";
  return [parts.join(" "), last];
}

export function BrandWordmark({
  companyName,
  inline = false,
}: {
  companyName: string;
  inline?: boolean;
}) {
  const [top, bottom] = splitCompanyName(companyName);

  if (inline) {
    return (
      <span className="font-display text-xl tracking-wide text-white">
        {top} <span className="text-[#ff5a14]">{bottom}</span>
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label={`${companyName} — Home`}
      className="inline-flex flex-col leading-[0.88] font-display text-[22px] tracking-wide select-none rounded-[4px]"
    >
      <span className="text-white">{top}</span>
      <span className="text-[#ff5a14]">{bottom}</span>
    </Link>
  );
}
