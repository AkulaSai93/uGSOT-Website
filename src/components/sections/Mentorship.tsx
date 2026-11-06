"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import { MENTOR_CLIPS, SPEAKERS, thumb, type ChannelVideo } from "@/components/site/channel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Special Mentorship" — a moving strip of session cards.
 *
 * Every session is real: upGrad's leadership — Ronnie Screwvala and Vishwa
 * Mohan — speaking to students on campus, from upGrad School of Technology's
 * own YouTube channel (see site/channel.ts), each card carrying the clip's own
 * title. The line under the heading is sot.upgrad.com's for its "CXO
 * Masterclasses".
 *
 * Layout: under the heading, one row of tall cards running edge to edge, its
 * ends fading into the page. Each card is the clip itself, upright — the
 * speaker's name and role and the session's title on a frosted dark panel
 * across its foot, a play button in its corner — and plays in the player overlay when clicked.
 *
 * Motion (GSAP): the row drifts right to left without end (rendered twice and
 * slid by half its width, so the seam never shows), easing to a stop under the
 * pointer so a card can be picked; the row rises in as it arrives. Under
 * reduced motion it holds still and can be scrolled sideways instead.
 */
const LOOP_SECONDS = 48;

function SessionCard({ v, copy, onPlay }: { v: ChannelVideo; copy: boolean; onPlay: () => void }) {
  const who = v.speaker ? SPEAKERS[v.speaker] : null;
  return (
    <li aria-hidden={copy || undefined} className="mr-4 w-[min(58vw,240px)] shrink-0 sm:mr-5">
      <button
        type="button"
        tabIndex={copy ? -1 : undefined}
        onClick={onPlay}
        aria-label={`Play: ${v.title}${who ? ` — ${who.name}` : ""}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[6px] bg-ink text-left outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          src={thumb(v)}
          alt=""
          fill
          sizes="240px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_25%)]"
        />
        {/* play, in the corner */}
        <span
          aria-hidden
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
        >
          <Play size={15} fill="currentColor" strokeWidth={0} className="translate-x-[1px]" />
        </span>
        {/* who, and what about — on a frosted dark panel, so the words never
            run into the captions burned into the clips */}
        <span className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/70 p-4 backdrop-blur-md">
          <span className="line-clamp-3 block text-[14px] font-semibold leading-snug text-white">
            {v.title}
          </span>
          {who && (
            <span className="mt-3 block border-t border-white/20 pt-3">
              <span className="block font-display text-[15px] font-bold leading-tight text-white">
                {who.name}
              </span>
              <span className="mt-0.5 block text-[12px] text-white/70">{who.role}</span>
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function Mentorship() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const play = (v: ChannelVideo) =>
    setPlaying({ id: v.id, name: v.title, thumb: thumb(v), vertical: v.short });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const strip = q("[data-strip]")[0];
        const loop = gsap.fromTo(
          q("[data-track]"),
          { xPercent: 0 },
          { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1, force3D: true },
        );
        // ease to a stop under the pointer, so a card can be picked
        const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.6, ease: "power2.out" });
        const go = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.in" });
        strip.addEventListener("mouseenter", slow);
        strip.addEventListener("mouseleave", go);

        gsap.fromTo(
          strip,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: strip, start: "top 85%", toggleActions: "play none none none" },
          },
        );
        return () => {
          strip.removeEventListener("mouseenter", slow);
          strip.removeEventListener("mouseleave", go);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // one pass is wider than any screen, so the loop never shows a gap
  const pass = [...MENTOR_CLIPS, ...MENTOR_CLIPS];

  return (
    <section ref={root} id="mentorship" className="overflow-x-clip bg-canvas py-12 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Special"
          accent="Mentorship"
          intro="CXO masterclasses on campus — gain insights from leadership driving real-world impact."
        />
      </div>

      {/* the moving row, edge to edge, its ends fading into the page */}
      <div
        data-strip
        className="relative mt-10 overflow-hidden py-3 motion-reduce:overflow-x-auto lg:mt-14"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-canvas to-transparent sm:w-24"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-canvas to-transparent sm:w-24"
        />
        <ul data-track className="flex w-max will-change-transform">
          {[...pass, ...pass].map((v, i) => (
            <SessionCard
              key={`${v.id}-${i}`}
              v={v}
              copy={i >= MENTOR_CLIPS.length}
              onPlay={() => play(v)}
            />
          ))}
        </ul>
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
