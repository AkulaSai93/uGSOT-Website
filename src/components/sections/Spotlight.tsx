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
 * Below lg (and for reduced motion) there is no hold: the heading, then the
 * cards in a grid.
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
  { ...v("yvkFaqdWhsU", "Dr Vivek Veeriah"), x: 11, y: 55, rot: 5 },
  { ...v("JMiHXRkSS60", "GB Sir"), x: 89, y: 54, rot: -5 },
  { ...v("f6D1HfiAJSc", "Anand Sir"), x: 21, y: 84, rot: -4 },
  { ...v("mfreytCBQK4", "Ashu Sir"), x: 50, y: 85, rot: 3 },
  { ...v("aJ16Pt0rGjA", "Rahul Arora"), x: 79, y: 84, rot: 6 },
];
/** where the pile sits (% down the screen): above the middle, so it shows
 *  close under the block before this one rather than after a stretch of white */
const PILE_Y = 34;
/** how each card sits in the pile: spin (deg), lean back (rotateX) and turn
 *  (rotateY), and a small offset from dead centre (px) so the pile fans */
const PILE = [
  { r: -9, rx: 16, ry: -22, dx: -120, dy: -60 },
  { r: 5, rx: 12, ry: 18, dx: 90, dy: -80 },
  { r: -3, rx: 20, ry: -10, dx: -30, dy: -110 },
  { r: 8, rx: 14, ry: 24, dx: 150, dy: -20 },
  { r: -6, rx: 18, ry: -26, dx: -170, dy: 30 },
  { r: 4, rx: 10, ry: 20, dx: 160, dy: 60 },
  { r: -7, rx: 16, ry: -16, dx: -90, dy: 90 },
  { r: 2, rx: 22, ry: 8, dx: 10, dy: 40 },
  { r: 7, rx: 12, ry: 22, dx: 110, dy: 110 },
];

function Card({ c, onOpen }: { c: Video; onOpen: (v: Video) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(c)}
      aria-label={`Play podcast: ${c.name}`}
      className="group block w-full rounded-[6px] border border-ink/10 bg-white p-2 text-left shadow-[0_24px_48px_-24px_rgba(11,13,18,0.45)] outline-none transition-shadow duration-300 hover:shadow-[0_30px_60px_-24px_rgba(11,13,18,0.55)] focus-visible:ring-2 focus-visible:ring-accent"
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
          // flattening as it goes; scrubbed by the scroll through the held screen
          gsap.fromTo(
            q("[data-card]"),
            {
              x: (i, el) =>
                ((50 - Number(el.dataset.x)) / 100) * layer.offsetWidth +
                PILE[i].dx,
              y: (i, el) =>
                ((PILE_Y - Number(el.dataset.y)) / 100) * layer.offsetHeight +
                PILE[i].dy,
              rotation: (i, el) => PILE[i].r - Number(el.dataset.rot),
              rotationX: (i) => PILE[i].rx,
              rotationY: (i) => PILE[i].ry,
              scale: 1.12,
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
              stagger: 0.03,
              scrollTrigger: {
                trigger: track,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            q("[data-mcard]"),
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: q("[data-mgrid]")[0],
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="spotlight" className="bg-canvas max-lg:py-20">
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

      {/* below lg: the cards in a grid under the heading */}
      <div
        data-mgrid
        className="container-page mt-12 grid gap-4 sm:grid-cols-2 lg:hidden"
      >
        {CARDS.map((c) => (
          <div key={c.id} data-mcard>
            <Card c={c} onOpen={setPlaying} />
          </div>
        ))}
      </div>

      {playing && (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      )}
    </section>
  );
}
