"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlowButton } from "@/components/site/GlowButton";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/**
 * "One Degree, Three Pathways"
 *
 * Titles are sot.upgrad.com's (the curved art uses a two-short-line cut of
 * each, the full title stays in the heading for screen readers); descriptions
 * are shortened so they can be set large.
 *
 * Dark scene, after makro.framer.website: when the section reaches the middle
 * of the screen the whole section fades to black in one timed GSAP tween (not
 * scrubbed, so there is no muddy grey half-state), and fades back to white
 * when you scroll out above it. The nav switches to its dark style over the
 * same stretch (see Navbar). Colours live in --pw-* tokens on the section;
 * the shared heading reads them through --heading-fg / --heading-muted.
 *
 * Cards: three in a clean row, all fully visible. Black face inside a 1px
 * silver sheen border (the ConsultTitans service cards), white type, soft
 * white glow at the top — no red. On hover the border's light streaks slide
 * round the edge (gradient angle 124° → 172°, GSAP), as on the reference.
 *
 * Entrance (desktop, ported from the madewithgsap.com fanned cards): the
 * section pins for 40vh of scroll per card; each scroll step brings the next
 * card in — up from below, tilted, blurred, with an elastic pop from 0.94 —
 * landing level in its slot in the row. Scrolling back takes them out again.
 * Below 901px and for reduced motion there is no pin: the cards are a swipe
 * row that rises in once.
 */
const PATHS = [
  {
    n: "01",
    title: "High Paying Job Opportunities",
    lines: ["High Paying", "Jobs"],
    body: "Get industry-ready with hands-on coding, hackathons and strong placement support.",
  },
  {
    n: "02",
    title: "Startup Support",
    lines: ["Startup", "Support"],
    body: "Launch your startup while you study, with mentorship, incubation and seed funding.",
  },
  {
    n: "03",
    title: "Research & Higher Studies",
    lines: ["Research &", "Studies"],
    body: "Build research skills and prepare for GRE, IELTS and top global universities.",
  },
] as const;

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

/** Silver sheen border from the reference cards. Its angle lives in
 *  --sheen (degrees) so hover can swing it, as the reference does: 124° at
 *  rest, 172° on hover — the bright streaks slide round the edge. */
const SHEEN =
  "linear-gradient(calc(var(--sheen) * 1deg), rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 23.5%, rgba(255,255,255,0) 36%, rgba(255,255,255,0.8) 53%, rgba(255,255,255,0.1) 78%, rgba(255,255,255,0.1) 100%)";
const SHEEN_REST = 124;
const SHEEN_HOVER = 172;

function Card({ path }: { path: (typeof PATHS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const swing = (to: number) =>
    gsap.to(ref.current, { "--sheen": to, duration: 0.7, ease: "power3.out", overwrite: "auto" });

  return (
    <div
      ref={ref}
      data-path-card
      onMouseEnter={() => swing(SHEEN_HOVER)}
      onMouseLeave={() => swing(SHEEN_REST)}
      className="group relative mx-auto aspect-[0.85] w-full max-w-[360px] rounded-[6px] p-px transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2"
      style={{ "--sheen": SHEEN_REST, backgroundImage: SHEEN } as React.CSSProperties}
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[5px] bg-[#0b0b0c] py-10 text-center text-white">
        {/* soft white glow at the top, brighter on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(80% 55% at 50% 0%, rgba(255,255,255,0.14), transparent 72%)",
          }}
        />
        <div className="relative">
          <ArcTitle lines={path.lines} id={`path-${path.n}`} light />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[52%] -translate-y-1/2 text-[130px] font-medium leading-none text-white/10"
        >
          {Number(path.n)}
        </span>
        <div className="relative px-[10%]">
          <h3 className="sr-only">{path.title}</h3>
          <p className="text-[16px] font-medium leading-[1.45] text-white/75">{path.body}</p>
        </div>
      </div>
    </div>
  );
}

/** Closing call to action (sot.upgrad.com copy) */
function PathwayCta() {
  return (
    <div className="flex flex-col items-center gap-5 border-t border-[color:var(--pw-line)] pt-6 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <h3 className="font-display text-[20px] font-bold leading-tight tracking-[-0.02em] text-[color:var(--pw-fg)]">
          Ready to choose your{" "}
          <span className="font-[family-name:var(--font-bricolage)] font-semibold text-accent">
            pathway?
          </span>
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--pw-muted)]">
          Take uGNET to unlock a tech career, startup support, or higher studies
          &mdash; all through one degree.
        </p>
        <p className="mt-1 text-[13px] font-medium text-[color:var(--pw-muted)] opacity-80">
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
  );
}

const ELASTIC = "elastic.out(1, 0.3)";
const SCROLL_PER_CARD_VH = 40;

const LIGHT = {
  "--pw-bg": "#ffffff",
  "--pw-fg": "#0b0d12",
  "--pw-muted": "#3d4452",
  "--pw-line": "rgba(11,13,18,0.1)",
};
const DARK = {
  "--pw-bg": "#000000",
  "--pw-fg": "#ffffff",
  "--pw-muted": "rgba(255,255,255,0.65)",
  "--pw-line": "rgba(255,255,255,0.14)",
};

export function Pathways() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  // timed fade to black while the section holds the middle of the screen.
  // Checked from the live position on each scroll (same rule as the nav), so
  // it stays right when the section changes height between layouts.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dark: boolean | null = null;
    const check = () => {
      const r = section.getBoundingClientRect();
      const h = window.innerHeight;
      const next = r.top < h * 0.55 && r.bottom > h * 0.45;
      if (next === dark) return;
      dark = next;
      gsap.to(section, {
        ...(next ? DARK : LIGHT),
        duration: reduced ? 0 : 0.7,
        ease: "power2.inOut",
        overwrite: true,
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // pinned scroll steps on desktop; plain swipe row otherwise
  const [pinned, setPinned] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
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

  // desktop: each scroll step pops the next card into its slot
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const grid = cardsRef.current;
    if (!track || !grid) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-path-card]", grid);
    gsap.set(cards, { autoAlpha: 0 });

    let current = -1;
    const show = (i: number, on: boolean) => {
      const el = cards[i];
      if (!el) return;
      if (on) {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 90, rotation: (i - 1) * 6, scale: 0.94, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "expo.out",
            overwrite: true,
          },
        );
        gsap.to(el, { scale: 1, duration: 0.7, ease: ELASTIC });
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          y: 60,
          scale: 0.96,
          filter: "blur(8px)",
          duration: 0.35,
          ease: "power2.in",
          overwrite: true,
        });
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // nothing before the pin starts; one more card per equal step after
        const raw = self.progress <= 0 ? -1 : Math.floor(self.progress * PATHS.length);
        const next = Math.min(raw, PATHS.length - 1);
        if (next === current) return;
        if (next > current) for (let i = current + 1; i <= next; i++) show(i, true);
        else for (let i = current; i > next; i--) show(i, false);
        current = next;
      },
      onLeaveBack: () => {
        for (let i = current; i >= 0; i--) show(i, false);
        current = -1;
      },
    });
    return () => {
      trigger.kill();
      gsap.set(cards, { clearProps: "all" });
    };
  }, [pinned]);

  // phones / reduced motion: the row rises in once
  useEffect(() => {
    if (pinned) return;
    const grid = cardsRef.current;
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      grid.querySelectorAll("[data-path-card]"),
      { y: 60, autoAlpha: 0, filter: "blur(10px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        clearProps: "filter",
        scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [pinned]);

  // The pinned layout makes the section much taller than the first render, so
  // every trigger on the page (the dark fade, the nav, sections below) must
  // re-measure once it is in place. Declared last so it runs after the rest.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pinned]);

  const heading = (
    <SectionHeading
      title="One Degree,"
      accent="Three Pathways"
      intro="A successful tech career, your own startup, or pursue higher education."
      size={pinned ? "md" : "lg"}
      className={pinned ? "[@media(max-height:820px)]:[&_p]:hidden" : ""}
    />
  );

  const row = (
    <div
      ref={cardsRef}
      className={
        pinned
          ? "grid grid-cols-3 justify-items-center gap-6"
          : "-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]"
      }
    >
      {PATHS.map((path) => (
        <div
          key={path.n}
          className={
            pinned
              ? // sized so heading + cards + CTA fit one screen, even short ones
                "w-full max-w-[min(360px,calc((100svh-330px)*0.85))]"
              : "w-[78vw] max-w-[360px] shrink-0 snap-center"
          }
        >
          <Card path={path} />
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="pathways"
      className="bg-[var(--pw-bg)]"
      style={
        {
          ...LIGHT,
          "--heading-fg": "var(--pw-fg)",
          "--heading-muted": "var(--pw-muted)",
        } as React.CSSProperties
      }
    >
      {pinned ? (
        <div ref={trackRef} style={{ height: `calc(100vh + ${PATHS.length * SCROLL_PER_CARD_VH}vh)` }}>
          <div className="sticky top-0 flex h-screen flex-col justify-center gap-[clamp(1.25rem,3.5vh,2.5rem)] overflow-hidden pt-[60px]">
            <div className="container-page">{heading}</div>
            <div className="container-page">{row}</div>
            <div className="container-page">
              <PathwayCta />
            </div>
          </div>
        </div>
      ) : (
        <div className="container-page py-8">
          {heading}
          {row}
          <div className="mt-16">
            <PathwayCta />
          </div>
        </div>
      )}
    </section>
  );
}
