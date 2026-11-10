"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, RotateCcw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Get Upto 100% Scholarship" — the site's main section.
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line, the four
 * scholarships with their eligibility text and the "Know More" link (to the
 * uGNET page, as there).
 *
 * Layout: a full-width band in warm yellow (the same as Special Mentorship's).
 * The heading is set like a headline: "Get Upto" above a
 * huge "100%" (its % in brand red) with "Scholarship" under it; on the right,
 * the line and "Check eligibility", with the hero's moving line round its
 * edge. Under a hairline, the four scholarships as the section's original flip
 * cards (see ScholarshipCard) — on phones a row to swipe through, a card at a
 * time.
 *
 * Motion (GSAP, as the band comes into view): the "100" counts up from 0
 * while the heading rises in, then the cards rise in one after another. Under
 * reduced motion everything simply shows, at 100.
 */
const UGNET = "https://sot.upgrad.com/uGNET";

type Scholarship = {
  key: string;
  title: string;
  criteria: string;
  /** Ronnie Screwvala's portrait, shown as a round badge on his card */
  badge?: string;
};

const SCHOLARSHIPS: Scholarship[] = [
  {
    key: "merit",
    title: "Merit-Based Scholarship",
    criteria:
      "Awarded to students with strong academic performance or outstanding achievements. This scholarship recognizes hard work, discipline, and excellence in studies.",
  },
  {
    key: "need",
    title: "Need-Based Scholarship",
    criteria:
      "Designed for students who require financial support to pursue their education. It ensures that deserving learners are not held back due to economic constraints.",
  },
  {
    key: "girls-in-tech",
    title: "Girls in Tech Scholarship",
    criteria:
      "A dedicated scholarship to encourage more young women to enter and excel in technology. It supports aspiring female students who want to build successful careers in tech.",
  },
  {
    key: "innovators",
    title: "Ronnie Screwvala Scholarship for Budding Tech Innovators",
    badge: "/images/scholarships/v3/ronnie-badge.jpg",
    criteria:
      "Given to students who show early talent, creativity, or passion for building innovative tech solutions. It supports future innovators who want to solve real-world problems using technology.",
  },
];

/* ------------------------------------------------------------ a card */

/**
 * The section's first card design, as before: a tall picture (Figma AI
 * artwork) with the name in its clear top third and a frosted-glass "View
 * eligibility" bar across the foot, which turns the card over (a 3D flip) to
 * its red back — the eligibility criteria and Know More; "Back" turns it
 * round again.
 */
function ScholarshipCard({ s }: { s: Scholarship }) {
  const [flipped, setFlipped] = useState(false);
  const inner = useRef<HTMLDivElement>(null);

  const turn = (to: boolean) => {
    setFlipped(to);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gsap.to(inner.current, {
      rotationY: to ? 180 : 0,
      duration: reduced ? 0 : 0.9,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  return (
    <li data-card className="[perspective:1400px] max-sm:w-[78vw] max-sm:shrink-0 max-sm:snap-center">
      <div
        ref={inner}
        className="relative aspect-[4/5] [transform-style:preserve-3d]"
      >
        {/* front: the picture, with the title in its clear top third */}
        <div
          inert={flipped}
          className="group absolute inset-0 overflow-hidden rounded-[6px] bg-ink [backface-visibility:hidden]"
        >
          <Image
            src={`/images/scholarships/v3/${s.key}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="relative flex h-full flex-col justify-between">
            <h3 className="mx-auto max-w-[300px] p-5 text-center font-display text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
              {s.title}
            </h3>
            {/* the badge (Ronnie's card only) sits above the button; the button
                is a bar across the card's foot, edge to edge */}
            <div className="flex flex-col">
              {s.badge && (
                <Image
                  src={s.badge}
                  alt="Ronnie Screwvala"
                  width={88}
                  height={88}
                  className="mb-3 mr-4 size-[88px] self-end rounded-full object-cover ring-2 ring-white/80 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]"
                />
              )}
              <button
                type="button"
                onClick={() => turn(true)}
                aria-expanded={flipped}
                className="flex w-full items-center justify-center gap-2 border-t border-white/20 bg-white/10 px-4 py-3.5 text-[14px] font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                View eligibility
                <RotateCcw
                  size={15}
                  strokeWidth={2}
                  aria-hidden
                  className="-scale-x-100"
                />
              </button>
            </div>
          </div>
        </div>

        {/* back: the eligibility criteria */}
        <div
          inert={!flipped}
          className="absolute inset-0 flex flex-col justify-between rounded-[6px] bg-accent p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div>
            <p className="text-[12.5px] font-semibold text-white/75">
              Eligibility Criteria
            </p>
            <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-[-0.01em]">
              {s.title}
            </h3>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/90">
              {s.criteria}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <a
              href={UGNET}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 rounded-[6px] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-300 hover:text-accent"
            >
              Know More
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                aria-hidden
                className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
            <button
              type="button"
              onClick={() => turn(false)}
              className="text-[13px] font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** the band's warm yellow, as Special Mentorship's */
const YELLOW = "#ffdf8f";

export function Scholarships() {
  const root = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none none" },
        });
        const n = { v: 0 };
        tl.fromTo(q("[data-rise]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1 })
          .to(
            n,
            {
              v: 100,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                if (count.current) count.current.textContent = String(Math.round(n.v));
              },
            },
            0,
          )
          .fromTo(
            q("[data-card]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
            0.35,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="scholarships" style={{ background: YELLOW }} className="relative overflow-hidden py-14 lg:py-24">
      {/* a soft light across the top left, so the yellow reads rich, not flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_15%_0%,rgba(255,255,255,0.45),transparent_70%)]"
      />
      <div className="container-page relative">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
          <h2 className="text-ink max-lg:text-center">
            <span data-rise className="block font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold tracking-[-0.025em]">
              Get Upto
            </span>
            <span data-rise className="mt-1 flex flex-wrap items-end gap-x-5 max-lg:justify-center">
              <span className="font-[family-name:var(--font-bricolage)] text-[clamp(6rem,17vw,14rem)] font-bold leading-[0.82] tracking-[-0.05em] tabular-nums">
                <span ref={count}>100</span>
                <span className="text-accent">%</span>
              </span>
              <span className="pb-[0.12em] font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-bold leading-none tracking-[-0.03em]">
                Scholarship
              </span>
            </span>
          </h2>

          <div data-rise className="max-lg:mx-auto max-lg:max-w-[460px] max-lg:text-center">
            <p className="text-balance text-[15.5px] leading-[1.6] text-ink/80">
              Invest in your future with scholarship opportunities that make quality education more affordable and accessible.
            </p>
            {/* the hero's moving line: a dark streak sweeping round the edge */}
            <a
              href={UGNET}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-6 inline-flex overflow-hidden rounded-[6px] p-[1.5px]"
            >
              <span
                aria-hidden
                style={{ backgroundImage: "conic-gradient(transparent 200deg, #0b0d12)" }}
                className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
              />
              <span className="relative z-[2] inline-flex items-center gap-2 rounded-[5px] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-white">
                Check eligibility
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </div>
        </div>

        {/* below sm, a row to swipe through, a card at a time; above, a grid */}
        <ul className="mt-10 border-t border-ink/15 pt-10 max-sm:-mx-5 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:px-5 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:pt-14">
          {SCHOLARSHIPS.map((s) => (
            <ScholarshipCard key={s.key} s={s} />
          ))}
        </ul>
      </div>
    </section>
  );
}
