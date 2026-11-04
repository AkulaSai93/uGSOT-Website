"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Your Innovation Toolkit, Included"
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line.
 *
 * Laptop after the MacBook Pro hero on apple.com (the client's reference),
 * made from our own pieces: a Figma AI render of a space-black MacBook Pro
 * seen from above the keyboard — camera notch, speaker grilles, Mac function
 * row — lid tilted back, on black (macbook-open.webp; no logo). It
 * was rendered with a chroma-green display, which is cut out, so the screen is
 * a hole; behind it sits a live code editor (CodeScreen), warped onto the
 * display's exact four corners with a CSS matrix3d, so it reads as the
 * laptop's own screen. On it, code types itself line by line — a model being
 * trained in Python, then a React dashboard — and the terminal below answers.
 *
 * The section turns black as it comes into view (a timed GSAP fade of its
 * --tk-* colour tokens, as on Pathways and Leaders) and back to white on the
 * way out; the nav turns dark over it.
 *
 * Motion (GSAP, scrubbed by the scroll): on desktop the section holds the
 * screen while the laptop rises into place and its display wakes. Below lg
 * there is no hold: it rises as it scrolls up to the middle of the screen.
 */

/** the render is 1536x864; the display's corners in it (top-left, top-right,
 *  bottom-right, bottom-left), let out a few pixels so the code runs under
 *  the bezel */
const PHOTO = { w: 1536, h: 864 };
const DISPLAY: [number, number][] = [
  [66, 79],
  [1469, 79],
  [1310, 551],
  [226, 553],
];

/** the code editor's own size before it is warped onto the display */
const SCREEN = { w: 1600, h: 1000 };

/** CSS matrix3d taking a w×h box onto the quad tl, tr, br, bl (in px) */
function quadMatrix(w: number, h: number, q: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const k = (dx1 * sy - sx * dy1) / den;
  const a = (x1 - x0 + g * x1) / w;
  const d = (y1 - y0 + g * y1) / w;
  const b = (x3 - x0 + k * x3) / h;
  const e = (y3 - y0 + k * y3) / h;
  return `matrix3d(${a},${d},0,${g / w},${b},${e},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}

/* ------------------------------------------------------------- the code */

type Tok = [string, string?];
const C = {
  kw: "#ff7b72",
  str: "#a5d6ff",
  fn: "#d2a8ff",
  com: "#8b949e",
  num: "#79c0ff",
  tag: "#7ee787",
  red: "#ff5c7a",
};

const FILES: {
  name: string;
  lines: Tok[][];
  run: string;
  out: string[];
}[] = [
  {
    name: "train.py",
    lines: [
      [["# uGSOT · AI & ML lab", C.com]],
      [
        ["from ", C.kw],
        ["sklearn.model_selection "],
        ["import ", C.kw],
        ["train_test_split"],
      ],
      [["from ", C.kw], ["model "], ["import ", C.kw], ["StudentNet"]],
      [],
      [
        ["data "],
        ["= ", C.kw],
        ["load_dataset", C.fn],
        ["("],
        ['"campus-energy.csv"', C.str],
        [")"],
      ],
      [
        ["X_train, X_test, y_train, y_test "],
        ["= ", C.kw],
        ["train_test_split", C.fn],
        ["("],
      ],
      [["    data.X, data.y, test_size"], ["=", C.kw], ["0.2", C.num], [")"]],
      [],
      [
        ["model "],
        ["= ", C.kw],
        ["StudentNet", C.fn],
        ["(layers"],
        ["=", C.kw],
        ["["],
        ["128", C.num],
        [", "],
        ["64", C.num],
        [", "],
        ["1", C.num],
        ["])"],
      ],
      [
        ["model."],
        ["fit", C.fn],
        ["(X_train, y_train, epochs"],
        ["=", C.kw],
        ["5", C.num],
        [")"],
      ],
      [],
      [
        ["print", C.fn],
        ["("],
        ['f"accuracy: {model.score(X_test, y_test):.2%}"', C.str],
        [")"],
      ],
    ],
    run: "python train.py",
    out: [
      "Epoch 1/5  ━━━━━━━━━━  loss 0.412",
      "Epoch 3/5  ━━━━━━━━━━  loss 0.168",
      "Epoch 5/5  ━━━━━━━━━━  loss 0.071",
      "accuracy: 94.80%",
    ],
  },
  {
    name: "Dashboard.tsx",
    lines: [
      [
        ["import ", C.kw],
        ["{ useEffect, useState } "],
        ["from ", C.kw],
        ['"react"', C.str],
      ],
      [],
      [["export default function ", C.kw], ["Dashboard", C.fn], ["() {"]],
      [
        ["  const ", C.kw],
        ["[projects, setProjects] "],
        ["= ", C.kw],
        ["useState", C.fn],
        ["([]);"],
      ],
      [["  useEffect", C.fn], ["(() "], ["=> ", C.kw], ["{"]],
      [
        ["    fetch", C.fn],
        ["("],
        ['"/api/projects"', C.str],
        [")."],
        ["then", C.fn],
        ["((r) "],
        ["=> ", C.kw],
        ["r."],
        ["json", C.fn],
        ["())."],
        ["then", C.fn],
        ["(setProjects);"],
      ],
      [["  }, []);"]],
      [["  return ", C.kw], ["("]],
      [
        ["    <", C.com],
        ["Grid", C.tag],
        [">", C.com],
      ],
      [
        ["      {projects."],
        ["map", C.fn],
        ["((p) "],
        ["=> ", C.kw],
        ["<", C.com],
        ["ProjectCard", C.tag],
        [" key", C.num],
        ["={p.id} {...p} />"],
      ],
      [
        ["    </", C.com],
        ["Grid", C.tag],
        [">", C.com],
      ],
      [["  );"]],
      [["}"]],
    ],
    run: "npm run dev",
    out: [
      "▲ Next.js ready on http://localhost:3000",
      "✓ compiled in 412ms",
      "✓ 24 projects loaded",
    ],
  },
];

const lineLen = (l: Tok[]) => l.reduce((n, [t]) => n + t.length, 0);

/** a line of code cut to its first `n` characters */
function CodeLine({ line, n }: { line: Tok[]; n: number }) {
  const starts = line.map((_, i) =>
    line.slice(0, i).reduce((sum, [t]) => sum + t.length, 0),
  );
  return (
    <>
      {line.map(([t, c], i) =>
        starts[i] < n ? (
          <span key={i} style={c ? { color: c } : undefined}>
            {t.slice(0, n - starts[i])}
          </span>
        ) : null,
      )}
    </>
  );
}

/**
 * The display: a dark code editor (window bar, file tabs, a file tree, the
 * editor with line numbers, a terminal). The current file types itself out;
 * then its command runs and the terminal prints line by line; after a pause
 * the next file opens. It only runs while `live`.
 */
function CodeScreen({ live }: { live: boolean }) {
  const [file, setFile] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const f = FILES[file];
  const total = f.lines.reduce((n, l) => n + lineLen(l) + 1, 0);

  useEffect(() => {
    if (!live) return;
    // reduced motion: each step lands at once instead of typing out
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let t: number;
    if (typed < total)
      t = window.setTimeout(
        () => setTyped((n) => Math.min(total, reduced ? total : n + 3)),
        reduced ? 0 : 26,
      );
    else if (shown <= f.out.length)
      t = window.setTimeout(
        () => setShown((n) => (reduced ? f.out.length + 1 : n + 1)),
        reduced ? 0 : shown === 0 ? 500 : 650,
      );
    else
      t = window.setTimeout(() => {
        setFile((i) => (i + 1) % FILES.length);
        setTyped(0);
        setShown(0);
      }, 2600);
    return () => window.clearTimeout(t);
  }, [live, typed, shown, total, f.out.length]);

  // which line the caret is on, and how much of each line is out
  let budget = typed;
  const visible = f.lines.map((l) => {
    const n = Math.max(0, Math.min(lineLen(l), budget));
    budget -= lineLen(l) + 1;
    return n;
  });
  const caretLine = Math.min(
    f.lines.length - 1,
    visible.findIndex(
      (n, i) => n < lineLen(f.lines[i]) || i === f.lines.length - 1,
    ),
  );

  return (
    <div
      className="flex size-full flex-col bg-[#0d1117] font-mono text-[#e6edf3]"
      style={{ width: SCREEN.w, height: SCREEN.h }}
    >
      {/* window bar and tabs */}
      <div className="flex h-[64px] items-end gap-3 border-b border-white/10 bg-[#010409] px-6">
        <div className="mb-[22px] mr-4 flex gap-2.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="size-[16px] rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
        {FILES.map((x, i) => (
          <span
            key={x.name}
            className={`rounded-t-[8px] px-6 py-3 text-[22px] ${
              i === file ? "bg-[#0d1117] text-white" : "text-white/45"
            }`}
          >
            {x.name}
          </span>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* file tree */}
        <div className="w-[300px] shrink-0 border-r border-white/10 bg-[#010409] px-6 py-6 text-[20px] leading-[2] text-white/55">
          <p className="text-[17px] font-semibold uppercase tracking-[0.12em] text-white/35">
            uGSOT-projects
          </p>
          {[
            "data/",
            "model/",
            "train.py",
            "app/",
            "Dashboard.tsx",
            "README.md",
          ].map((n) => (
            <p
              key={n}
              className={`truncate ${n.endsWith("/") ? "" : "pl-6"} ${n === f.name ? "text-white" : ""}`}
            >
              {n}
            </p>
          ))}
        </div>

        {/* editor and terminal */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-hidden px-6 py-6 text-[24px] leading-[1.75]">
            {f.lines.map((l, i) => (
              <div key={i} className="flex whitespace-pre">
                <span className="w-[56px] shrink-0 select-none text-right text-white/25">
                  {i + 1}
                </span>
                <span className="pl-7">
                  <CodeLine line={l} n={visible[i]} />
                  {i === caretLine && typed < total && (
                    <span className="ml-[1px] inline-block h-[30px] w-[3px] translate-y-[5px] animate-pulse bg-[#ff5c7a]" />
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="h-[250px] shrink-0 border-t border-white/10 bg-[#010409] px-7 py-5 text-[21px] leading-[1.7]">
            <p className="text-[16px] font-semibold uppercase tracking-[0.12em] text-white/35">
              Terminal
            </p>
            {shown > 0 && (
              <p className="mt-1">
                <span className="text-[#7ee787]">➜</span>{" "}
                <span className="text-[#79c0ff]">~/uGSOT-projects</span> {f.run}
              </p>
            )}
            {f.out.slice(0, Math.max(0, shown - 1)).map((o, i, arr) => (
              <p
                key={o}
                className={
                  i === f.out.length - 1 && i === arr.length - 1
                    ? "text-[#7ee787]"
                    : "text-white/70"
                }
              >
                {o}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ the laptop */

function Laptop({ live }: { live: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState<string>();

  // warp the editor onto the display whenever the laptop changes size
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const sx = el.clientWidth / PHOTO.w;
      const sy = el.clientHeight / PHOTO.h;
      setMatrix(
        quadMatrix(
          SCREEN.w,
          SCREEN.h,
          DISPLAY.map(([x, y]) => [x * sx, y * sy]),
        ),
      );
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="relative mx-auto aspect-[1536/864] [--iw:min(1240px,100%,calc((100svh-200px)*1.778))]"
      style={{
        width: "var(--iw)",
        // the render's black surround melts into the section's black
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 6%, #000 86%, transparent 100%), linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {/* the display: the live editor, warped onto the screen's corners,
          behind the laptop with its screen cut out */}
      <div
        aria-hidden
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: SCREEN.w,
          height: SCREEN.h,
          transform: matrix,
          visibility: matrix ? "visible" : "hidden",
        }}
      >
        <CodeScreen live={live} />
        {/* asleep until the laptop has risen into place */}
        <span data-screen-off className="absolute inset-0 bg-black" />
        {/* a faint sheen across the glass */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_40%)]" />
      </div>
      <Image
        src="/images/toolkit/macbook-open.webp"
        alt="Student MacBook Pro, open, with code running on its screen"
        fill
        sizes="(min-width: 1024px) 1240px, 100vw"
        className="object-fill"
      />
    </div>
  );
}

const LIGHT = {
  "--tk-bg": "#ffffff",
  "--heading-fg": "#0b0d12",
  "--heading-muted": "#3d4452",
};
const DARK = {
  "--tk-bg": "#000000",
  "--heading-fg": "#ffffff",
  "--heading-muted": "rgba(255,255,255,0.68)",
};

export function Toolkit() {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  // white -> black in one timed fade as the section comes into view, and back
  // on the way out (early, so the laptop's black surround never shows on white)
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let dark: boolean | null = null;
    const check = () => {
      const r = section.getBoundingClientRect();
      const h = window.innerHeight;
      const next = r.top < h * 0.75 && r.bottom > h * 0.25;
      setLive(r.top < h && r.bottom > 0);
      if (next === dark) return;
      dark = next;
      gsap.to(section, {
        ...(next ? DARK : LIGHT),
        duration: reduced ? 0 : 0.6,
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

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      const build = (scrollTrigger: ScrollTrigger.Vars) =>
        gsap
          .timeline({ scrollTrigger })
          .fromTo(
            q("[data-laptop]"),
            { yPercent: 18, scale: 0.86, autoAlpha: 0.2 },
            {
              yPercent: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            0,
          )
          .fromTo(
            q("[data-glow]"),
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            0.3,
          )
          .fromTo(
            q("[data-screen-off]"),
            { opacity: 1 },
            { opacity: 0, duration: 0.2, ease: "power1.in" },
            0.3,
          )
          // hold, awake, for the rest of the track
          .to({}, { duration: 0.5 });
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          build({
            trigger: q("[data-track]")[0],
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          });
        },
      );
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          build({
            trigger: q("[data-laptop]")[0],
            start: "top 95%",
            end: "center 45%",
            scrub: 0.8,
          });
        },
      );
      // reduced motion: shown awake
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-screen-off]"), { opacity: 0 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="toolkit"
      className="relative bg-[var(--tk-bg)]"
      style={LIGHT as React.CSSProperties}
    >
      {/* lg+: a tall track; the screen inside holds while the laptop rises */}
      <div data-track className="relative lg:h-[220vh]">
        <div className="relative overflow-hidden py-20 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 lg:pt-16">
          <div className="container-page relative">
            <SectionHeading
              title="Your Innovation"
              accent="Toolkit, Included"
              intro="High-performance Apple MacBook provided to every student for academic use for coding, creating, collaborating, and bringing ideas to life anytime, anywhere."
            />

            <div className="relative mt-8 lg:mt-4">
              {/* a soft light pooling under the laptop once it is awake */}
              <span
                data-glow
                aria-hidden
                className="pointer-events-none absolute bottom-[4%] left-1/2 h-[30%] w-[70%] -translate-x-1/2 rounded-full bg-[#5b6b8a]/25 blur-[90px]"
              />
              <div data-laptop className="relative">
                <Laptop live={live} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
