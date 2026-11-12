import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { ServiceFeatureCard } from "@/components/shared/ServiceFeatureCard";
import { SERVICES } from "@/config/site";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Seminars, annual office events, team offsites, and multi-day corporate conferences planned and run end to end.",
};

export default function WhatWeDoPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <div className="text-center">
          <p className="text-xs font-medium text-[#9a9a9a]">Services</p>
          <h1 className="font-display page-headline mt-2 text-white">
            What we do
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#9a9a9a]">
            End-to-end planning, production, and on-site execution for company
            events of every scale.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {SERVICES.map((service) => (
            <ServiceFeatureCard
              key={service.slug}
              service={service}
              showHighlights
            />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
