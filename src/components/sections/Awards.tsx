"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "upGrad's Awards & Recognition"
 *
 * Copy and logos are sot.upgrad.com's, verbatim: the heading and line, and
 * the six awards — each one's source, title and line, and its logo (trimmed
 * to PNG in /images/awards). The footnote is the one the client's reference
 * carries under the same awards.
 *
 * Layout after the client's reference: each award is a card — the logo at
 * the top, the source under it, the award's title in red and its line, all
 * centred. White with a thin border and 6px corners, no shadow. The cards
 * run in two strips, the upper moving left and the lower moving right, held
 * to the page width with their edges fading out. The footnote sits beneath.
 *
 * Motion (GSAP): each strip loops (its cards rendered twice over, slid by
 * exactly half its width, so the seam never shows); hovering a strip eases it to a
 * stop and leaving starts it again. The strips rise in on scroll.
 */
const AWARDS = [
  {
    logo: "et",
    source: "The Economics Times",
    title: "Most Promising Brand",
    line: "upGrad recognised as The Economics Times Most Promising Brand 2022",
  },
  {
    logo: "bw",
    source: "BW Top Education Award 2023",
    title: "EdTech of the Year",
    line: "upGrad wins BW Top Education Award 2023 in Best E-Learning Company",
  },
  {
    logo: "brandon-hall",
    source: "Brandon Hall",
    title: "Gold Award",
    line: "upGrad for Business has won TWO GOLD AWARDS at Brandon Hall",
  },
  {
    logo: "ambitionbox",
    source: "Ambition Box",
    title: "Employee Choice Award",
    line: "Rated Top #3 in Tech Firms and Top #5 in Online Companies",
  },
  {
    logo: "ft",
    source: "FT/IFC Transformational Business Conference and Awards",
    title: "Special Commendation",
    line: "uG’s DS Programe wins ‘Special Commendation’ by FT/IFC Award",
  },
  {
    logo: "hurun",
    source: "Harun India",
    title: "Burgundy Private Hurun India 500",
    line: "uG ranks in Top brands one the 2021 & 2022 Burgundy Private Hurun India 500",
  },
] as const;

/** the two strips: the first three awards above, the last three below —
 *  each set twice over, so one pass is wider than the page */
const ROWS = [AWARDS.slice(0, 3), AWARDS.slice(3)].map((r) => [...r, ...r]);

const LOOP_SECONDS = 40;

function AwardCard({ a, copy }: { a: (typeof AWARDS)[number]; copy: boolean }) {
  return (
    <li
      aria-hidden={copy || undefined}
      className="mr-4 flex w-[min(80vw,340px)] shrink-0 flex-col items-center rounded-[6px] border border-ink/10 bg-white px-6 py-7 text-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small logos, served as they are */}
      <img
        src={`/images/awards/${a.logo}.png`}
        alt={copy ? "" : a.source}
        className="h-14 w-auto max-w-[200px] object-contain"
        loading="lazy"
      />
      <p className="mt-4 text-[13.5px] text-body">{a.source}</p>
      <h3 className="mt-3 font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-accent">
        {a.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-[14px] leading-relaxed text-ink/80">
        {a.line}
      </p>
    </li>
  );
}

export function Awards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const offs: (() => void)[] = [];
        q("[data-strip]").forEach((strip, i) => {
          const track = strip.querySelector("[data-track]");
          // the upper strip runs right to left, the lower left to right
          const loop = gsap.fromTo(
            track,
            { xPercent: i === 0 ? 0 : -50 },
            {
              xPercent: i === 0 ? -50 : 0,
              duration: LOOP_SECONDS,
              ease: "none",
              repeat: -1,
              force3D: true,
            },
          );
          // ease to a stop under the pointer, so an award can be read
          const slow = () =>
            gsap.to(loop, {
              timeScale: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: true,
            });
          const go = () =>
            gsap.to(loop, {
              timeScale: 1,
              duration: 0.8,
              ease: "power2.in",
              overwrite: true,
            });
          strip.addEventListener("mouseenter", slow);
          strip.addEventListener("mouseleave", go);
          offs.push(() => {
            strip.removeEventListener("mouseenter", slow);
            strip.removeEventListener("mouseleave", go);
          });
        });

        gsap.fromTo(
          q("[data-strip]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: q("[data-strip]")[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
        return () => offs.forEach((off) => off());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="awards"
      className="bg-canvas pb-12 pt-20 lg:pb-16 lg:pt-28"
    >
      <div className="container-page">
        <SectionHeading
          title="upGrad’s Awards &"
          accent="Recognition"
          intro="An award-winning legacy in education and technology"
        />

        <div className="mt-12 flex flex-col gap-4 lg:mt-14">
          {ROWS.map((row, r) => (
            <div
              key={r}
              data-strip
              className="relative overflow-hidden [contain:paint] motion-reduce:overflow-x-auto"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-canvas to-transparent sm:w-16"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-canvas to-transparent sm:w-16"
              />
              <ul
                data-track
                className="flex w-max items-stretch will-change-transform"
              >
                {[...row, ...row].map((a, i) => (
                  <AwardCard
                    key={`${a.logo}-${i}`}
                    a={a}
                    copy={i >= row.length / 2}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[12.5px] text-body">
          * These awards recognize upGrad as a company and are not specific to
          this Program.
        </p>
      </div>
    </section>
  );
}
