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
 * "Get Upto 100% Scholarship"
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line, the four
 * scholarships with their eligibility text and the "Know More" link (to the
 * uGNET page, as there).
 *
 * Pictures (public/images/scholarships/v3) follow the "Two years. One serious
 * transformation." cards on sot.upgrad.com/catalyst: one hero object on a dark
 * stage of soft vertical light stripes, glowing icon tiles floating round it,
 * each card in its own tint, the top third left dark for the card's title.
 * Each tells its card's story; generated with Figma AI: merit (blue) a
 * student on the top step of a podium raising a gold medal, with A+ and
 * 100/100 tiles; need (teal) a student climbing a staircase of coins, lifted
 * by a helping hand, to an open door under a graduation cap; girls in tech
 * (violet) a young woman engineer coding at her laptop.
 * Innovators (dark crimson) is a Figma AI light bulb with a circuit filament
 * and a rocket lifting off; Ronnie Screwvala himself appears on that card as
 * a round portrait badge, cut from his colour photo on sot.upgrad.com.
 *
 * Layout: the heading centred, then the four scholarships as tall picture cards. "View eligibility" turns a
 * card over (a 3D flip) to its red back: the eligibility criteria and "Know
 * More"; "Back" turns it round again.
 *
 * Motion (GSAP): the cards rise in one after another; the flip is a GSAP
 * rotationY tween on the card's inner layer.
 */
const KNOW_MORE = "https://sot.upgrad.com/uGNET";

const SCHOLARSHIPS = [
  {
    key: "merit",
    alt: "",
    title: "Merit-Based Scholarship",
    criteria:
      "Awarded to students with strong academic performance or outstanding achievements. This scholarship recognizes hard work, discipline, and excellence in studies.",
  },
  {
    key: "need",
    alt: "",
    title: "Need-Based Scholarship",
    criteria:
      "Designed for students who require financial support to pursue their education. It ensures that deserving learners are not held back due to economic constraints.",
  },
  {
    key: "girls-in-tech",
    alt: "",
    title: "Girls in Tech Scholarship",
    criteria:
      "A dedicated scholarship to encourage more young women to enter and excel in technology. It supports aspiring female students who want to build successful careers in tech.",
  },
  {
    key: "innovators",
    alt: "",
    /** Ronnie Screwvala's portrait, shown as a round badge on the card */
    badge: "/images/scholarships/v3/ronnie-badge.jpg",
    title: "Ronnie Screwvala Scholarship for Budding Tech Innovators",
    criteria:
      "Given to students who show early talent, creativity, or passion for building innovative tech solutions. It supports future innovators who want to solve real-world problems using technology.",
  },
] as const;

function ScholarshipCard({ s }: { s: (typeof SCHOLARSHIPS)[number] }) {
  const [flipped, setFlipped] = useState(false);
  const inner = useRef<HTMLDivElement>(null);

  const turn = (to: boolean) => {
    setFlipped(to);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(inner.current, {
      rotationY: to ? 180 : 0,
      duration: reduced ? 0 : 0.9,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  return (
    <li data-card className="[perspective:1400px]">
      <div ref={inner} className="relative aspect-[4/5] [transform-style:preserve-3d]">
        {/* front: the picture, with the title in its clear top third */}
        <div
          inert={flipped}
          className="group absolute inset-0 overflow-hidden rounded-[6px] bg-ink [backface-visibility:hidden]"
        >
          <Image
            src={`/images/scholarships/v3/${s.key}.jpg`}
            alt={s.alt}
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
              {"badge" in s && (
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
                <RotateCcw size={15} strokeWidth={2} aria-hidden className="-scale-x-100" />
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
            <p className="text-[12.5px] font-semibold text-white/75">Eligibility Criteria</p>
            <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-[-0.01em]">{s.title}</h3>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/90">{s.criteria}</p>
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
        gsap.fromTo(
          q("[data-card]"),
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: q("[data-cards]")[0], start: "top 82%", toggleActions: "play none none none" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="scholarships" className="bg-canvas py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Get Upto"
          accent="100% Scholarship"
          intro="Invest in your future with scholarship opportunities that make quality education more affordable and accessible."
        />

        <ul data-cards className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {SCHOLARSHIPS.map((s) => (
            <ScholarshipCard key={s.key} s={s} />
          ))}
        </ul>
      </div>
    </section>
  );
}
