"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import type { Campus } from "./campuses";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * About the university — sot.upgrad.com's own "about" copy and films for it,
 * then its facilities (Academic, Wellness & Fitness, Integrated Campus Living,
 * Sports): the photos and lines are the university page's.
 *
 * Layout: centred across the section, the university's name (in the accent) and its
 * two paragraphs. Under that its films: the virtual tour large,
 * the other three stacked beside it (in a row under it on phones); each opens in the player overlay. Then "Campus Facilities": a switch, one tab per group, and
 * that group's three places as a bento: one large photo on the left, two
 * stacked on the right, each titled in white over a dark foot. With a mouse
 * a photo tilts toward the pointer in 3D (the photo drifting the other way, a
 * soft light following) and its line rises in under the title on hover; on
 * touch screens the line is always shown. On phones
 * the tabs sit two by two and the photos become a swipeable row.
 *
 * Motion (GSAP): on a switch the photos wipe in from the right, one after
 * another, settling from a slight zoom, and the captions rise after them. The
 * tab highlight slides to the chosen tab. Reduced motion: they swap at once.
 */
export function CampusAbout({ campus }: { campus: Campus }) {
  const root = useRef<HTMLElement>(null);
  const [group, setGroup] = useState(0);
  const [playing, setPlaying] = useState<Video | null>(null);
  const items = campus.facilities[group].items;
  const [main, ...rest] = campus.videos;

  // the bento wipes in whenever the group changes (and on first arrival)
  const first = useRef(true);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: first.current
            ? {
                trigger: "[data-bento]",
                start: "top 80%",
                toggleActions: "play none none none",
              }
            : undefined,
        });
        tl.fromTo(
          "[data-photo]",
          { clipPath: "inset(0 0 0 100%)" },
          {
            clipPath: "inset(0 0 0 0%)",
            duration: 1.1,
            stagger: 0.1,
            // let a lifted card (and its shadow) reach past its cell
            clearProps: "clipPath",
          },
          0,
        )
          .fromTo(
            "[data-photo] img",
            { scale: 1.15 },
            { scale: 1, duration: 1.6, stagger: 0.1 },
            0,
          )
          .fromTo(
            "[data-cap]",
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
            0.4,
          );
        first.current = false;
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [group] },
  );

  /** lift a photo toward the viewer and tilt it to the pointer (mouse only,
   *  and not under reduced motion): the card rises and turns in perspective
   *  over a deep shadow, the photo zooms and drifts the other way, and a soft
   *  light follows the pointer */
  const tilt = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const li = e.currentTarget;
    const r = li.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(li.querySelector("[data-tilt]"), {
      rotateY: px * 10,
      rotateX: -py * 10,
      y: -14,
      scale: 1.04,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(li.querySelector("[data-depth]"), {
      x: -px * 18,
      y: -py * 18,
      scale: 1.08,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
    const glare = li.querySelector<HTMLElement>("[data-glare]");
    glare?.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    glare?.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const untilt = (e: React.PointerEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    gsap.to(li.querySelector("[data-tilt]"), {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "expo.out",
      overwrite: "auto",
    });
    gsap.to(li.querySelector("[data-depth]"), {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={root}
      id="about"
      className="overflow-x-clip bg-canvas py-8 lg:py-20"
    >
      <div className="container-page">
        {/* the university: its name and the page's own copy, centred across the section */}
        <div className="text-center">
          <SectionHeading
            title="About"
            accent={campus.name}
            breakBeforeAccent
          />
          <div
            data-about-copy
            className="mt-6 space-y-4 text-[15px] leading-[1.7] text-body lg:mt-8 lg:text-[16px]"
          >
            {campus.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        {/* the films: the main one large, the rest stacked beside it (in a row under it on phones) */}
        <div
          data-about-films
          className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 lg:mt-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-4"
        >
          {main && <Film campus={campus} v={main} large onPlay={setPlaying} />}
          <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:grid-rows-3 lg:gap-4">
            {rest.map((v) => (
              <li
                key={v.vimeo}
                className="lg:min-h-0 lg:[&>button]:aspect-auto lg:[&>button]:h-full"
              >
                <Film campus={campus} v={v} onPlay={setPlaying} />
              </li>
            ))}
          </ul>
        </div>

        {/* the campus, a group at a time */}
        <h3 className="mt-14 text-center font-display text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.025em] text-ink lg:mt-24">
          Campus{" "}
          <span className="font-[family-name:var(--font-bricolage)] font-semibold text-accent">
            Facilities
          </span>
        </h3>

        {/* one tab per group */}
        <div className="mt-6 flex justify-center lg:mt-8">
          <div
            role="tablist"
            aria-label="Campus facilities"
            className="grid w-full grid-cols-2 gap-1 rounded-[6px] border border-ink/10 bg-white p-1 sm:flex sm:w-auto"
          >
            {campus.facilities.map((g, i) => (
              <button
                key={g.group}
                type="button"
                role="tab"
                aria-selected={i === group}
                onClick={() => setGroup(i)}
                className={`shrink-0 rounded-[6px] px-4 py-2.5 text-[14px] font-semibold transition-colors duration-300 sm:px-5 ${
                  i === group ? "bg-ink text-white" : "text-body hover:text-ink"
                }`}
              >
                {g.group}
              </button>
            ))}
          </div>
        </div>

        {/* the group's three places: one large, two stacked (a swipeable row on phones) */}
        <ul
          key={group}
          data-bento
          role="tabpanel"
          className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] max-lg:-mx-5 max-lg:px-5 lg:mt-8 lg:grid lg:h-[560px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-rows-2 lg:gap-4 lg:overflow-visible"
        >
          {items.map((it, i) => (
            <li
              key={it.title}
              data-photo
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className={`group relative aspect-[4/5] hover:z-10 w-[78vw] max-w-[340px] shrink-0 snap-center [perspective:1000px] sm:aspect-[4/3] lg:aspect-auto lg:w-auto lg:max-w-none ${
                i === 0 ? "lg:row-span-2" : ""
              }`}
            >
              {/* the card, tilted toward the pointer */}
              <div
                data-tilt
                className="relative size-full overflow-hidden rounded-[6px] bg-ink transition-shadow duration-500 [transform-style:preserve-3d] [will-change:transform] [@media(hover:hover)]:group-hover:shadow-[0_45px_70px_-25px_rgba(11,13,18,0.6)]"
              >
                {/* the photo, a little larger than the card so it can drift the other way */}
                <div data-depth className="absolute -inset-4">
                  <Image
                    src={`/images/campuses/${campus.slug}/${it.img}.webp`}
                    alt={it.title}
                    fill
                    quality={90}
                    sizes={
                      i === 0
                        ? "(min-width: 1024px) 60vw, 80vw"
                        : "(min-width: 1024px) 40vw, 80vw"
                    }
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)] transition-opacity duration-500 [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:group-hover:opacity-100"
                />
                {/* a soft light where the pointer is */}
                <span
                  aria-hidden
                  data-glare
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.22),transparent_55%)] [@media(hover:hover)]:group-hover:opacity-100"
                />
                <div
                  data-cap
                  className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6"
                >
                  <h3
                    className={`font-display font-bold leading-tight tracking-[-0.02em] ${
                      i === 0
                        ? "text-[clamp(1.125rem,2vw,1.625rem)]"
                        : "text-[clamp(1.0625rem,1.5vw,1.25rem)]"
                    }`}
                  >
                    {it.title}
                  </h3>
                  {/* the line: always shown on touch screens, revealed on hover elsewhere */}
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100">
                    <p className="min-h-0 overflow-hidden">
                      <span className="block max-w-[420px] pt-1.5 text-[13px] leading-snug text-white/85 lg:text-[14px]">
                        {it.text}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
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

/** one of the university's films: its thumbnail (with its own title on it)
 *  and a play button; opens in the player overlay */
function Film({
  campus,
  v,
  large = false,
  onPlay,
}: {
  campus: Campus;
  v: Campus["videos"][number];
  large?: boolean;
  onPlay: (v: Video) => void;
}) {
  const thumb = `/images/campuses/${campus.slug}/${v.thumb}.webp`;
  return (
    <button
      type="button"
      onClick={() =>
        onPlay({
          id: v.vimeo,
          name: v.title,
          thumb,
          src: `https://player.vimeo.com/video/${v.vimeo}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`,
        })
      }
      aria-label={`Play: ${v.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-[6px] bg-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Image
        src={thumb}
        alt=""
        fill
        quality={90}
        sizes={
          large
            ? "(min-width: 1024px) 900px, 100vw"
            : "(min-width: 1024px) 300px, 33vw"
        }
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30"
      />
      <span
        aria-hidden
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white ${
          large ? "size-16 lg:size-[72px]" : "size-8 sm:size-9"
        }`}
      >
        <Play
          size={large ? 22 : 12}
          fill="currentColor"
          strokeWidth={0}
          className="translate-x-[1px]"
        />
      </span>
    </button>
  );
}
