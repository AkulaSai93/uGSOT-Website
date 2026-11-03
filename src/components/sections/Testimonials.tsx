"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GlowButton } from "@/components/site/GlowButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "1000+ Students Have Already Attempted uGNET"
 *
 * Copy and photos are sot.upgrad.com's, verbatim: the heading and line, the
 * four students' words (each quote in two parts, as there) with their three
 * takeaways, and the closing "Get started" call with its three facts and
 * "Apply Now".
 *
 * Layout, kept clean — no panels or rules: the centred heading, then one
 * testimonial at a time, centred: a red quote mark, the first part of the quote
 * in large type and the second quieter beneath, the takeaways as a dotted line
 * of small text and the student's name. Under it the four students' photos in a
 * row switch between them (the current one ringed in red). Then the call to
 * action as a light, centred block.
 *
 * Motion (GSAP): the quotes take turns on their own every few seconds (paused
 * while the pointer is over them or the section is off screen) — the old one
 * lifts away and the new one rises in; the call to action rises in on scroll.
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

const FACTS = [
  "1000+ students attempted",
  "Up to 100% scholarship",
  "4-year B.Tech in CS",
];

const ROTATE_MS = 6500;

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const first = useRef(true);
  const changedAt = useRef(0);

  // take turns on their own, unless the reader is on them or they're off screen
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.3,
    });
    if (el) io.observe(el);
    // checked often, but a turn only comes ROTATE_MS after the last change,
    // so picking a student gives the full time to read theirs
    const id = window.setInterval(() => {
      if (
        visible &&
        !paused.current &&
        Date.now() - changedAt.current >= ROTATE_MS
      )
        setActive((i) => (i + 1) % STUDENTS.length);
    }, 400);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, []);

  // the old quote lifts away, the new one rises in
  useGSAP(
    () => {
      changedAt.current = Date.now();
      const quotes = gsap.utils.toArray<HTMLElement>(
        "[data-quote]",
        root.current,
      );
      if (first.current) {
        first.current = false;
        quotes.forEach((qEl, i) =>
          gsap.set(qEl, { autoAlpha: i === active ? 1 : 0 }),
        );
        return;
      }
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      quotes.forEach((qEl, i) => {
        if (i === active) {
          gsap.fromTo(
            qEl,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : 0.2,
              ease: "expo.out",
              overwrite: true,
            },
          );
        } else {
          gsap.to(qEl, {
            autoAlpha: 0,
            y: -12,
            duration: reduced ? 0 : 0.35,
            ease: "power2.in",
            overwrite: true,
          });
        }
      });
    },
    { dependencies: [active], scope: root },
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-rise]"),
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: q("[data-rise]")[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="testimonials" className="bg-canvas py-20 lg:py-28">
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
          className="mx-auto mt-14 max-w-[880px] text-center lg:mt-16"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {/* every quote in the same grid cell, so the block keeps the height of
              the longest and nothing below jumps as they change */}
          <div className="grid">
            {STUDENTS.map((s, i) => (
              <figure
                key={s.name}
                data-quote
                aria-hidden={i !== active}
                className={`[grid-area:1/1] ${i === active ? "" : "invisible"}`}
              >
                <span
                  aria-hidden
                  className="block font-[family-name:var(--font-bricolage)] text-[64px] font-semibold leading-[0.6] text-accent"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-6">
                  <p className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-ink">
                    {s.lead}
                  </p>
                  <p className="mx-auto mt-4 max-w-[640px] text-[16px] leading-relaxed text-body">
                    {s.rest}
                  </p>
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-[15px] font-semibold text-ink">
                    {s.name}
                  </span>
                  <span className="mt-1.5 block text-[13px] font-medium text-body">
                    {s.tags.map((t, k) => (
                      <span key={t}>
                        {k > 0 && (
                          <span aria-hidden className="mx-2 text-accent">
                            ·
                          </span>
                        )}
                        {t}
                      </span>
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* the four students; pick one to read theirs */}
          <div
            role="tablist"
            aria-label="Students"
            className="mt-10 flex justify-center gap-4"
          >
            {STUDENTS.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.name}
                onClick={() => setActive(i)}
                className={`relative size-14 rounded-full p-[3px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === active
                    ? "scale-110 shadow-[0_0_0_2px_var(--accent)]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={`/images/students/${s.img}.png`}
                  alt=""
                  width={56}
                  height={56}
                  className="size-full rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* the call to action, light and centred */}
        <div
          data-rise
          className="mx-auto mt-20 flex max-w-[720px] flex-col items-center text-center lg:mt-24"
        >
          <h3 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
            Get started on your journey towards your{" "}
            <span className="font-[family-name:var(--font-bricolage)] font-semibold text-accent">
              dream tech career
            </span>
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-body">
            Appear for uGNET — scholarship test, interview, and admission in one
            streamlined flow.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FACTS.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-[14px] font-medium text-ink"
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden
                  className="text-accent"
                />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <GlowButton href="#apply">Apply Now</GlowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
