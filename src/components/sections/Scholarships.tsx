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
 * Told in two beats, in one frame, playing by itself (not tied to the
 * scroll) as the section comes into view:
 *
 *  1. The handshake — a student (grey hoodie, backpack) walks in from the
 *     left and a member of upGrad School of Technology's staff (red blazer,
 *     ID on a lanyard) from the right, each with a hand held out; they meet in
 *     the middle and shake hands, a soft glow sparking at the clasp, with
 *     "You" and "upGrad School of Technology" beneath them. One Figma AI
 *     render in a 3D animated-film style (v4/handshake-people.webp, its white
 *     background cut away, its soft floor shadows kept), split at the clasp
 *     with a feathered mask so each person walks in on their own.
 *  2. The scholarships — the two step back and fade, and the four cards
 *     rise in where they were: the section's first card design, each a tall
 *     picture (Figma AI artwork; Ronnie Screwvala's portrait as a badge on
 *     his) with its name in the clear top third and a frosted-glass "View
 *     eligibility" bar across the foot. That bar turns the card over (a 3D
 *     flip) to its red back: the eligibility criteria and "Know More";
 *     "Back" turns it round again.
 */
const KNOW_MORE = "https://sot.upgrad.com/uGNET";

const SCHOLARSHIPS = [
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
    /** Ronnie Screwvala's portrait, shown as a round badge on the card */
    badge: "/images/scholarships/v3/ronnie-badge.jpg",
    title: "Ronnie Screwvala Scholarship for Budding Tech Innovators",
    criteria:
      "Given to students who show early talent, creativity, or passion for building innovative tech solutions. It supports future innovators who want to solve real-world problems using technology.",
  },
] as const;

/* ------------------------------------------------------------ beat 1 */

/** where the hands clasp in the render, as shares of its width and height */
const CLASP = { x: 48.83, y: 39 };

/** one person's half of the render, split at the clasp with a soft edge */
function Person({ who }: { who: "student" | "staff" }) {
  const left = who === "student";
  const [a, b] = [`${CLASP.x - 0.5}%`, `${CLASP.x + 0.5}%`];
  return (
    <div
      data-person={who}
      className="absolute inset-0"
      style={{
        maskImage: left
          ? `linear-gradient(90deg, #000 ${a}, transparent ${b})`
          : `linear-gradient(90deg, transparent ${a}, #000 ${b})`,
      }}
    >
      <Image
        src="/images/scholarships/v4/handshake-people.webp"
        alt={
          left
            ? ""
            : "A student and a member of upGrad School of Technology's staff shaking hands"
        }
        fill
        sizes="(min-width: 1024px) 860px, 100vw"
        className="object-contain"
      />
    </div>
  );
}

function Handshake() {
  return (
    // centred by this wrapper, so GSAP's transforms on the scene inside
    // don't undo it
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 lg:top-1/2 lg:-translate-y-1/2">
      <div
        data-people
        className="relative mx-auto w-full max-w-[860px] lg:w-[min(860px,64vw)]"
      >
        <div data-shake className="relative aspect-[1536/805]">
          <Person who="student" />
          <Person who="staff" />

          {/* the glow that sparks at the clasp */}
          <span
            className="absolute size-28 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${CLASP.x}%`, top: `${CLASP.y}%` }}
          >
            <span
              data-spark
              className="block size-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,214,222,0.8)_24%,rgba(228,0,43,0.16)_50%,rgba(228,0,43,0)_70%)] opacity-0"
            />
          </span>
        </div>

        {/* who is who, under each */}
        {(
          [
            ["You", "text-ink", 32.5],
            ["upGrad School of Technology", "text-accent", 65.5],
          ] as const
        ).map(([name, tone, at]) => (
          <span
            key={name}
            className="absolute top-full -mt-1 -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${at}%` }}
          >
            <span
              data-label
              className={`block font-display text-[12px] font-bold sm:text-[15px] ${tone}`}
            >
              {name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ beat 2 */

function ScholarshipCard({ s }: { s: (typeof SCHOLARSHIPS)[number] }) {
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
            {/* the badge (Ronnie's card only) sits above the bar; the bar is
                frosted glass across the card's foot, edge to edge */}
            <div className="flex flex-col">
              {"badge" in s && (
                <Image
                  src={s.badge}
                  alt="Ronnie Screwvala"
                  width={88}
                  height={88}
                  className="mb-3 mr-4 size-[88px] self-end rounded-full object-cover shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] ring-2 ring-white/80"
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
              href={KNOW_MORE}
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
        // a timed sequence, started once as the frame comes into view: the
        // two walk in and shake hands, a glow sparks at the clasp, their
        // names come up; then they step back and fade, and the four cards
        // rise in where they were
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-stage]")[0],
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
        tl.fromTo(
          q('[data-person="student"]'),
          { xPercent: -26, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 1.5, ease: "power2.out" },
          0,
        )
          .fromTo(
            q('[data-person="staff"]'),
            { xPercent: 26, autoAlpha: 0 },
            { xPercent: 0, autoAlpha: 1, duration: 1.5, ease: "power2.out" },
            0,
          )
          // a light bob as they walk
          .fromTo(
            q("[data-person]"),
            { y: 0 },
            {
              y: -5,
              duration: 0.18,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 7,
            },
            0,
          )
          .fromTo(
            q("[data-spark]"),
            { scale: 0.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
            1.4,
          )
          .to(
            q("[data-spark]"),
            { scale: 2, opacity: 0, duration: 0.9, ease: "power2.out" },
            1.85,
          )
          // the handshake: two short pumps
          .to(
            q("[data-shake]"),
            { y: 4, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 3 },
            1.5,
          )
          .fromTo(
            q("[data-label]"),
            { y: 10, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
            },
            1.6,
          )
          // a beat on the handshake, then they step back and fade
          .to(
            q("[data-people]"),
            { scale: 0.94, autoAlpha: 0, duration: 0.6, ease: "power2.in" },
            3.2,
          )
          .fromTo(
            q("[data-card]"),
            { y: 70, scale: 0.96, autoAlpha: 0 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1.1,
              stagger: 0.1,
              ease: "expo.out",
              immediateRender: true,
            },
            3.5,
          );
      });

      // reduced motion: the cards as they are, no handshake
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-people]"), { autoAlpha: 0 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="scholarships"
      className="overflow-x-clip bg-canvas py-12 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          title="Get Upto"
          accent="100% Scholarship"
          intro="Invest in your future with scholarship opportunities that make quality education more affordable and accessible."
        />

        {/* the frame: the two shake hands here, then the cards take their
            place (tall enough on desktop for the handshake and its names) */}
        <div
          data-stage
          className="relative mt-12 lg:mt-14 lg:flex lg:min-h-[min(520px,38vw)] lg:items-center"
        >
          <Handshake />
          <ul className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SCHOLARSHIPS.map((s) => (
              <ScholarshipCard key={s.key} s={s} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
