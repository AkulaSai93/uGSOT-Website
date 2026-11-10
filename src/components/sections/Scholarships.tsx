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
  /** the card's picture (public/images/scholarships/flat) */
  art: string;
  /** Ronnie Screwvala's portrait, shown as a round badge on his card */
  badge?: string;
};

const SCHOLARSHIPS: Scholarship[] = [
  {
    key: "merit",
    title: "Merit-Based Scholarship",
    art: "merit-8.webp",
    criteria:
      "Awarded to students with strong academic performance or outstanding achievements. This scholarship recognizes hard work, discipline, and excellence in studies.",
  },
  {
    key: "need",
    title: "Need-Based Scholarship",
    art: "need-8.webp",
    criteria:
      "Designed for students who require financial support to pursue their education. It ensures that deserving learners are not held back due to economic constraints.",
  },
  {
    key: "girls-in-tech",
    title: "Girls in Tech Scholarship",
    art: "girls-in-tech-8.webp",
    criteria:
      "A dedicated scholarship to encourage more young women to enter and excel in technology. It supports aspiring female students who want to build successful careers in tech.",
  },
  {
    key: "innovators",
    title: "Ronnie Screwvala Scholarship for Budding Tech Innovators",
    art: "innovators-9.webp",
    badge: "/images/scholarships/v3/ronnie-badge.jpg",
    criteria:
      "Given to students who show early talent, creativity, or passion for building innovative tech solutions. It supports future innovators who want to solve real-world problems using technology.",
  },
];

/** the pictures' cream background, which the whole card front takes */
const GROUND = "#fff6e3";

/* ------------------------------------------------------------ a card */

/**
 * The section's first card design, as before: the name over a tall picture and
 * a "View eligibility" bar across the foot, which turns the card over (a 3D
 * flip) to its red back — the
 * eligibility criteria and Know More; "Back" turns it round again.
 *
 * The pictures are Figma AI illustrations in the client's chosen style (after
 * a flat, bold fintech-campaign reference): flat shapes on warm cream (the
 * client's pick of six shown on the band), with butter yellow, gold, ink and
 * touches of upGrad red, each card its own scene and outfit colour — green,
 * yellow, red, blue (public/images/scholarships/flat, the *-8 set: Merit's
 * drawn on cream; the others repainted to cream from the generated
 * red/charcoal, Girls in Tech's jacket recoloured red; all trimmed to their
 * content so each fills its card). The title sits on a strip of the
 * same colour, the picture is fitted whole between it and the bar, and the
 * bar is solid ink at the foot.
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
        {/* front: the title on a strip of the picture's own background, the
            picture fitted whole below it, the bar at the foot */}
        <div
          inert={flipped}
          style={{ background: GROUND }}
          className="group absolute inset-0 overflow-hidden rounded-[6px] [backface-visibility:hidden]"
        >
          <div className="flex h-full flex-col">
            <h3 className="shrink-0 px-4 pb-2 pt-5 text-center font-display text-[17px] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
              {s.title}
            </h3>
            {/* the picture, scaled to fit whole (never cropped) on the card's
                cream */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Image
                src={`/images/scholarships/flat/${s.art}`}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              {/* Ronnie's card: his portrait on the picture's corner */}
              {s.badge && (
                <Image
                  src={s.badge}
                  alt="Ronnie Screwvala"
                  width={64}
                  height={64}
                  className="absolute bottom-3 right-3 size-16 rounded-full object-cover ring-2 ring-white"
                />
              )}
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => turn(true)}
                aria-expanded={flipped}
                className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3.5 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-accent"
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
