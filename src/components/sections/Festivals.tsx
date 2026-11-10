"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Festival Celebrations"
 *
 * After the "Festival Celebration" row on newtonschool.co's NST page, which the
 * client asked for: student life on the two campuses, festival by festival.
 *
 * PHOTOS TO REPLACE: the six pictures in /images/festivals are Figma AI
 * stand-ins, not photographs of our students. Swap in real photos from each
 * campus (same file names, landscape, about 1536x1024) before this goes live,
 * and correct each festival's campus below to match.
 *
 * Layout: the festivals in one long row of photo cards, each a white card
 * with 6px corners — the picture, then the festival's name and its campus as
 * a small red tag. On desktop the section holds the screen while you scroll
 * and the row travels sideways past the heading, like walking past a wall of
 * photos, held within the page column; on phones the cards scroll sideways
 * by hand instead.
 *
 * Motion (GSAP, scrubbed by the scroll): the row slides from its first card to
 * its last, and inside each card the picture pans a little the other way, so
 * the photos have depth as they pass. The cards rise in when the section
 * arrives.
 */
const CAMPUS = {
  ssahe: "SSAHE, Tumkuru",
  adypu: "ADYPU, Pune",
} as const;

const FESTIVALS = [
  { img: "diwali", name: "Diwali", campus: CAMPUS.adypu },
  { img: "ganesh-chaturthi", name: "Ganesh Chaturthi", campus: CAMPUS.adypu },
  { img: "holi", name: "Holi", campus: CAMPUS.ssahe },
  { img: "garba", name: "Navratri & Garba Night", campus: CAMPUS.adypu },
  { img: "sankranti", name: "Makar Sankranti", campus: CAMPUS.ssahe },
  { img: "rajyotsava", name: "Karnataka Rajyotsava", campus: CAMPUS.ssahe },
] as const;

export function Festivals() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const row = q("[data-row]")[0] as HTMLElement;
          const frame = row.parentElement as HTMLElement;
          // as far as the row must travel for its last card to reach the
          // right edge of the page column
          const travel = () =>
            -Math.max(0, row.scrollWidth - frame.clientWidth);
          gsap
            .timeline({
              scrollTrigger: {
                trigger: q("[data-track]")[0],
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(row, { x: 0 }, { x: travel, ease: "none" }, 0)
            .fromTo(
              q("[data-pic]"),
              { xPercent: 6 },
              { xPercent: -6, ease: "none" },
              0,
            );
        },
      );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-card]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: q("[data-row]")[0],
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
    <section ref={root} id="festivals" className="bg-canvas">
      {/* lg+: a tall track; the screen inside holds while the row slides */}
      <div data-track className="relative lg:h-[280vh]">
        <div className="pb-8 pt-8 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden lg:pb-0 lg:pt-16">
          <div className="container-page">
            <SectionHeading
              title="Festival"
              accent="Celebrations"
              intro="Every festival, celebrated together — with music, colour and memories to keep."
            />

            <div className="-mx-5 mt-10 snap-x snap-mandatory overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:mt-12 lg:overflow-hidden lg:px-0 lg:pb-0">
              <ul data-row className="flex w-max gap-4 will-change-transform">
                {FESTIVALS.map((f) => (
                  <li
                    key={f.img}
                    data-card
                    className="w-[78vw] shrink-0 snap-center overflow-hidden rounded-[6px] border border-ink/10 bg-white p-2 sm:w-[340px] lg:w-[min(34vw,460px)]"
                  >
                    <div className="relative h-[300px] overflow-hidden rounded-[4px] lg:h-[min(400px,44svh)]">
                      <div data-pic className="absolute inset-0 scale-[1.15]">
                        <Image
                          src={`/images/festivals/${f.img}.jpg`}
                          alt={`${f.name} celebrations at ${f.campus}`}
                          fill
                          sizes="(min-width: 1024px) 460px, 80vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                      <p className="truncate text-[16px] font-semibold text-ink">
                        {f.name}
                      </p>
                      <span className="shrink-0 whitespace-nowrap rounded-[4px] bg-accent/10 px-2 py-0.5 text-[12px] font-semibold text-accent">
                        {f.campus}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
