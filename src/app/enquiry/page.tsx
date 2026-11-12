import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { EVENT_TYPES, type EventType } from "@/types/database";

export const metadata: Metadata = {
  title: "Plan my event",
  description:
    "Send us an enquiry to organise your seminar, annual office event, team offsite, or corporate conference.",
};

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const requestedType = params.type?.trim() || "";
  const matchedType = EVENT_TYPES.find(
    (t) => t.toLowerCase() === requestedType.toLowerCase()
  );
  const initialEventType: EventType = matchedType || "Seminar";

  return (
    <PageTransition>
      <section className="mx-auto max-w-[780px] px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <div className="text-center">
          <p className="text-xs font-medium text-[#9a9a9a]">
            Tell us what you need
          </p>
          <h1 className="font-display page-headline mt-2 text-white">
            Plan my event
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#9a9a9a]">
            Share your dates, guest count, and goals. We&apos;ll send a tailored
            proposal within one business day.
          </p>
        </div>

        <div className="mt-10">
          <EnquiryForm initialEventType={initialEventType} />
        </div>
      </section>
    </PageTransition>
  );
}
