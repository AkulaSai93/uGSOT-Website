"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { Campus } from "./campuses";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/** a crosshair at a corner of the frame, centred on the corner point */
function Cross({ at }: { at: string }) {
  return (
    <span
      data-cross
      aria-hidden
      className={`pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 ${at}`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink/40" />
    </span>
  );
}

/**
 * Recognitions & Achievements — the university page's accreditations and
 * rankings, as published there (NAAC, NBA, The Week 2025, Outlook India 2025).
 *
 * Layout: the heading centred, then one ruled panel rather than cards (after
 * quadcse.com's "at a glance" strip): a hairline frame with a crosshair at
 * each corner, and hairlines between the cells. Three across and two down on
 * desktop, two across on phones. Each cell: its kind in small spaced capitals,
 * the figure large (a rank's # in red), what it is, and who gave it. The last
 * cell, in the brand red, is the call to apply.
 *
 * Motion (GSAP): the frame's lines draw out from the middle, then the cells
 * fade up one after another and each rank counts up from zero. Reduced motion:
 * shown as they are.
 */
export function CampusRecognitions({ campus }: { campus: Campus }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = {
          trigger: "[data-panel]",
          start: "top 80%",
          toggleActions: "play none none none",
        };
        gsap
          .timeline({ scrollTrigger: st, defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-rule-x]",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2 },
            0,
          )
          .fromTo(
            "[data-rule-y]",
            { scaleY: 0 },
            { scaleY: 1, duration: 1.2 },
            0,
          )
          .fromTo(
            "[data-cross]",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8 },
            0.3,
          )
          .fromTo(
            "[data-cell]",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07 },
            0.25,
          );
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const n = { v: 0 };
          gsap.to(n, {
            v: Number(el.dataset.count),
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: st,
            onUpdate: () => {
              el.textContent = String(Math.round(n.v));
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="recognitions" className="bg-canvas py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading title="Recognitions &" accent="Achievements" />

        {/* the panel: a hairline frame, crosshairs at its corners */}
        <div data-panel className="relative mx-2 mt-10 lg:mx-0 lg:mt-14">
          <span
            data-rule-x
            aria-hidden
            className="absolute -inset-x-3 top-0 h-px bg-ink/15 lg:-inset-x-5"
          />
          <span
            data-rule-x
            aria-hidden
            className="absolute -inset-x-3 bottom-0 h-px bg-ink/15 lg:-inset-x-5"
          />
          <span
            data-rule-y
            aria-hidden
            className="absolute -inset-y-3 left-0 w-px bg-ink/15 lg:-inset-y-5"
          />
          <span
            data-rule-y
            aria-hidden
            className="absolute -inset-y-3 right-0 w-px bg-ink/15 lg:-inset-y-5"
          />
          <Cross at="left-0 top-0" />
          <Cross at="left-full top-0" />
          <Cross at="left-0 top-full" />
          <Cross at="left-full top-full" />

          {/* the cells, hairlines between them */}
          <ul className="grid grid-cols-2 gap-px bg-ink/10 lg:grid-cols-3">
            {campus.recognitions.map((r) => {
              const rank = typeof r.figure === "number";
              return (
                <li
                  key={r.title}
                  data-cell
                  className="flex flex-col bg-canvas p-4 sm:p-5 lg:px-7 lg:py-6"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[11px]">
                    {r.kind}
                  </span>
                  <span className="mt-2.5 font-display text-[clamp(1.875rem,3.2vw,2.75rem)] font-bold leading-none tracking-[-0.04em] text-ink">
                    {rank ? (
                      <>
                        <span className="text-accent">#</span>
                        <span data-count={r.figure}>{r.figure}</span>
                      </>
                    ) : (
                      r.figure
                    )}
                  </span>
                  <span className="mt-2.5 text-[13px] font-semibold leading-snug text-ink sm:text-[14px]">
                    {rank
                      ? `Ranked ${ordinal(Number(r.figure))} ${r.title}`
                      : r.title}
                  </span>
                  <span className="mt-0.5 text-[12px] leading-snug text-body">
                    {r.by}
                  </span>
                </li>
              );
            })}

            {/* the last cell: the call to apply */}
            <li
              data-cell
              className="flex flex-col justify-between gap-4 bg-accent p-4 text-white sm:p-5 lg:px-7 lg:py-6"
            >
              <p className="font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                Your journey
                <span className="block font-[family-name:var(--font-bricolage)] font-semibold">
                  could start here.
                </span>
              </p>
              <Link
                href="#apply"
                className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-[6px] bg-white px-3.5 py-2.5 sm:px-4 text-[14px] font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
              >
                Apply Now
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
