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
 * "Special Mentorship" — two rows of session passes, drifting.
 *
 * Every session is real: upGrad's leadership — Ronnie Screwvala and Vishwa
 * Mohan — speaking to students on campus, from upGrad School of Technology's
 * own YouTube channel (see site/channel.ts), each pass carrying the clip's own
 * title. The line under the heading is sot.upgrad.com's for its "CXO
 * Masterclasses".
 *
 * Layout: under the heading, within the page's width, two short rows of
 * passes, like tickets to a masterclass: the clip on a stub at the left, a
 * notch cut top and bottom where the stub meets the pass, then the session's
 * title and who gives it. A pass plays its clip in the player overlay when
 * clicked. The rows' ends fade into the page.
 *
 * Motion (GSAP): the rows drift without end, the first leftwards and the
 * second rightwards (rendered twice and slid by half their width, so the seam
 * never shows); a row eases to a stop under the mouse so a pass can be
 * picked. The rows rise in as they arrive. Under reduced motion they hold
 * still and can be scrolled sideways instead.
 */
const ROWS = [
  { clips: MENTOR_CLIPS, left: true, seconds: 70 },
  { clips: [...MENTOR_CLIPS.slice(4), ...MENTOR_CLIPS.slice(0, 4)], left: false, seconds: 80 },
];

/** the notches, cut top and bottom where the stub (--stub wide) meets the pass */
const NOTCHES = [
  "radial-gradient(circle 8px at var(--stub) 0, #0000 97%, #000) top / 100% 51% no-repeat",
  "radial-gradient(circle 8px at var(--stub) 100%, #0000 97%, #000) bottom / 100% 51% no-repeat",
].join(", ");

function Pass({ v, copy, onPlay }: { v: ChannelVideo; copy: boolean; onPlay: () => void }) {
  const who = v.speaker ? SPEAKERS[v.speaker] : null;
  return (
    <li aria-hidden={copy || undefined} className="mr-3 shrink-0 sm:mr-4">
      <button
        type="button"
        tabIndex={copy ? -1 : undefined}
        onClick={onPlay}
        aria-label={`Play: ${v.title}${who ? ` — ${who.name}` : ""}`}
        style={{ mask: NOTCHES, WebkitMask: NOTCHES }}
        className="group flex h-[128px] w-[320px] overflow-hidden rounded-[6px] bg-white text-left outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [--stub:88px] hover:-translate-y-1 sm:h-[136px] sm:w-[380px] sm:[--stub:104px]"
      >
        {/* the stub: the clip */}
        <span className="relative w-[var(--stub)] shrink-0 overflow-hidden bg-ink">
          <Image
            src={thumb(v)}
            alt=""
            fill
            sizes="104px"
            className="object-cover object-[50%_30%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
          >
            <Play size={13} fill="currentColor" strokeWidth={0} className="translate-x-[1px]" />
          </span>
        </span>
        {/* the pass: what about, and who */}
        <span className="flex min-w-0 flex-1 flex-col justify-between border-l border-dashed border-ink/15 p-3.5 sm:p-4">
          <span className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink sm:text-[14.5px]">
            {v.title}
          </span>
          {who && (
            <span className="block min-w-0">
              <span className="block truncate font-display text-[14px] font-bold leading-tight text-ink">
                {who.name}
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-muted">{who.role}</span>
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
        const off = q("[data-row]").map((row, i) => {
          const { left, seconds } = ROWS[i];
          const loop = gsap.fromTo(
            row.querySelector("[data-track]"),
            { xPercent: left ? 0 : -50 },
            { xPercent: left ? -50 : 0, duration: seconds, ease: "none", repeat: -1, force3D: true },
          );
          // ease to a stop under the mouse, so a pass can be picked
          const ease = (e: Event) =>
            gsap.to(loop, {
              timeScale: e.type === "pointerenter" && (e as PointerEvent).pointerType === "mouse" ? 0 : 1,
              duration: 0.7,
              ease: "power2.out",
            });
          row.addEventListener("pointerenter", ease);
          row.addEventListener("pointerleave", ease);
          return () => {
            row.removeEventListener("pointerenter", ease);
            row.removeEventListener("pointerleave", ease);
          };
        });

        gsap.fromTo(
          q("[data-row]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: q("[data-rows]")[0], start: "top 85%", toggleActions: "play none none none" },
          },
        );
        return () => off.forEach((f) => f());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="mentorship" className="bg-[#ffdf8f] py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title="Special"
          accent="Mentorship"
          intro="CXO masterclasses on campus — gain insights from leadership driving real-world impact."
        />

        {/* the rows, within the page's width, their ends fading into it */}
        <div
          data-rows
          className="mt-8 space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] sm:space-y-4 lg:mt-12"
        >
          {ROWS.map((row, r) => (
            <div key={r} data-row className="overflow-hidden py-1 motion-reduce:overflow-x-auto">
              <ul data-track className="flex w-max will-change-transform">
                {[...row.clips, ...row.clips].map((v, i) => (
                  <Pass
                    key={`${v.id}-${i}`}
                    v={v}
                    copy={i >= row.clips.length}
                    onPlay={() => play(v)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
