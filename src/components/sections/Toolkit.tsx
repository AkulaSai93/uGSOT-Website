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
 * made from our own pieces: a Figma AI render of a midnight MacBook Air — the
 * model students are given — seen from above the keyboard (camera notch,
 * Touch ID, no speaker grilles beside the keys), lid tilted back (AI-upscaled
 * to 3072px; no logo). Its black surround is cut away, so it sits on the
 * section's white or black alike (macbook-air-cut.webp, made from
 * macbook-air-open-hd.webp); the screen is a hole too, and behind it sits
 * the wallpaper (wallpaper-supplied-hd.jpg), warped onto
 * the display's exact four corners with a CSS matrix3d, so it reads as the
 * laptop's screen.
 *
 * RIGHTS TO CLEAR: wallpaper-supplied-hd.jpg is the image the client supplied —
 * Apple's own MacBook Air wallpaper, which is Apple's copyrighted artwork.
 * Confirm upGrad may use it (e.g. through Apple's partner marketing
 * resources) before launch, or swap in an original. The supplied copy was
 * 554x554; this one is AI-upscaled from it to 2216x2216.
 *
 * The section turns black as it comes into view (a timed GSAP fade of its
 * --tk-* colour tokens, as on Pathways and Leaders) and back to white on the
 * way out; the nav turns dark over it.
 *
 * Layout from the client's Figma frame (node 99:10688, after apple.com's
 * MacBook Pro hero): black; the heading 56px from the top; the MacBook
 * centred below it, its lid about 63% of the page wide, cut by the section's
 * foot just below the function row. (The frame carries Apple's own photograph;
 * our MacBook Air render stands in for it.)
 *
 * Motion (GSAP, scrubbed by the scroll): the MacBook rises into place as it
 * comes up the screen and its display wakes.
 */

/** corners measured on the 1536x864 render (the file is the same picture at
 *  2x); the display's corners in it (top-left, top-right,
 *  bottom-right, bottom-left), let out a few pixels so the code runs under
 *  the bezel */
const PHOTO = { w: 1536, h: 864 };
const DISPLAY: [number, number][] = [
  [99, 99],
  [1437, 99],
  [1314, 613],
  [221, 614],
];

/** the screen's own size before it is warped onto the display */
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

/* ------------------------------------------------------------ the laptop */

function Laptop() {
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
    <div ref={box} className="relative aspect-[1536/864] w-full">
      {/* the display: the wallpaper, warped onto the screen's corners,
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
        <Image
          src="/images/toolkit/wallpaper-supplied-hd.jpg"
          quality={90}
          alt=""
          fill
          // the box is 1600px wide before it is warped onto the screen
          sizes="1600px"
          className="object-cover"
        />
        {/* asleep until the laptop has risen into place */}
        <span data-screen-off className="absolute inset-0 bg-black" />
        {/* a faint sheen across the glass */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_40%)]" />
      </div>
      <Image
        src="/images/toolkit/macbook-air-cut.webp"
        quality={90}
        alt="Student MacBook Air, open"
        fill
        sizes="(min-width: 1024px) 1100px, 104vw"
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
            { yPercent: 14, scale: 0.92, autoAlpha: 0.2 },
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
          );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        build({
          trigger: q("[data-laptop]")[0],
          start: "top 95%",
          end: "top 35%",
          scrub: 0.8,
        });
      });
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
      className="relative overflow-hidden bg-[var(--tk-bg)]"
      style={LIGHT as React.CSSProperties}
    >
      <div className="container-page relative pt-14">
        <SectionHeading
          title="Your Innovation"
          accent="Toolkit, Included"
          intro="High-performance Apple MacBook provided to every student for academic use for coding, creating, collaborating, and bringing ideas to life anytime, anywhere."
        />
      </div>

      {/* the MacBook, centred under the heading and cut by the section's foot
          just below the function row (the render's lower part is clipped) */}
      <div className="relative mt-[clamp(24px,3.6vw,54px)] overflow-hidden">
        {/* a soft light pooling under the laptop once it is awake */}
        <span
          data-glow
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[45%] w-[60%] -translate-x-1/2 rounded-full bg-[#5b6b8a]/25 blur-[90px]"
        />
        <div
          data-laptop
          className="relative -ml-[2vw] aspect-[1536/770] w-[104vw] overflow-hidden md:mx-auto md:w-[min(1096px,84vw)] lg:w-[min(1096px,72vw)]"
        >
          <Laptop />
        </div>
      </div>
    </section>
  );
}
