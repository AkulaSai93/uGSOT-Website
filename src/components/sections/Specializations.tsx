"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/**
 * "New-Gen Engineering Specializations"
 *
 * Copy from sot.upgrad.com — heading, intro and the six domains, verbatim.
 *
 * Tile art (public/images/specializations/v4) was generated with Figma AI after
 * the "Two years. One serious transformation." cards on sot.upgrad.com/catalyst:
 * one hero object that tells the domain's story (a neural-glass brain, a
 * laptop mid-build, a quantum chandelier, chained blocks, a locked shield, a
 * cloud over servers) lit on a dark striped stage, with glossy icon tiles
 * floating round it. Every tile has its own tint (violet, navy, teal, emerald,
 * crimson, sky) and keeps its lower area dark for the white title.
 *
 * Layout: expanding panels. All six sit side by side as tall strips; the
 * active one (hovered, focused or tapped — AI/ML to start) widens to show its
 * art, title and line while the rest narrow to a numbered spine with the name
 * set vertically. Below lg the strips stack and the active one opens in height
 * instead. Chosen over another pinned scroll scene because the page already
 * has four; this shows all six at once and needs no scroll hijack.
 *
 * Motion is all GSAP: panel width (flex-grow) or height, image settle, and the
 * title/line hand-off. The tweens on a panel's inner parts use overwrite:true,
 * which also cancels tweens still waiting on a delay — with "auto" a delayed
 * fade queued by an earlier hover could fire later and leave a closed strip
 * showing its title, or an open one its spine label. The size tween on the
 * panel itself must stay overwrite:"auto" (only its own properties): the panel
 * also carries the section's scroll-in reveal (opacity/y), and overwrite:true
 * would kill that reveal and leave the strips faded out.
 * Hover waits a beat (70ms) before switching, so a quick pass doesn't flicker.
 */
/** `fit` places each picture in the open panel (nearly square on desktop,
 *  taller than wide on phones): the wide AI & ML and Cloud pictures have their
 *  subject right of centre, so they sit to the right; the square Blockchain
 *  picture keeps its top chain link clear of the panel's top edge.
 *
 *  `phone` is for those two wide pictures on phones, where a cover crop of the
 *  near-square panel cut off the icons round the subject: the picture is
 *  sized to the panel's width so the whole group (subject and its four
 *  icons) fits across it, centred — `w` the picture's width and `left` its
 *  offset, both as shares of the panel's width — and centred top to bottom,
 *  the thin bands left above and below filled with the picture's own edge
 *  colours (`bg`) so they don't show. */
const SPECIALIZATIONS = [
  {
    title: "Artificial Intelligence & Machine Learning",
    short: "AI & Machine Learning",
    body: "Build intelligent systems that learn and adapt",
    key: "aiml",
    fit: "object-[70%_50%] lg:object-[96%_50%]",
    phone: { w: "176%", left: "-67.4%", bg: "linear-gradient(180deg,#250d53,#33106a)" },
  },
  {
    title: "FullStack Web Development",
    short: "FullStack Web Development",
    body: "Create modern web applications end-to-end",
    key: "webdev",
    fit: "object-center",
  },
  {
    title: "Quantum Computing",
    short: "Quantum Computing",
    body: "Explore next-generation computational power",
    key: "quantum",
    fit: "object-center",
  },
  {
    title: "Blockchain",
    short: "Blockchain",
    body: "Master decentralized technologies and Web3",
    key: "blockchain",
    fit: "object-center lg:object-[50%_15%]",
  },
  {
    title: "Cybersecurity",
    short: "Cybersecurity",
    body: "Protect systems with advanced security practices",
    key: "cybersecurity",
    fit: "object-center",
  },
  {
    title: "Cloud Innovation",
    short: "Cloud Innovation",
    body: "Design scalable cloud-native architectures",
    key: "cloud",
    fit: "object-[70%_50%] lg:object-[92%_50%]",
    phone: { w: "180%", left: "-69.7%", bg: "linear-gradient(180deg,#052661,#092c6a)" },
  },
] as const;

const HOVER_INTENT_MS = 70;

function Panel({
  spec,
  index,
  active,
  onActivate,
  onHover,
  onHoverEnd,
}: {
  spec: (typeof SPECIALIZATIONS)[number];
  index: number;
  active: boolean;
  onActivate: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article
      data-reveal-item
      data-panel
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={spec.title}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onActivate()}
      // Classes give the first paint (before GSAP takes over with inline styles).
      className={`group relative isolate min-w-0 cursor-pointer overflow-hidden rounded-[6px] bg-ink outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 lg:basis-0 ${
        active ? "max-lg:h-[380px] lg:grow-[6]" : "max-lg:h-[76px] lg:grow"
      }`}
    >
      {/* zoom comes from GSAP only: Tailwind's scale-* uses the separate CSS
          `scale` property and would compound with GSAP's transform */}
      <div
        data-img
        className={`absolute inset-0 -z-10 max-lg:[background:var(--phone-bg)] ${active ? "" : "opacity-55"}`}
        style={"phone" in spec ? { ["--phone-bg" as string]: spec.phone.bg } : undefined}
      >
        {"phone" in spec ? (
          // phones: the whole picture, sized to the panel's width (see `phone`)
          <div
            className="absolute inset-0 max-lg:inset-auto max-lg:left-[var(--pl)] max-lg:top-1/2 max-lg:aspect-[1536/864] max-lg:w-[var(--pw)] max-lg:-translate-y-1/2"
            style={{ ["--pw" as string]: spec.phone.w, ["--pl" as string]: spec.phone.left }}
          >
            <Image
              src={`/images/specializations/v4/${spec.key}.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 180vw"
              className={`object-cover ${spec.fit}`}
            />
          </div>
        ) : (
          <Image
            src={`/images/specializations/v4/${spec.key}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover ${spec.fit}`}
          />
        )}
      </div>
      {/* scrim: heavy at the bottom for the copy, lighter on the closed spines */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.8)_100%)]"
      />

      {/* index: top-left; on a mobile bar it sits level with the name */}
      <span className="absolute left-5 top-[30px] font-mono text-[12px] leading-4 text-white/70 lg:top-5">
        {n}
        <span data-total className={active ? "" : "opacity-0"}>
          {" "}
          / 06
        </span>
      </span>

      {/* closed: the name runs up the spine (desktop) or across the bar (mobile) */}
      <span
        aria-hidden
        data-closed
        className={`absolute whitespace-nowrap font-display text-[15px] font-semibold tracking-[-0.01em] text-white max-lg:left-14 max-lg:top-[38px] max-lg:-translate-y-1/2 lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 lg:rotate-180 lg:[writing-mode:vertical-rl] ${
          active ? "opacity-0" : ""
        }`}
      >
        {spec.short}
      </span>

      {/* open: title and line rise in once the panel has widened */}
      <div
        data-open
        // fixed width on desktop: the copy is clipped while the strip widens
        // rather than re-wrapping word by word into a narrow column
        className={`absolute bottom-0 left-0 p-6 max-lg:right-0 lg:w-[600px] lg:p-8 ${active ? "" : "invisible opacity-0"}`}
      >
        <h3 className="max-w-[520px] font-display text-[clamp(1.375rem,2vw,1.875rem)] font-bold leading-tight tracking-[-0.02em] text-white">
          {spec.title}
        </h3>
        <p className="mt-2 max-w-[420px] text-[14.5px] leading-snug text-white/80">
          {spec.body}
        </p>
      </div>
    </article>
  );
}

export function Specializations() {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const settled = useRef(false);

  // which axis the panels grow along: width (lg+) or height (below)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      if (desktop === null || !list.current) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // first run (and any breakpoint change) applies the state instantly
      const t = settled.current && !reduced ? 1 : 0;
      settled.current = true;

      gsap.utils
        .toArray<HTMLElement>("[data-panel]", list.current)
        .forEach((panel, i) => {
          const on = i === active;
          const q = gsap.utils.selector(panel);

          gsap.to(
            panel,
            desktop
              ? {
                  flexGrow: on ? 6 : 1,
                  height: "auto",
                  duration: 1.1 * t,
                  ease: "expo.out",
                  overwrite: "auto",
                }
              : {
                  height: on ? 380 : 76,
                  flexGrow: 0,
                  duration: 0.9 * t,
                  ease: "expo.out",
                  overwrite: "auto",
                },
          );
          gsap.to(q("[data-img]"), {
            scale: on ? 1 : 1.12,
            opacity: on ? 1 : 0.55,
            duration: 1.4 * t,
            ease: "expo.out",
            overwrite: true,
          });
          gsap.to(q("[data-closed]"), {
            autoAlpha: on ? 0 : 1,
            duration: (on ? 0.2 : 0.5) * t,
            delay: on ? 0 : 0.35 * t,
            ease: "power2.out",
            overwrite: true,
          });
          gsap.to(q("[data-total]"), {
            autoAlpha: on ? 1 : 0,
            duration: 0.4 * t,
            overwrite: true,
          });
          gsap.to(
            q("[data-open]"),
            on
              ? {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9 * t,
                  delay: 0.3 * t,
                  ease: "expo.out",
                  overwrite: true,
                }
              : {
                  autoAlpha: 0,
                  y: 24,
                  duration: 0.25 * t,
                  ease: "power2.out",
                  overwrite: true,
                },
          );
        });
    },
    { dependencies: [active, desktop], scope: list },
  );

  const hover = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), HOVER_INTENT_MS);
  };
  const hoverEnd = () => window.clearTimeout(hoverTimer.current);

  return (
    <section id="specializations" className="relative bg-canvas py-12 lg:py-28">
      <div className="container-page relative">
        <SectionHeading
          title="New-Gen Engineering"
          accent="Specializations"
          intro={
            <>
              Explore future-focused domains shaping the next decade of
              technology
              <br className="hidden sm:block" /> AI / ML, Cloud, Blockchain and
              many more
            </>
          }
        />

        <div ref={list}>
          <Reveal
            stagger={0.07}
            className="mt-14 flex flex-col gap-3 lg:h-[clamp(440px,62vh,560px)] lg:flex-row"
          >
            {SPECIALIZATIONS.map((spec, i) => (
              <Panel
                key={spec.key}
                spec={spec}
                index={i}
                active={active === i}
                onActivate={() => {
                  window.clearTimeout(hoverTimer.current);
                  setActive(i);
                }}
                onHover={() => hover(i)}
                onHoverEnd={hoverEnd}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
