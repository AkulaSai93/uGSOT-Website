"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Get Upto 100% Scholarship" — the site's main section.
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line, the four
 * scholarships with their eligibility text and the "Know More" link (to the
 * uGNET page, as there).
 *
 * Layout after the client's reference (a "Learn. Finish. Get Your Fee Back."
 * band, Figma node 232:4483): a full-width black band with that frame's wavy
 * edges top and bottom (see Wave); the heading and its
 * line centred in white, and the four scholarships as the section's original flip
 * cards (see ScholarshipCard). "Check eligibility" sits under them.
 *
 * Motion (GSAP, as the band comes into view): the cards rise in one after
 * another.
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

/** the band's black */
const BAND = "#0b0b0d";

/* ------------------------------------------------------------ the edges */

/**
 * One wavy edge of the band, from the client's Figma frame (Tutedude
 * Hackathon, node 232:4483): its wave vector as drawn there (wave-fill.svg,
 * 1440 x 34.25) over the top 81.73% of a 41.9px strip, turned 180 degrees as
 * in the frame (the foot's strip is also flipped top to bottom). The frame's
 * outline along the wave is left off, so the edge is plain black.
 *
 * The vector is used as a mask, so the wave takes the band's black, and
 * repeats across the width: nine 160px waves per 1440px tile, so they meet
 * seamlessly and keep their size on any screen. Below sm the whole strip is
 * drawn at half size.
 */
function Wave({ foot = false }: { foot?: boolean }) {
  return (
    <div
      aria-hidden
      className={`relative h-[21px] w-full sm:h-[41.905px] ${foot ? "-scale-x-100" : "rotate-180"}`}
    >
      <span
        className="absolute inset-x-0 bottom-[18.27%] top-0 [mask-image:url(/images/scholarships/wave/wave-fill.svg)] [mask-repeat:repeat-x] [mask-size:720px_100%] sm:[mask-size:1440px_100%]"
        style={{ background: BAND }}
      />
    </div>
  );
}

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
    <li data-card className="[perspective:1400px]">
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

export function Scholarships() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = {
          trigger: q("[data-band]")[0],
          start: "top 75%",
          toggleActions: "play none none none",
        };
        gsap.fromTo(
          q("[data-card]"),
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: st,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="scholarships" className="bg-canvas py-6 lg:py-10">
      <div data-band>
        <Wave />
        <div
          style={{ background: BAND }}
          className="relative z-[1] -my-[2px] py-8 lg:py-12"
        >
          <div className="container-page">
            {/* the heading and its line, centred, in white */}
            <div
              style={
                {
                  "--heading-fg": "#ffffff",
                  "--heading-muted": "rgba(255,255,255,0.85)",
                } as React.CSSProperties
              }
            >
              <SectionHeading
                title="Get Upto"
                accent="100% Scholarship"
                intro="Invest in your future with scholarship opportunities that make quality education more affordable and accessible."
              />
            </div>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
              {SCHOLARSHIPS.map((s) => (
                <ScholarshipCard key={s.key} s={s} />
              ))}
            </ul>

            <div className="mt-8 flex justify-center lg:mt-10">
              <a
                href={UGNET}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-[6px] border-solid border-[#0b0d12] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink"
                style={{ borderWidth: "1.5px 4px 4px 1.5px" }}
              >
                Check eligibility
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>
        <Wave foot />
      </div>
    </section>
  );
}
