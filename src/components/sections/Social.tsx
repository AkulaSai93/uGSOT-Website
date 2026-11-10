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
 * (wizerdui.com's "Start Your Project with US" band), kept clean.
 *
 * The moments are real: every tile is a clip from upGrad School of
 * Technology's own YouTube channel (orientation weeks at both campuses, the
 * founding batch's kick-off, a coding battle, sessions with upGrad's
 * leadership — see site/channel.ts), and the two handles are the school's real
 * Instagram and YouTube, as linked from sot.upgrad.com.
 *
 * Layout: on the white page, the heading and its line centred, then the two
 * handles as outlined buttons, each with its brand icon (after Scaler's); under
 * them a field of square tiles in three rows — the clips, with one Instagram
 * and one YouTube icon among them like apps on a phone — fading out from the
 * middle. A clip plays in the player overlay when clicked (its play mark shows
 * on hover); an icon opens its channel.
 *
 * Motion (GSAP): the rows drift sideways without end, each its own way and
 * pace (rendered twice and slid by half their width, so the seam never
 * shows); a row eases to a stop under the mouse, or while the keyboard is on
 * one of its tiles, so a clip can be picked. The buttons and the field rise in
 * as the section arrives. Under reduced motion the rows hold still.
 */
type Tile = { clip: ChannelVideo } | { channel: typeof INSTAGRAM };

const c = (i: number): Tile => ({ clip: CAMPUS_CLIPS[i] });
const m = (i: number): Tile => ({ clip: MENTOR_CLIPS[i] });

/** each row's tiles, the way it drifts and how long one pass takes */
const ROWS: { tiles: Tile[]; left: boolean; seconds: number }[] = [
  { tiles: [c(0), c(1), c(2), { channel: INSTAGRAM }, c(3), c(4), c(5), c(6)], left: true, seconds: 36 },
  { tiles: [m(0), m(1), m(2), m(3), m(4), { channel: YOUTUBE }, m(5), m(6), m(7)], left: false, seconds: 44 },
  { tiles: [c(3), m(5), c(6), m(1), c(0), m(7), c(4), m(2)], left: true, seconds: 40 },
];

const TILE =
  "relative block size-[88px] overflow-hidden rounded-[6px] outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent sm:size-[120px]";

function TileItem({ t, copy, onPlay }: { t: Tile; copy: boolean; onPlay: (v: ChannelVideo) => void }) {
  return (
    <li aria-hidden={copy || undefined} className="mr-3 shrink-0 sm:mr-5">
      {"clip" in t ? (
        <button
          type="button"
          tabIndex={copy ? -1 : undefined}
          onClick={() => onPlay(t.clip)}
          aria-label={`Play: ${t.clip.title}`}
          className={`group bg-ink/5 ${TILE}`}
        >
          <Image
            src={thumb(t.clip)}
            alt=""
            fill
            sizes="120px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          {/* play, only on hover or focus */}
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25 group-focus-visible:bg-black/25"
          >
            <span className="grid size-9 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
              <Play size={13} fill="currentColor" strokeWidth={0} className="translate-x-[1px]" />
            </span>
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
    <section ref={root} id="social" className="overflow-x-clip bg-canvas py-10 lg:py-24">
      <div className="container-page">
        <SectionHeading
          title="Follow Our Journey on"
          accent="Instagram & YouTube"
          breakBeforeAccent
          intro="Orientation weeks, coding battles and sessions with upGrad's leadership — straight from campus."
        />

        {/* the two channels, as Scaler shows them: each handle with its
            brand icon, in an outlined button */}
        <div data-rise className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          {(
            [
              [INSTAGRAM, "@upgrad_schooloftech", "bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)]"],
              [YOUTUBE, "@upGradSchoolofTechnology", "bg-[#ff0000]"],
            ] as const
          ).map(([s, handle, tint]) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${handle} on ${s.label}`}
              className="inline-flex items-center justify-center gap-3 rounded-[6px] border border-ink/15 bg-white px-5 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white sm:px-6 sm:text-[16px]"
            >
              <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-[6px] text-white ${tint}`}>
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </span>
              {handle}
            </a>
          ))}
        </div>
      </div>

      {/* the field: three rows, fading out from the middle */}
      <div
        data-rise
        className="mx-auto mt-12 max-w-[1100px] space-y-3 overflow-hidden py-2 [mask-image:radial-gradient(ellipse_72%_62%_at_50%_50%,#000_40%,transparent_100%)] sm:space-y-5 sm:[mask-image:radial-gradient(ellipse_50%_62%_at_50%_50%,#000_45%,transparent_100%)] lg:mt-16"
      >
        {ROWS.map((row, r) => (
          <div key={r} data-row>
            <ul data-track className="flex w-max will-change-transform">
              {[...row.tiles, ...row.tiles].map((t, i) => (
                <TileItem key={i} t={t} copy={i >= row.tiles.length} onPlay={play} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
