"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GlowButton } from "@/components/site/GlowButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Get Upto 100% Scholarship"
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line, the four
 * scholarships with their eligibility text and the "Know More" link (to the
 * uGNET page, as there).
 *
 * Pictures (public/images/scholarships/v3) are the Figma AI scholarship
 * artworks — merit, need, girls in tech, innovators — with Ronnie Screwvala's
 * portrait as a round badge on his scholarship.
 *
 * Layout: two columns. On the left, held in view while the right scrolls past
 * (desktop): the heading, its line and "Check eligibility". On the right, the
 * four scholarships as picture cards one under another — each picture fills
 * its card, and its number, name, the full eligibility text and "Know More"
 * sit on it, over a fade to black up from the foot. Below lg the heading
 * comes first and the cards stack.
 *
 * Motion (GSAP, scrubbed by the scroll): as each card comes up the screen its
 * picture wipes open from the left while it settles from a slight zoom, and
 * its words rise in on it just after.
 */
const UGNET = "https://sot.upgrad.com/uGNET";

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
    /** Ronnie Screwvala's portrait, shown as a round badge on the picture */
    badge: "/images/scholarships/v3/ronnie-badge.jpg",
    title: "Ronnie Screwvala Scholarship for Budding Tech Innovators",
    criteria:
      "Given to students who show early talent, creativity, or passion for building innovative tech solutions. It supports future innovators who want to solve real-world problems using technology.",
  },
] as const;

function ScholarshipCard({
  s,
  n,
}: {
  s: (typeof SCHOLARSHIPS)[number];
  n: number;
}) {
  return (
    <li
      data-card
      className="relative aspect-[2/3] overflow-hidden rounded-[6px] bg-ink sm:aspect-[16/9]"
    >
      {/* the picture, wiped open by the scroll */}
      <div data-pic className="absolute inset-0">
        <div data-pic-inner className="absolute inset-0">
          <Image
            src={`/images/scholarships/v3/${s.key}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {/* a fade to black up from the foot, under the words */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_30%,rgba(0,0,0,0.6)_58%,rgba(0,0,0,0.9)_100%)]"
        />
        {"badge" in s && (
          <Image
            src={s.badge}
            alt="Ronnie Screwvala"
            width={84}
            height={84}
            className="absolute right-5 top-5 size-[84px] rounded-full object-cover shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] ring-2 ring-white/80"
          />
        )}
      </div>

      {/* the words, on the picture */}
      <div
        data-words
        className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"
      >
        <p className="font-[family-name:var(--font-bricolage)] text-[15px] font-semibold text-[#ff5c7a]">
          {String(n + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-1.5 font-display text-[clamp(1.25rem,1.8vw,1.625rem)] font-bold leading-snug tracking-[-0.02em]">
          {s.title}
        </h3>
        <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
          {s.criteria}
        </p>
        <a
          href={UGNET}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white"
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/link:bg-[length:100%_1px]">
            Know More
          </span>
          <ArrowUpRight
            size={15}
            strokeWidth={2}
            aria-hidden
            className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </a>
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
        q("[data-card]").forEach((card) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "top 45%",
                scrub: 0.6,
              },
            })
            .fromTo(
              card.querySelector("[data-pic]"),
              { clipPath: "inset(0% 100% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "power2.out",
                duration: 1,
              },
              0,
            )
            .fromTo(
              card.querySelector("[data-pic-inner]"),
              { scale: 1.18 },
              { scale: 1, ease: "power2.out", duration: 1 },
              0,
            )
            .fromTo(
              card.querySelector("[data-words]"),
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.7 },
              0.35,
            );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="scholarships" className="bg-canvas py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        {/* left: held in view while the scholarships scroll past */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            title="Get Upto"
            accent="100% Scholarship"
            intro="Invest in your future with scholarship opportunities that make quality education more affordable and accessible."
          />

          <div className="mt-10">
            <GlowButton href={UGNET} streak="#0b0d12">
              Check eligibility
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
            </GlowButton>
          </div>
        </div>

        {/* right: the four scholarships, scrolling past */}
        <ul className="flex flex-col gap-6">
          {SCHOLARSHIPS.map((s, i) => (
            <ScholarshipCard key={s.key} s={s} n={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
