"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent } from "react";

export function ClosingCtaSection({ monogram }: { monogram: string }) {
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    stiffness: 180,
    damping: 20,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mx-auto max-w-[1280px] px-5 pt-10 pb-24 text-center sm:px-8 sm:pb-28"
    >
      <p className="text-xs font-medium text-[#9a9a9a]">Next step</p>
      <h2 className="font-display section-headline mt-2 text-white">
        Let&apos;s plan <span className="text-[#ff5a14]">your</span> event
      </h2>
      <div className="mt-6 flex justify-center">
        <Link
          href="/enquiry"
          className="inline-flex items-center justify-center rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e54b09]"
        >
          Send an enquiry
        </Link>
      </div>

      {/* Large glossy orange logo mark that tilts with the mouse */}
      <div className="mt-12 flex justify-center [perspective:900px]">
        <motion.div
          aria-hidden="true"
          style={
            prefersReduced
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
          }
          className="relative inline-flex items-center justify-center rounded-[24px] px-8 py-4 select-none"
        >
          <span
            className="font-display text-[92px] leading-none tracking-tight sm:text-[132px]"
            style={{
              background:
                "linear-gradient(155deg, #ffb085 0%, #ff5a14 45%, #b82f00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 18px 34px rgba(255, 90, 20, 0.34))",
            }}
          >
            {monogram}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
