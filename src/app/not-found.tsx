import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#e8508c]">
        404
      </p>
      <h1 className="font-display page-headline mt-3 text-white">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-[#9a9a9a]">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#e54b09]"
        >
          Back to home
        </Link>
        <Link
          href="/enquiry"
          className="rounded-[8px] border border-[#262626] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:border-white/40"
        >
          Plan my event
        </Link>
      </div>
    </section>
  );
}
