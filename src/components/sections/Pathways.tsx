"use client";

import { useEffect, useRef, useState } from "react";
import { GlowButton } from "@/components/site/GlowButton";

/**
 * "One Degree, Three Pathways"
 *
 * Titles are sot.upgrad.com's (the curved art uses a two-short-line cut of
 * each, the full title stays in the heading for screen readers); descriptions are shortened so they can be set
 * large, as on the reference card.
 *
 * Motion is a port of the fanned-cards section on madewithgsap.com (their
 * app2.js, `.h-cards`):
 *  - a full-screen stage is pinned for 40vh of scroll per card (shorter than
 *    the reference's full viewport, so the cards arrive sooner)
 *  - each card sits at the top of its own 3675px circle; circle i is rotated
 *    i × 6.2°, so the cards fan out along a shallow arc
 *  - scroll progress is split into equal steps; entering step i switches card
 *    i on with an elastic pop from 0.94 scale, and the whole set of circles
 *    springs to −i × 3.1° so the fan stays centred
 *  - scrolling back switches cards off again
 * Their elastic.out(0.6, 0.3) is reproduced with a CSS linear() easing.
 *
 * Below 900px (and for prefers-reduced-motion) there is no pin: the cards sit
 * in a horizontal, snap-scrolling row, as on the reference.
 */
const PATHS = [
  {
    n: "01",
    title: "High-Paying Job Opportunities",
    lines: ["High-Paying", "Jobs"],
    body: "Get industry-ready with hands-on coding, hackathons and strong placement support.",
    red: true,
  },
  {
    n: "02",
    title: "Startup Support",
    lines: ["Startup", "Support"],
    body: "Launch your startup while you study, with mentorship, incubation and seed funding.",
    red: false,
  },
  {
    n: "03",
    title: "Research & Higher Studies",
    lines: ["Research &", "Studies"],
    body: "Build research skills and prepare for GRE, IELTS and top global universities.",
    red: true,
  },
] as const;

const STEP = 6.2; // degrees between neighbouring cards
const RADIUS = 1837.5; // circle radius in px (3675 / 2)

/** GSAP's elastic.out(amplitude 1, period 0.3) sampled into a CSS linear() */
const ELASTIC = (() => {
  const p = 0.3;
  const s = p / 4;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const v =
      t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin(((t - s) * 2 * Math.PI) / p) + 1;
    pts.push(v.toFixed(4));
  }
  return `linear(${pts.join(", ")})`;
})();

/**
 * Two-line title on two concentric upward arcs, like the reference's curved
 * art, set close together so the pair reads as a single block.
 */
const ARC = { cx: 169, cy: 220, r1: 170, r2: 128, half: 0.9 }; // half = half-angle (rad)

function arcPath(r: number) {
  const dx = r * Math.sin(ARC.half);
  const y = ARC.cy - r * Math.cos(ARC.half);
  return `M ${(ARC.cx - dx).toFixed(1)} ${y.toFixed(1)} A ${r} ${r} 0 0 1 ${(ARC.cx + dx).toFixed(1)} ${y.toFixed(1)}`;
}

const RADII = [ARC.r1, ARC.r2];

/** One title size for every card (the reference's titles all match): the
 *  largest at which each card's longest line still fits its arc. Bold caps in
 *  Plus Jakarta Sans average ~0.6em per character. */
const TITLE_SIZE = Math.min(
  46,
  ...PATHS.flatMap((p) =>
    p.lines.map((l, i) => Math.floor((2 * RADII[i] * ARC.half * 0.96) / (l.length * 0.6))),
  ),
);

function ArcTitle({ lines, id, light }: { lines: readonly string[]; id: string; light: boolean }) {
  const radii = RADII;
  const size = TITLE_SIZE;
  return (
    <svg viewBox="0 0 338 145" className="w-full overflow-visible" aria-hidden>
      <defs>
        {radii.map((r, i) => (
          <path key={r} id={`${id}-${i}`} d={arcPath(r)} />
        ))}
      </defs>
      {lines.map((line, i) => (
        <text
          key={line}
          className={`font-bold uppercase ${light ? "fill-white" : "fill-[#0a0a0b]"}`}
          style={{ fontSize: size, letterSpacing: "-0.02em" }}
        >
          <textPath href={`#${id}-${i}`} startOffset="50%" textAnchor="middle">
            {line}
          </textPath>
        </text>
      ))}
    </svg>
  );
}

function Card({ path }: { path: (typeof PATHS)[number] }) {
  return (
    <div
      className={`relative mx-auto flex aspect-[0.85] w-full max-w-[338px] flex-col justify-between rounded-md py-10 text-center ${
        path.red ? "text-white" : "border border-[#0a0a0b] bg-white text-[#0a0a0b]"
      }`}
      // brand red gradient from sot.upgrad.com/catalyst
      style={
        path.red
          ? { backgroundImage: "linear-gradient(147deg, #ee1a24 0%, #e6161f 40%, #b90c14 100%)" }
          : undefined
      }
    >
      <ArcTitle lines={path.lines} id={`path-${path.n}`} light={path.red} />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-[52%] -translate-y-1/2 text-[130px] font-medium leading-none ${path.red ? "opacity-25" : "opacity-15"}`}
      >
        {Number(path.n)}
      </span>
      <div className="px-[10%]">
        <h3 className="sr-only">{path.title}</h3>
        <p className="text-[17px] font-medium leading-[1.45]">{path.body}</p>
      </div>
    </div>
  );
}

/** Closing call to action, part of the pinned frame (sot.upgrad.com copy) */
function PathwayCta() {
  return (
    <div className="container-page">
    <div className="flex flex-col items-center gap-5 border-t border-black/10 pt-5 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <h3 className="text-[20px] font-semibold leading-tight text-ink">
          Ready to choose your <span className="text-[#e6161f]">pathway?</span>
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-body">
          Take uGNET to unlock a tech career, startup support, or higher studies
          &mdash; all through one degree.
        </p>
        <p className="mt-1 text-[13px] font-medium text-muted">
          3 career pathways <span aria-hidden>&middot;</span> uGNET scholarship test{" "}
          <span aria-hidden>&middot;</span> 4-year B.Tech in CS
        </p>
      </div>
      <GlowButton href="#apply" className="shrink-0">
        Apply Now
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </GlowButton>
    </div>
    </div>
  );
}

export function Pathways() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const circlesRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(desktop.matches && !reduce.matches);
    sync();
    desktop.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const group = circlesRef.current;
    if (!track || !group) return;

    let current = -1;
    let frame = 0;

    const show = (i: number, on: boolean) => {
      const el = circleRefs.current[i];
      if (!el) return;
      el.style.visibility = on ? "visible" : "hidden";
      if (on) {
        el.animate(
          [
            { transform: `rotate(${i * STEP}deg) scale(0.94)` },
            { transform: `rotate(${i * STEP}deg) scale(1)` },
          ],
          { duration: 500, easing: ELASTIC },
        );
      }
    };

    const update = () => {
      frame = 0;
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const progress = -r.top / span;

      // before the pin starts nothing is shown (their onLeaveBack)
      let next = progress < 0 ? -1 : Math.floor(progress * PATHS.length);
      next = Math.min(next, PATHS.length - 1);
      if (next === current) return;

      if (next > current) for (let i = current + 1; i <= next; i++) show(i, true);
      else for (let i = current; i > next; i--) show(i, false);

      group.style.transform = `rotate(${-Math.max(next, 0) * (STEP / 2)}deg)`;
      current = next;
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
  }, [pinned]);

  const heading = (
    <header className="mx-auto max-w-[934px] px-6 text-center">
      <h2 className="font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px] text-ink">
        One Degree, <span className="text-[#e6161f]">Three Pathways</span>
      </h2>
      <p className="mt-3 font-display text-[clamp(0.9375rem,1.2vw,1rem)] font-normal leading-[1.6] text-muted">
        A successful tech career, your own startup, or pursue higher education.
      </p>
    </header>
  );

  return (
    <section id="pathways" className="bg-white">
      {pinned ? (
        <div ref={trackRef} style={{ height: `calc(100vh + ${PATHS.length * 40}vh)` }}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-x-0 top-[7vh] z-10">{heading}</div>
            <div className="absolute inset-x-0 bottom-[5vh] z-10 bg-white">
              <PathwayCta />
            </div>
            <div
              ref={circlesRef}
              className="relative aspect-square"
              style={{
                width: RADIUS * 2,
                marginTop: "49vh",
                marginLeft: `calc(50vw - ${RADIUS}px)`,
                transition: `transform 500ms ${ELASTIC}`,
              }}
            >
              {PATHS.map((path, i) => (
                <div
                  key={path.n}
                  ref={(el) => {
                    circleRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ visibility: "hidden", transform: `rotate(${i * STEP}deg)` }}
                >
                  <div style={{ transform: "translateY(-54%)" }}>
                    <Card path={path} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-14">
          {heading}
          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [scrollbar-width:none]">
            {PATHS.map((path) => (
              <div key={path.n} className="w-[80vw] max-w-[338px] shrink-0 snap-center">
                <Card path={path} />
              </div>
            ))}
          </div>
          <div className="mt-10 pb-14">
            <PathwayCta />
          </div>
        </div>
      )}
    </section>
  );
}
