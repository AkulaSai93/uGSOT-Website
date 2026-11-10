"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "In the Spotlight"
 *
 * Copy, videos and thumbnails are sot.upgrad.com's Spotlight row: the podcast
 * appearances other than the Raj Shamani episode, which has its own block
 * above (IITRace).
 *
 * Motion after the testimonials on onefin.framer.website, in the site's light
 * theme: the section holds the screen while you scroll through it. The
 * podcast cards start as one big overlapping pile over the heading, each
 * leaning back and turned in 3D; scrubbed by the scroll they all drift out
 * together towards the edges, flattening and settling as they go, until the
 * heading sits uncovered in the middle. Every card plays its video in the player overlay.
 * Below lg there is no hold: the heading, then the cards on a strip that
 * drifts right to left without end (easing to a stop under the mouse); under
 * reduced motion it holds still and scrolls sideways.
 */
const v = (id: string, name: string): Video => ({
  id,
  name,
  thumb: `/images/spotlight/${id}.jpg`,
});

/** each card's resting place: centre x (% of the page's content width, so
 *  the cards stay inside it like every other section), centre y (% of the
 *  screen) and tilt (deg) — four along the top, one at each side, three below */
const CARDS: (Video & { x: number; y: number; rot: number })[] = [
  { ...v("SHc4jChkKxM", "Nitin Vijay"), x: 12, y: 25, rot: -6 },
  { ...v("62DTA1vKiQc", "Dr. GP Parmeshwara"), x: 37, y: 23, rot: 4 },
  { ...v("VW6o8kBMMec", "MS Chouhan"), x: 63, y: 24, rot: -3 },
  { ...v("88BOBhbr6Kk", "Sarvesh"), x: 88, y: 26, rot: 6 },
  { ...v("yvkFaqdWhsU", "Dr Vivek Veeriah"), x: 11, y: 52, rot: 5 },
  { ...v("JMiHXRkSS60", "GB Sir"), x: 89, y: 52, rot: -5 },
  { ...v("f6D1HfiAJSc", "Anand Sir"), x: 21, y: 79, rot: -4 },
  { ...v("mfreytCBQK4", "Ashu Sir"), x: 50, y: 79, rot: 3 },
  { ...v("aJ16Pt0rGjA", "Rahul Arora"), x: 79, y: 79, rot: 6 },
];
/** where the pile sits (% down the screen): the middle */
const PILE_Y = 50;
/** how each card sits in the pile: spin (deg), lean back (rotateX) and turn
 *  (rotateY), and its offset from dead centre (px). The offsets follow each
 *  card's place in the spread (top row up, left column left…) and balance out
 *  around the centre, so the pile is centred and the cards only overlap a little */
const PILE = [
  { r: -6, rx: 10, ry: -14, dx: -162, dy: -107 },
  { r: 4, rx: 8, ry: 10, dx: -55, dy: -113 },
  { r: -3, rx: 10, ry: -8, dx: 55, dy: -110 },
  { r: 6, rx: 8, ry: 14, dx: 162, dy: -104 },
  { r: -5, rx: 10, ry: -16, dx: -172, dy: 3 },
  { r: 4, rx: 8, ry: 16, dx: 172, dy: -3 },
  { r: -4, rx: 10, ry: -10, dx: -107, dy: 107 },
  { r: 2, rx: 12, ry: 4, dx: 0, dy: 0 },
  { r: 5, rx: 8, ry: 12, dx: 107, dy: 110 },
];

function Card({ c, onOpen }: { c: Video; onOpen: (v: Video) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(c)}
      aria-label={`Play podcast: ${c.name}`}
      className="group block w-full rounded-[6px] border border-ink/10 bg-white p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="relative block aspect-video overflow-hidden rounded-[4px] bg-sunken">
        <Image
          src={c.thumb}
          alt=""
          fill
          sizes="280px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <span className="absolute left-2 top-2 rounded-[4px] bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
          Podcast
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-2.5">
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[14px] font-semibold text-ink">
            {c.name}
          </span>
          <span className="block text-[12px] text-body">Podcast</span>
        </span>
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-accent"
        >
          <Play
            size={12}
            fill="currentColor"
            strokeWidth={0}
            className="translate-x-[1px]"
          />
        </span>
      </span>
    </button>
  );
}

export function Spotlight() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0];
      const layer = q("[data-layer]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // one 3D pile in the middle drifts out to the edges, all together,
          // flattening as it goes; scrubbed by the scroll through the held
          // screen. Each card has its own tween in one timeline (rather than one
          // staggered tween) so every card starts in the pile: with a stagger,
          // GSAP only set a card's piled starting state once its turn came, and
          // the later cards sat spread out from the start.
          const cards = gsap.utils.toArray<HTMLElement>(q("[data-card]"));
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          cards.forEach((el, i) => {
            tl.fromTo(
              el,
              {
                x: () =>
                  ((50 - Number(el.dataset.x)) / 100) * layer.offsetWidth +
                  PILE[i].dx,
                y: () =>
                  ((PILE_Y - Number(el.dataset.y)) / 100) * layer.offsetHeight +
                  PILE[i].dy,
                rotation: PILE[i].r - Number(el.dataset.rot),
                rotationX: PILE[i].rx,
                rotationY: PILE[i].ry,
                scale: 0.96,
                transformPerspective: 1200,
              },
              {
                x: 0,
                y: 0,
                rotation: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                ease: "power1.inOut",
                duration: 1,
                immediateRender: true,
              },
              i * 0.03,
            );
          });
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          // the strip drifts right to left without end (rendered twice and
          // slid by half its width, so the seam never shows), easing to a stop
          // under the mouse so a card can be picked
          const strip = q("[data-strip]")[0];
          const loop = gsap.fromTo(
            q("[data-strack]"),
            { xPercent: 0 },
            { xPercent: -50, duration: 45, ease: "none", repeat: -1, force3D: true },
          );
          const ease = (e: Event) =>
            gsap.to(loop, {
              timeScale: e.type === "pointerenter" && (e as PointerEvent).pointerType === "mouse" ? 0 : 1,
              duration: 0.7,
              ease: "power2.out",
            });
          strip.addEventListener("pointerenter", ease);
          strip.addEventListener("pointerleave", ease);
          gsap.fromTo(
            strip,
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: { trigger: strip, start: "top 90%", toggleActions: "play none none none" },
            },
          );
          return () => {
            strip.removeEventListener("pointerenter", ease);
            strip.removeEventListener("pointerleave", ease);
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="spotlight" className="bg-canvas max-lg:py-8">
      {/* lg+: a tall track; the screen inside holds while the cards fly out */}
      <div data-track className="relative lg:h-[280vh]">
        <div
          data-stage
          className="relative lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden"
        >
          <div className="container-page flex h-full items-center justify-center">
            <SectionHeading
              title="In the"
              accent="Spotlight"
              intro="Recognised by leading institutions, featured across top media platforms, and trusted by industry leaders"
            />
          </div>

          {/* the cards: one pile over the heading to start, then around it */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {/* positioned within the content box, inside the page padding */}
            <div className="container-page h-full">
              <div data-layer className="relative h-full">
                {CARDS.map((c) => (
                  <div
                    key={c.id}
                    className="pointer-events-auto absolute w-[min(19vw,30vh,270px)]"
                    style={{
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
                    }}
                  >
                    <div data-card data-x={c.x} data-y={c.y} data-rot={c.rot}>
                      <Card c={c} onOpen={setPlaying} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* below lg: the cards on a moving strip under the heading, its ends
          fading into the page */}
      <div
        data-strip
        className="mt-10 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto lg:hidden"
      >
        <ul data-strack className="flex w-max will-change-transform">
          {[...CARDS, ...CARDS].map((c, i) => (
            <li
              key={`${c.id}-${i}`}
              aria-hidden={i >= CARDS.length || undefined}
              inert={i >= CARDS.length}
              className="mr-4 w-[min(72vw,280px)] shrink-0"
            >
              <Card c={c} onOpen={setPlaying} />
            </li>
          ))}
        </ul>
      </div>

      {playing && (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      )}
    </section>
  );
}
