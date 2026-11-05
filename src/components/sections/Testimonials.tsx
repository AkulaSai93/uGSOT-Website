"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "1000+ Students Have Already Attempted uGNET"
 *
 * Copy and photos are sot.upgrad.com's, verbatim: the heading and line, the
 * four students' words (each quote in two parts, as there) with their three
 * takeaways, and the closing "Get started" call and "Apply Now".
 *
 * Layout after a persona carousel the client supplied: the centred heading,
 * then the current student's card in the middle, red with a black border
 * and white type like the scholarship card in Admission (the others white) — their photo beside their
 * name and takeaways, the two parts of their quote beneath under small grey
 * labels — with the previous and next students' cards beside it, the same
 * size, hinged on their inner edges and turned away in 3D, faded.
 * Under it the four photos in a row pick between them (the current one ringed
 * in black). Then the call to action as a full-width band of red fluted
 * glass, as newtonschool.co closes its page: the line on the left, a white Apply Now on
 * the right.
 *
 * Motion (GSAP): the cards swing round the carousel to their places; the
 * students take turns on their own every few seconds (paused while the pointer
 * is on them or the section is off screen); the call to action rises in on
 * scroll. Below md only the current card shows.
 */
const STUDENTS = [
  {
    name: "Sanskriti Singh",
    img: "Sanskriti",
    lead: "I was confused between BITS, VIT, SRM, Manipal and state exams.",
    rest: "uGNET introduced me to a more modern, AI-focused B.Tech and gave me clarity on what to choose.",
    tags: ["Clear Direction", "AI-Focused Path", "Reduced Confusion"],
  },
  {
    name: "Ishan Kumar",
    img: "Ishan",
    lead: "I chose uGSOT for its future-ready curriculum, coding from Day 1, and its strong support for paid internships and placements with companies like Internshala and Rekrut",
    rest: "I want to build my own gaming startup after B.Tech, and I believe uGSOT's startup-support will help turn that vision into reality",
    tags: ["Strong Ecosystem", "Startup Support", "Coding from Day 1"],
  },
  {
    name: "Mahadeb",
    img: "Mahadeb",
    lead: "The curriculum, practical learning approach, and the chance to learn from industry-background teachers really stood out to me.",
    rest: "I'm looking forward to starting my classes.",
    tags: [
      "Strong Curriculum Fit",
      "Practical Focus",
      "Industry-Relevant Learning",
    ],
  },
  {
    name: "Aditya Anand",
    img: "Aditya",
    lead: "I discovered uGNET through YouTube and got interested in the curriculum and newer fields like Quantum Computing.",
    rest: "The scholarship test and interview experience were smooth.",
    tags: ["Clear Curriculum", "Smooth Process", "Future-Focused Learning"],
  },
] as const;

/** the call to action's backdrop: red fluted glass — deep maroon at the
 *  edges brightening to a hot red in the middle, cut into vertical ribs of
 *  uneven width (three repeating patterns of different periods laid over one
 *  another, so the ribs never line up into a regular grid) */
const FLUTED = [
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.24) 0 10px, rgba(255,30,60,0.14) 28px 34px, rgba(0,0,0,0.18) 52px)",
  "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 34px, rgba(255,40,70,0.16) 46px, rgba(0,0,0,0.16) 62px, rgba(0,0,0,0) 78px)",
  "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 90px, rgba(0,0,0,0.22) 110px, rgba(255,50,80,0.14) 130px, rgba(0,0,0,0) 152px)",
  "linear-gradient(90deg, #1f0006 0%, #5c0014 16%, #b8001f 34%, #ff1f3d 50%, #b8001f 66%, #5c0014 84%, #1f0006 100%)",
].join(", ");

/** how long each student's card stays in front before the next one's */
const ROTATE_S = 6.5;

/** where a card sits for its place relative to the current one: in front;
 *  beside it on the right or left, the same size, hinged on its inner edge
 *  and turned away (so its outer edge recedes), faded; or hidden behind */
const GAP = 14;
const POSE = {
  0: {
    xPercent: 0,
    x: 0,
    rotationY: 0,
    transformOrigin: "50% 50%",
    scale: 1,
    autoAlpha: 1,
    filter: "blur(0px)",
    zIndex: 3,
  },
  1: {
    xPercent: 100,
    x: GAP,
    rotationY: 32,
    transformOrigin: "0% 50%",
    scale: 1,
    autoAlpha: 0.32,
    filter: "blur(1.5px)",
    zIndex: 2,
  },
  [-1]: {
    xPercent: -100,
    x: -GAP,
    rotationY: -32,
    transformOrigin: "100% 50%",
    scale: 1,
    autoAlpha: 0.32,
    filter: "blur(1.5px)",
    zIndex: 2,
  },
  2: {
    xPercent: 0,
    x: 0,
    rotationY: 0,
    transformOrigin: "50% 50%",
    scale: 0.8,
    autoAlpha: 0,
    filter: "blur(4px)",
    zIndex: 1,
  },
} as const;

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const timer = useRef<gsap.core.Tween | null>(null);
  const hovered = useRef(false);
  const onScreen = useRef(false);
  const first = useRef(true);

  // pause the turn while the reader is on it or it's off screen
  const sync = () => {
    const t = timer.current;
    if (!t) return;
    if (hovered.current || !onScreen.current) t.pause();
    else t.resume();
  };

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => {
          onScreen.current = self.isActive;
          sync();
        },
      });
    },
    { scope: root },
  );

  // each card swings to its place round the carousel, then the turn's timer
  // starts for the next student
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const n = STUDENTS.length;

      q("[data-card]").forEach((el, i) => {
        const d = (i - active + n) % n;
        const place = d === n - 1 ? -1 : d;
        const vars = POSE[place as keyof typeof POSE];
        if (first.current || reduced) gsap.set(el, vars);
        else
          gsap.to(el, {
            ...vars,
            duration: 0.9,
            ease: "expo.out",
            overwrite: true,
          });
      });
      first.current = false;

      if (reduced) return;
      timer.current = gsap.delayedCall(ROTATE_S, () =>
        setActive((i) => (i + 1) % n),
      );
      sync();
      return () => {
        timer.current?.kill();
        timer.current = null;
      };
    },
    { dependencies: [active], scope: root },
  );

  return (
    <section
      ref={root}
      id="testimonials"
      className="overflow-x-clip bg-canvas pt-12 lg:pt-28"
    >
      <div className="container-page">
        <SectionHeading
          title="1000+ Students Have Already Attempted"
          accent="uGNET"
          intro={
            // one line from sm up: widened past the intro's cap, evenly, so it stays centred
            <span className="sm:-mx-12 sm:block sm:whitespace-nowrap">
              From confusion to clarity, here&rsquo;s how uGNET enabled career
              decisions for some of them
            </span>
          }
        />

        <div
          data-rise
          className="mt-12 lg:mt-14"
          onMouseEnter={() => {
            hovered.current = true;
            sync();
          }}
          onMouseLeave={() => {
            hovered.current = false;
            sync();
          }}
        >
          {/* the carousel: every card in one grid cell, so the stage keeps the
              height of the tallest */}
          <div className="mx-auto grid w-full max-w-[460px] [perspective:1100px] max-md:[&>[aria-hidden=true]]:!opacity-0">
            {STUDENTS.map((st, i) => (
              <figure
                key={st.name}
                data-card
                aria-hidden={i !== active}
                onClick={() => setActive(i)}
                className={`rounded-[6px] border-2 p-7 transition-colors duration-500 [grid-area:1/1] ${
                  i === active
                    ? "border-ink bg-accent text-white"
                    : "cursor-pointer border-ink/10 bg-white text-ink"
                }`}
              >
                <figcaption className="flex items-center gap-5">
                  <Image
                    src={`/images/students/${st.img}.png`}
                    alt=""
                    width={100}
                    height={100}
                    className="size-[100px] shrink-0 rounded-[6px] object-cover"
                  />
                  <span>
                    <span className="block text-[18px] font-semibold">
                      {st.name}
                    </span>
                    <span className="mt-1.5 block text-[13.5px] leading-snug opacity-75">
                      {st.tags[0]}
                      <br />
                      {st.tags[1]}, {st.tags[2]}
                    </span>
                  </span>
                </figcaption>
                <blockquote className="mt-6 text-[14px] leading-[1.5]">
                  <p className="text-[13.5px] opacity-70">Their story</p>
                  <p className="mt-1">{st.lead}</p>
                  <p className="mt-5 text-[13.5px] opacity-70">
                    Their takeaway
                  </p>
                  <p className="mt-1">{st.rest}</p>
                </blockquote>
              </figure>
            ))}
          </div>

          {/* the four students' photos; pick one to bring their card round */}
          <div
            role="tablist"
            aria-label="Students"
            className="mt-8 flex justify-center gap-1.5"
          >
            {STUDENTS.map((st, i) => (
              <button
                key={st.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={st.name}
                onClick={() => setActive(i)}
                className={`size-11 overflow-hidden rounded-[6px] transition-[box-shadow,opacity] duration-300 ${
                  i === active
                    ? "shadow-[0_0_0_2px_var(--canvas),0_0_0_4px_var(--ink)]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={`/images/students/${st.img}.png`}
                  alt=""
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* the call to action: a full-width band of red fluted glass, as
          newtonschool.co closes its page (theirs is blue); the line on the
          left, Apply Now on the right */}
      <div
        id="get-started"
        className="relative mt-20 overflow-hidden py-12 lg:mt-24 lg:py-14"
        style={{ background: FLUTED }}
      >
        <div
          data-rise
          className="container-page flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:justify-between md:text-left"
        >
          <div className="max-w-[560px]">
            <h3 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-[1.2] tracking-[-0.02em] text-white">
              Get started on your journey towards your{" "}
              <span className="font-[family-name:var(--font-bricolage)] font-semibold">
                dream tech career
              </span>
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              Appear for uGNET scholarship test, interview, and admission in one
              streamlined flow.
            </p>
          </div>
          {/* Apply Now, white on the red, with the hero CTA's sweeping glow */}
          <Link
            href="#apply"
            className="group/cta relative inline-flex shrink-0 overflow-hidden rounded-[6px] p-[1.5px]"
          >
            <span
              aria-hidden
              style={{
                backgroundImage: "conic-gradient(transparent 200deg, #0b0d12)",
              }}
              className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
            />
            <span className="relative z-[2] inline-flex items-center gap-2 whitespace-nowrap rounded-[5px] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors group-hover/cta:bg-white/90">
              Apply Now
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
