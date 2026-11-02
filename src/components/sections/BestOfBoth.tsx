"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * "Where World-Class University Meets Silicon Valley Learning"
 *
 * Motion is modelled on the courso.framer.website section: a tall track holds a
 * `position: sticky` stage; the headline is split into two halves that start
 * off-screen left and right and slide inward, while the media between them
 * narrows to nothing — so the two halves close into a single line. The ten
 * feature cards then reveal below.
 *
 * Progress is one rAF-throttled handler writing two CSS custom properties:
 *   --a      headline converge + media narrow
 *   --lift   headline travels to the top of the frame
 *   --cards  panels fade up underneath it
 * They run in sequence, not together: the panels must not appear while the
 * heading is still moving, or the two overlap mid-flight.
 *
 * Below lg, and for prefers-reduced-motion, the pinning is skipped entirely and
 * the section renders as a plain heading + card grid: a pinned stage that eats
 * scroll is hostile on a phone.
 *
 * CENTRE VIDEO: currently the hero footage (CloudFront, webm + mp4). The
 * section's own clip is on disk at public/videos/best-of-both.mp4. The slot
 * keeps a brand-tinted panel behind the video so there is never a black flash
 * before the first frame decodes.
 *
 * Sizing follows the reference, whose stage is 900x570 in a 1440 viewport —
 * about 62% of the width and 63% of the height.
 */
/** Hero footage, reused here for now. The file supplied for this section is
 *  kept at public/videos/best-of-both.mp4 and can be swapped back in by
 *  pointing VIDEO_BASE's <source> list at it. */
const HERO_VIDEO =
  "https://dd848r0fq5a5i.cloudfront.net/asset-optimization/video/landing_herosection_video/landing_herosection_video";

/* The heading is two lines sliced vertically down the middle: the left block
   holds the start of both lines, the right block the end. Converged they read
   "Where World-Class University" / "Meets Silicon Valley Learning". */
const HEAD_LEFT = ["Where World-", "Meets Silicon\u00a0"];
const HEAD_RIGHT = ["Class University", "Valley Learning"];

type Item = { title: string; body: string; icon: string };

const UNIVERSITY: Item[] = [
  {
    title: "State-of-the-Art Campus",
    body: "Modern infrastructure and world-class facilities for an enriching experience.",
    icon: "universityadvantage-1.avif",
  },
  {
    title: "Engineering Degree",
    body: "UGC-recognized programs designed for tomorrow's challenges.",
    icon: "universityadvantage-2.avif",
  },
  {
    title: "Vibrant University Life",
    body: "Diverse community, clubs, events and endless opportunities.",
    icon: "universityadvantage-3.avif",
  },
  {
    title: "Interdisciplinary Curriculum",
    body: "Learn beyond boundaries with a multidisciplinary approach.",
    icon: "universityadvantage-4.avif",
  },
  {
    title: "Fully Residential Campus",
    body: "Safe, inclusive and immersive campus experience.",
    icon: "universityadvantage-5.avif",
  },
];

const SILICON: Item[] = [
  {
    title: "Sessions by MAANG Engineers",
    body: "Learn directly from experts working at top global companies.",
    icon: "siliconvalley-1.avif",
  },
  {
    title: "Coding from Day 1",
    body: "Build real-world projects and strengthen fundamentals.",
    icon: "siliconvalley-2.avif",
  },
  {
    title: "AI-First Campus",
    body: "Leverage AI tools and frameworks in everything you build.",
    icon: "siliconvalley-3.avif",
  },
  {
    title: "CXO Masterclasses",
    body: "Gain insights from leadership driving real-world impact.",
    icon: "siliconvalley-4.avif",
  },
  {
    title: "Tech with Management",
    body: "Blend technology with business and leadership skills.",
    icon: "siliconvalley-5.avif",
  },
];

/**
 * Centre art: student cut-out with "University Advantage" and "Silicon Valley
 * Style Learning" lettered either side, after the "Same College / Bigger
 * Future" art on sot.upgrad.com/catalyst. Supplied as one transparent image.
 */
function CentreStudent() {
  return (
    <Image
      src="/images/advantage/student-both.webp"
      alt="A student with both the University Advantage and Silicon Valley Style Learning"
      width={1179}
      height={1334}
      sizes="300px"
      className="h-auto w-full select-none"
      // fade the cropped bottom edge out into the page background
      style={{
        maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
      }}
    />
  );
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

function Rows({ items, dark }: { items: Item[]; dark: boolean }) {
  return (
    <ul className="mt-5 flex flex-1 flex-col">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`group -mx-2 flex flex-1 items-center gap-4 rounded-2xl px-2 py-2 transition-colors duration-300 ${
            dark ? "hover:bg-white/[0.08]" : "hover:bg-black/[0.03]"
          } ${
            i > 0
              ? dark
                ? "border-t border-white/[0.14]"
                : "border-t border-black/[0.06]"
              : ""
          }`}
        >
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-[14px] transition-transform duration-300 group-hover:scale-105 ${
              dark ? "bg-white/15" : "bg-[#f3f4f6]"
            }`}
          >
            <Image
              src={`/images/advantage/${item.icon}`}
              alt=""
              width={24}
              height={24}
              className={`size-[22px] object-contain ${dark ? "brightness-0 invert" : ""}`}
            />
          </span>
          <span className="min-w-0">
            <span
              className={`block text-[15px] font-semibold leading-snug ${
                dark ? "text-white" : "text-[#0a0a0b]"
              }`}
            >
              {item.title}
            </span>
            <span
              className={`mt-0.5 block text-[14px] leading-snug ${
                dark ? "text-white/85" : "text-[#444]"
              }`}
            >
              {item.body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Card styling follows the "Your College / uGSOT Catalyst" pair on
   sot.upgrad.com/catalyst: 28px radius, hairline ring + long soft drop
   shadow, a huge ghost wordmark behind the title, and on the red card a
   147deg gradient with an oversized chevron. Vertical padding is tighter than
   the reference so both cards fit the pinned frame under the heading. */
function Panel({
  watermark,
  title,
  tagline,
  items,
  dark,
}: {
  watermark: string;
  title: string;
  tagline: string;
  items: Item[];
  dark: boolean;
}) {
  return (
    <div
      className={`relative isolate flex h-full flex-col overflow-hidden rounded-xl px-8 pb-6 pt-[68px] ${
        dark
          ? ""
          : "border border-black/[0.08] bg-white"
      }`}
      style={
        dark
          ? {
              backgroundImage:
                "linear-gradient(147deg, #ee1a24 0%, #e6161f 40%, #b90c14 100%)",
            }
          : undefined
      }
    >
      {dark && (
        <svg
          aria-hidden
          viewBox="0 0 100 200"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full text-white/[0.07]"
          fill="currentColor"
        >
          <path d="M0 0h38l62 100-62 100H0l62-100z" />
        </svg>
      )}

      {/* oversized ghost wordmark, clipped by the card */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-7 top-3 -z-10 select-none whitespace-nowrap font-display text-[clamp(3rem,4.4vw,4rem)] font-extrabold leading-[0.8] tracking-[-0.04em] ${
          dark ? "text-white/[0.14]" : "text-black/[0.07]"
        }`}
      >
        {watermark}
      </span>

      <h3
        className={`font-display text-[clamp(1rem,1.4vw,1.25rem)] font-extrabold uppercase leading-tight ${
          dark ? "text-white" : "text-[#0a0a0b]"
        }`}
      >
        {title}
      </h3>
      <span
        aria-hidden
        className={`mt-3 block h-[3px] w-11 rounded-full ${
          dark ? "bg-white/55" : "bg-[#e6161f]"
        }`}
      />
      <p
        className={`mt-3 text-[15px] ${dark ? "text-white/80" : "text-[#444]"}`}
      >
        {tagline}
      </p>

      <Rows items={items} dark={dark} />
    </div>
  );
}

export function BestOfBoth() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);

  // decide once whether the pinned treatment applies
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setAnimated(lg.matches && !reduce.matches);
    decide();
    lg.addEventListener("change", decide);
    reduce.addEventListener("change", decide);
    return () => {
      lg.removeEventListener("change", decide);
      reduce.removeEventListener("change", decide);
    };
  }, []);

  // scroll -> --a (converge) and --b (reveal)
  useEffect(() => {
    if (!animated) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const r = track.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;

      // Three phases, strictly in order, so nothing overlaps:
      //   --a     0.00 -> 0.55  video narrows, headline halves close
      //   --lift  0.55 -> 0.74  headline travels to the top of the frame
      //   --cards 0.78 -> 0.95  panels fade up underneath it
      stage.style.setProperty("--a", String(clamp(p / 0.55, 0, 1)));
      stage.style.setProperty("--lift", String(clamp((p - 0.55) / 0.19, 0, 1)));
      stage.style.setProperty(
        "--cards",
        String(clamp((p - 0.78) / 0.17, 0, 1)),
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [animated]);

  // Autoplay alone wasn't starting this video (loaded, readyState 4, but left
  // paused), which shows as an empty gradient panel. Start it explicitly once
  // the pinned stage exists, and again whenever it scrolls into view.
  useEffect(() => {
    if (!animated) return;
    const video = stageRef.current?.querySelector("video");
    if (!video) return;
    const play = () => {
      video.muted = true;
      void video.play().catch(() => {});
    };
    play();
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && play(),
      { threshold: 0.1 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [animated]);

  const headingClass =
    // Two lines rather than one, so the converged block is far narrower and
    // the type can be much larger: 5.2vw still clears a 48px gutter at 1024,
    // 1280 and 1440.
    "font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px] text-ink whitespace-nowrap";

  return (
    <section id="best-of-both" className="bg-white">
      {animated ? (
        <div ref={trackRef} className="relative" style={{ height: "260vh" }}>
          <div
            ref={stageRef}
            className="sticky top-0 h-screen overflow-hidden"
            style={{
              ["--a" as string]: 0,
              ["--lift" as string]: 0,
              ["--cards" as string]: 0,
            }}
          >
            <h2
              className="absolute left-1/2 top-1/2 grid w-full grid-cols-[1fr_auto_1fr] items-center"
              style={{
                transform:
                  "translate(-50%, calc(-50% - var(--lift) * (41vh - 53px)))",
              }}
            >
              <span className="sr-only">
                {HEAD_LEFT[0]}
                {HEAD_RIGHT[0]} {HEAD_LEFT[1]}
                {HEAD_RIGHT[1]}
              </span>
              {/* Both blocks sit flush against the media in the flex row — no
                  extra translate. All the movement comes from the video
                  narrowing, which pulls the halves together and keeps the copy
                  tight to the video edge the whole way (as in the reference,
                  where the outer words are clipped by the viewport). At the
                  widest video the halves sit entirely outside the viewport, so
                  the opening frame shows video only — no fade needed, the
                  geometry does it. */}
              <span
                aria-hidden
                className={`${headingClass} flex min-w-0 flex-col items-end text-right`}
                style={{ opacity: "clamp(0, (var(--a) - 0.05) * 6, 1)" }}
              >
                {HEAD_LEFT.map((line, i) => (
                  <span key={line} className="block">
                    {i === 1 ? (
                      <>
                        Meets{" "}
                        <span className="text-[#e6161f]">Silicon</span>
                        {"\u00a0"}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </span>

              {/* Media narrows horizontally only — it keeps full height right
                  down to a sliver, as in the reference. The outer span carries
                  the animated WIDTH but zero height, so the headline row is
                  only as tall as the text and still centres (and later lifts)
                  correctly; the video itself is absolutely positioned and
                  vertically centred inside it. */}
              <span
                aria-hidden
                className="relative block h-0 shrink-0"
                style={{
                  width: "calc((1 - var(--a)) * 62vw)",
                  marginInline: "calc((1 - var(--a)) * 12px)",
                }}
              >
                <span className="absolute left-0 top-1/2 block w-full -translate-y-1/2 overflow-hidden rounded-lg bg-[linear-gradient(145deg,#e9edf4,#f3e6e8)] [height:min(68vh,620px)]">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="size-full object-cover"
                  >
                    <source src={`${HERO_VIDEO}.webm`} type="video/webm" />
                    <source src={`${HERO_VIDEO}.mp4`} type="video/mp4" />
                  </video>
                </span>
              </span>

              <span aria-hidden className={`${headingClass} flex min-w-0 flex-col items-start text-left`}
                style={{ opacity: "clamp(0, (var(--a) - 0.05) * 6, 1)" }}>
                {HEAD_RIGHT.map((line, i) => (
                  <span
                    key={line}
                    className={`block ${i === 1 ? "text-[#e6161f]" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </span>
            </h2>

            {/* panels share the pinned frame, sliding up under the heading */}
            <div
              className="absolute inset-x-0"
              style={{
                top: "calc(9vh + 140px)",
                opacity: "var(--cards)",
                transform: "translateY(calc((1 - var(--cards)) * 36px))",
              }}
            >
              <div className="container-page">
                <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(200px,300px)_minmax(0,1fr)] lg:gap-3">
                  <Panel
                    watermark="UNIVERSITY"
                    title="University Advantage"
                    tagline="Gives you the foundation"
                    items={UNIVERSITY}
                    dark={false}
                  />
                  {/* sits on the cards' baseline, as on sot.upgrad.com/catalyst */}
                  <div className="hidden items-end justify-center lg:flex">
                    <CentreStudent />
                  </div>
                  <Panel
                    watermark="SILICON"
                    title="Silicon Valley Style Learning"
                    tagline="Helps you go further"
                    items={SILICON}
                    dark
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-page pt-14 lg:pt-16">
          <h2 className="mx-auto max-w-3xl text-center font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px] text-ink">
            {HEAD_LEFT[0]}
            {HEAD_RIGHT[0]} Meets{" "}
            <span className="text-[#e6161f]">
              Silicon {HEAD_RIGHT[1]}
            </span>
          </h2>
        </div>
      )}
    </section>
  );
}
