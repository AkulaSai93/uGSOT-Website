"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import { MENTOR_CLIPS, SPEAKERS, thumb, type ChannelVideo } from "@/components/site/channel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Special Mentorship" — a coverflow of sessions, after quadcse.com's
 * carousels.
 *
 * Every session is real: upGrad's leadership — Ronnie Screwvala and Vishwa
 * Mohan — speaking to students on campus, from upGrad School of Technology's
 * own YouTube channel (see site/channel.ts), each with the clip's own title.
 * The line under the heading is sot.upgrad.com's for its "CXO Masterclasses".
 *
 * Layout: the clips as 4:5 cards in a row (the thumbnails' own shape, so they
 * fill them), the one in focus in the middle, full size and lit; the rest
 * step back to either side, smaller, lower and dimmed, fading out past two
 * either way, with the same gap between every pair. Under them the focused session —
 * its count, who gives it and its title — with previous/next arrows and a
 * dash per session to jump to.
 *
 * Motion (GSAP): the cards glide to their places whenever the focus moves
 * (expo ease). It moves on by itself every few seconds while the section is
 * on screen, and waits a while after anyone takes a hand: the arrows, a dash,
 * a click on a side card (which brings it to the middle), a swipe or the
 * arrow keys. A click on the middle card plays it in the player overlay.
 * Under reduced motion the cards jump to their places and it never moves on
 * by itself.
 */
const N = MENTOR_CLIPS.length;
/** seconds each session stays in focus on its own */
const AUTO_SECONDS = 3;
/** how many turns the carousel sits out after someone takes a hand */
const HOLD_TURNS = 1;
const pad = (n: number) => String(n).padStart(2, "0");
/** card widths (px); the cards are 4:5, the shape of the thumbnails */
const CARD_W = { phone: 220, desktop: 300 };

/** a card's distance from the focus, the short way round */
const offset = (i: number, active: number) => {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
};

export function Mentorship() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState(0);
  const [playing, setPlaying] = useState<Video | null>(null);
  /** turns left to sit out before moving on by itself again */
  const hold = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const go = (i: number) => {
    setActive(((i % N) + N) % N);
    hold.current = HOLD_TURNS;
  };
  const play = (v: ChannelVideo) =>
    setPlaying({ id: v.id, name: v.title, thumb: thumb(v), vertical: v.short });

  // the stage's width sets the spacing between cards
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // each card glides to its place round the focus. Cards are placed by their
  // scaled widths, so the space between any two neighbours is the same.
  useGSAP(
    () => {
      if (!width) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = width < 640;
      const cardW = small ? CARD_W.phone : CARD_W.desktop;
      const gap = small ? 12 : 20;
      const scaleAt = (a: number) => 1 - Math.min(a, 3) * 0.14;
      /** centre of the card `a` steps from the focus, from the middle */
      const xAt = (a: number) => {
        let x = 0;
        for (let k = 1; k <= a; k++) x += (cardW / 2) * (scaleAt(k - 1) + scaleAt(k)) + gap;
        return x;
      };
      gsap.utils.toArray<HTMLElement>("[data-mcard]", stage.current).forEach((el, i) => {
        const d = offset(i, active);
        const a = Math.abs(d);
        gsap.to(el, {
          x: Math.sign(d) * xAt(a),
          y: a * 18,
          scale: scaleAt(a),
          autoAlpha: a > 2 ? 0 : 1,
          filter: `brightness(${a === 0 ? 1 : 0.55})`,
          zIndex: 10 - a,
          duration: reduce ? 0 : 0.6,
          ease: "expo.out",
          overwrite: true,
        });
      });
    },
    { scope: root, dependencies: [active, width] },
  );

  // moves on by itself while on screen, unless someone has just taken a hand
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.3 });
    if (stage.current) io.observe(stage.current);
    const id = window.setInterval(() => {
      if (!inView || playing) return;
      if (hold.current > 0) {
        hold.current -= 1;
        return;
      }
      setActive((a) => (a + 1) % N);
    }, AUTO_SECONDS * 1000);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [playing]);

  // the section rises in as it arrives
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-rise]",
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: stage.current, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = MENTOR_CLIPS[active];
  const who = current.speaker ? SPEAKERS[current.speaker] : null;

  return (
    <section ref={root} id="mentorship" className="overflow-x-clip bg-[#ffdf8f] py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title="Special"
          accent="Mentorship"
          intro="CXO masterclasses on campus — gain insights from leadership driving real-world impact."
        />
      </div>

      {/* the cards, round the one in focus; swipe or use the arrow keys */}
      <div
        ref={stage}
        data-rise
        role="region"
        aria-roledescription="carousel"
        aria-label="Mentorship sessions"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 10) drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          if (d && Math.abs(e.clientX - d.x) > 40) go(active + (e.clientX < d.x ? 1 : -1));
        }}
        className="relative mx-auto mt-10 h-[315px] max-w-[1440px] touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[415px] lg:mt-14"
      >
        <ul>
          {MENTOR_CLIPS.map((v, i) => {
            const on = i === active;
            const speaker = v.speaker ? SPEAKERS[v.speaker] : null;
            return (
              <li
                key={v.id}
                data-mcard
                className="absolute left-[calc(50%-110px)] top-0 w-[220px] sm:left-[calc(50%-150px)] sm:w-[300px]"
              >
                <button
                  type="button"
                  tabIndex={Math.abs(offset(i, active)) > 1 ? -1 : 0}
                  aria-label={on ? `Play: ${v.title}` : `Show: ${v.title}`}
                  onClick={() => {
                    if (drag.current?.moved) return;
                    if (on) play(v);
                    else go(i);
                  }}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-ink text-left shadow-[0_24px_50px_-24px_rgba(11,13,18,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Image
                    src={thumb(v)}
                    alt=""
                    fill
                    sizes="300px"
                    draggable={false}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.75)_100%)]"
                  />
                  {/* play, on the card in focus */}
                  <span
                    aria-hidden
                    className={`absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-accent group-hover:text-white ${
                      on ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                  >
                    <Play size={20} fill="currentColor" strokeWidth={0} className="translate-x-[2px]" />
                  </span>
                  {/* who, on the card in focus (the side cards stay clean) */}
                  {speaker && (
                    <span
                      className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                    >
                      <span className="block font-display text-[15px] font-bold leading-tight text-white">
                        {speaker.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-white/75">{speaker.role}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* the session in focus, with the arrows and a dash per session */}
      <div data-rise className="container-page mt-6 sm:mt-8">
        <div className="mx-auto flex max-w-[640px] items-center gap-4">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous session"
            className="grid size-11 shrink-0 place-items-center rounded-[6px] border border-ink/15 bg-white text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>

          <div className="min-w-0 flex-1 text-center" aria-live="polite">
            <div key={current.id} className="animate-rise">
              <p className="font-mono text-[12px] text-ink/50">
                {pad(active + 1)} / {pad(N)}
                {who && <span className="text-ink"> · {who.name}</span>}
              </p>
              <p className="mt-1.5 line-clamp-2 font-display text-[clamp(1rem,1.6vw,1.25rem)] font-bold leading-snug tracking-[-0.02em] text-ink">
                {current.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next session"
            className="grid size-11 shrink-0 place-items-center rounded-[6px] border border-ink/15 bg-white text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
          >
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>

        <ul className="mt-5 flex items-center justify-center gap-1.5">
          {MENTOR_CLIPS.map((v, i) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Session ${i + 1}: ${v.title}`}
                aria-current={i === active || undefined}
                className="grid h-5 place-items-center"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    i === active ? "w-8 bg-ink" : "w-3 bg-ink/25 hover:bg-ink/50"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
