export function StatusBadge({ status }) {
  const normalized = (status || 'UPCOMING').toUpperCase()

  if (normalized === 'LIVE') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/50 bg-[#FF2E93]/15 px-3 py-1 font-mono-label text-[11px] font-semibold tracking-widest text-[#FF7AC6] uppercase backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E93] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF2E93]" />
        </span>
        LIVE
      </span>
    )
  }

  if (normalized === 'REPLAY') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono-label text-[11px] font-semibold tracking-widest text-zinc-200 uppercase backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        REPLAY
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono-label text-[11px] font-semibold tracking-widest text-white uppercase backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FF2E93]" />
      UPCOMING
    </span>
  )
}
