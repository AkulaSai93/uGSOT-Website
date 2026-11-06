"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import { CAMPUS_CLIPS, MENTOR_CLIPS, thumb, type ChannelVideo } from "@/components/site/channel";
import { INSTAGRAM, YOUTUBE } from "@/components/site/socials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Follow Our Journey on Instagram & YouTube" — after the client's reference
 * (wizerdui.com's "Start Your Project with US" band).
 *
 * The moments are real: every tile is a clip from upGrad School of
 * Technology's own YouTube channel (orientation weeks at both campuses, the
 * founding batch's kick-off, a coding battle, sessions with upGrad's
 * leadership — see site/channel.ts), and the two handles are the school's real
 * Instagram and YouTube, as linked from sot.upgrad.com.
 *
 * Layout: a black band; the heading and its line centred in white, then
 * "Follow on Instagram" and "Subscribe on YouTube"; under them a field of
 * square tiles in three rows — the clips, with the two channels' own icons
 * among them like apps on a phone — fading out from the middle. A clip plays
 * in the player overlay when clicked; an icon opens its channel.
 *
 * Motion (GSAP): the rows drift sideways without end, each its own way and
 * pace (rendered twice and slid by half their width, so the seam never
 * shows); a row eases to a stop under the mouse, or while the keyboard is on
 * one of its tiles, so a clip can be picked. The buttons and the field rise in as the
 * band arrives. Under reduced motion the rows hold still.
 */
type Tile = { clip: ChannelVideo } | { channel: typeof INSTAGRAM };

const IG: Tile = { channel: INSTAGRAM };
const YT: Tile = { channel: YOUTUBE };
const c = (i: number): Tile => ({ clip: CAMPUS_CLIPS[i] });
const m = (i: number): Tile => ({ clip: MENTOR_CLIPS[i] });

/** each row's tiles, the way it drifts and how long one pass takes */
const ROWS: { tiles: Tile[]; left: boolean; seconds: number }[] = [
  { tiles: [c(0), c(1), c(2), IG, c(3), c(4), YT, c(5), c(6)], left: true, seconds: 34 },
  { tiles: [m(0), m(1), m(2), YT, m(3), m(4), m(5), IG, m(6), m(7)], left: false, seconds: 42 },
  { tiles: [c(3), m(5), IG, c(6), m(1), c(0), YT, m(7), c(4), m(2)], left: true, seconds: 38 },
];

const TILE =
  "relative block size-[84px] overflow-hidden rounded-[6px] outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent sm:size-[112px]";

function TileItem({ t, copy, onPlay }: { t: Tile; copy: boolean; onPlay: (v: ChannelVideo) => void }) {
  return (
    <li aria-hidden={copy || undefined} className="mr-3 shrink-0 sm:mr-4">
      {"clip" in t ? (
        <button
          type="button"
          tabIndex={copy ? -1 : undefined}
          onClick={() => onPlay(t.clip)}
          aria-label={`Play: ${t.clip.title}`}
          className={`group bg-white/5 ring-1 ring-white/10 ${TILE}`}
        >
          <Image
            src={thumb(t.clip)}
            alt=""
            fill
            sizes="112px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <span
            aria-hidden
            className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-accent"
          >
            <Play size={10} fill="currentColor" strokeWidth={0} className="translate-x-[0.5px]" />
          </span>
        </button>
      ) : (
        // a channel's icon, like an app on a phone
        <a
          href={t.channel.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy ? -1 : undefined}
          aria-label={`upGrad School of Technology on ${t.channel.label}`}
          className={`grid place-items-center text-white ${TILE} ${
            t.channel.label === "YouTube"
              ? "bg-[#ff0000]"
              : "bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)]"
          }`}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-[40%]" fill="currentColor">
            <path d={t.channel.path} />
          </svg>
        </a>
      )}
    </li>
  );
}

export function Social() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const play = (v: ChannelVideo) =>
    setPlaying({ id: v.id, name: v.title, thumb: thumb(v), vertical: v.short });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // focus holds a row only while tabbing through it: a clip clicked or
        // tapped gets focus back when its player closes, and its row should
        // move on
        let tabbing = false;
        const key = (e: KeyboardEvent) => {
          if (e.key === "Tab") tabbing = true;
        };
        const pointer = () => {
          tabbing = false;
        };
        window.addEventListener("keydown", key);
        window.addEventListener("pointerdown", pointer);

        const off = q("[data-row]").map((row, i) => {
          const { left, seconds } = ROWS[i];
          const loop = gsap.fromTo(
            row.querySelector("[data-track]"),
            { xPercent: left ? 0 : -50 },
            { xPercent: left ? -50 : 0, duration: seconds, ease: "none", repeat: -1, force3D: true },
          );
          // ease to a stop under the mouse or keyboard focus, so a clip can be picked
          let hovered = false;
          let focused = false;
          const ease = () =>
            gsap.to(loop, { timeScale: hovered || focused ? 0 : 1, duration: 0.7, ease: "power2.out" });
          const events = [
            ["pointerenter", (e: Event) => (hovered = (e as PointerEvent).pointerType === "mouse")],
            ["pointerleave", () => (hovered = false)],
            ["focusin", () => (focused = tabbing)],
            ["focusout", () => (focused = false)],
          ] as const;
          const handlers = events.map(([e, set]) => {
            const h = (ev: Event) => {
              set(ev);
              ease();
            };
            row.addEventListener(e, h);
            return () => row.removeEventListener(e, h);
          });
          return () => handlers.forEach((f) => f());
        });

        gsap.fromTo(
          q("[data-rise]"),
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.15,
            scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none none" },
          },
        );
        return () => {
          off.forEach((f) => f());
          window.removeEventListener("keydown", key);
          window.removeEventListener("pointerdown", pointer);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="social" className="overflow-x-clip bg-ink py-14 lg:py-24">
      <div className="container-page">
        {/* the heading and its line, centred, in white */}
        <div
          style={
            {
              "--heading-fg": "#ffffff",
              "--heading-muted": "rgba(255,255,255,0.72)",
            } as React.CSSProperties
          }
        >
          <SectionHeading
            title="Follow Our Journey on"
            accent="Instagram & YouTube"
            breakBeforeAccent
            intro="Orientation weeks, coding battles and sessions with upGrad's leadership — straight from campus."
          />
        </div>

        <div data-rise className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <a
            href={INSTAGRAM.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-[6px] bg-white px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
              <path d={INSTAGRAM.path} />
            </svg>
            Follow on Instagram
          </a>
          <a
            href={YOUTUBE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 text-[14.5px] font-semibold text-white"
          >
            {/* a live dot, in YouTube's red */}
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ff0000] opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-[#ff0000]" />
            </span>
            <span className="underline-offset-4 group-hover:underline">Subscribe on YouTube</span>
          </a>
        </div>
      </div>

      {/* the field: three rows, fading out from the middle */}
      <div
        data-rise
        className="mx-auto mt-12 max-w-[1100px] space-y-3 overflow-hidden py-2 [mask-image:radial-gradient(ellipse_72%_62%_at_50%_50%,#000_40%,transparent_100%)] sm:space-y-4 sm:[mask-image:radial-gradient(ellipse_50%_62%_at_50%_50%,#000_45%,transparent_100%)] lg:mt-16"
      >
        {ROWS.map((row, r) => (
          <div key={r} data-row>
            <ul data-track className="flex w-max will-change-transform">
              {[...row.tiles, ...row.tiles].map((t, i) => (
                <TileItem
                  key={i}
                  t={t}
                  copy={i >= row.tiles.length}
                  onPlay={play}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
