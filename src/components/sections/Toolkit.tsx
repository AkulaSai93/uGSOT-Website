"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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
 * Laptop after the MacBook mockup on mastersunion.org: a photoreal MacBook Pro
 * seen straight on at eye level, its screen on (Figma AI; space black, a code
 * editor over a graphite and blue-violet wallpaper, no maker's logo), on black as
 * on apple.com's MacBook Pro pages; the section is dark to match (the nav turns
 * dark over it). Like One Degree, Three Pathways, the section fades from white
 * to black as it reaches the middle of the screen (a timed GSAP fade of its
 * --tk-* colour tokens) and back to white on the way out.
 *
 * At eye level a shut laptop is only its thin base, so the photograph can open
 * truthfully: it is cut into the lid (rim, bezel and screen — mac-lid-v3.png,
 * its display replaced with a second Figma AI screen) and the base slab
 * (mac-slab-a.png), both with what lay around them made transparent so the
 * laptop sits on the white too. As you scroll the photographed lid rises on its hinge from
 * edge-on to upright and the screen comes on.
 *
 * Motion (GSAP, scrubbed by the scroll): on desktop the section holds the
 * screen while you scroll through it. Below lg there is no hold: the laptop
 * opens as it scrolls up to the middle of the screen.
 */
/** in the photograph (1536x864): lid x 314-1222, y 92-696 (the hinge); the
 *  base slab y 692-732 */
const PHOTO = { w: 1536, h: 864 };
const LID = { x: 314, y: 92, w: 908, h: 604 };
const BASE = { y: 692, h: 40 };
/** folded: the lid edge-on, lying back on the base */
const LID_CLOSED = -89;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Laptop() {
  return (
    <div
      className="relative mx-auto aspect-[1536/864] [--iw:min(1240px,100vw,calc((100svh-220px)*1.778))]"
      style={{
        width: "var(--iw)",
        perspective: "calc(var(--iw) * 4)",
        perspectiveOrigin: `50% ${pct(LID.y + LID.h, PHOTO.h)}`,
      }}
    >
      {/* the base slab */}
      <div
        className="absolute inset-x-0"
        style={{ top: pct(BASE.y, PHOTO.h), height: pct(BASE.h, PHOTO.h) }}
      >
        <Image
          src="/images/toolkit/mac-slab-a.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 1240px, 100vw"
          className="object-fill"
        />
      </div>
      {/* the lid, hinged on its bottom edge */}
      <div
        data-lid
        className="absolute origin-bottom"
        style={{
          left: pct(LID.x, PHOTO.w),
          top: pct(LID.y, PHOTO.h),
          width: pct(LID.w, PHOTO.w),
          height: pct(LID.h, PHOTO.h),
        }}
      >
        <Image
          src="/images/toolkit/mac-lid-v3.png"
          alt="Student MacBook Pro open, showing a code editor"
          fill
          sizes="(min-width: 1024px) 740px, 60vw"
          className="object-fill"
        />
        {/* the display, dark until the lid is nearly up */}
        <span
          data-screen-off
          aria-hidden
          className="absolute inset-[2.2%_1.9%_7%] bg-black"
        />
      </div>
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

  // white -> black in one timed fade while the section holds the middle of the
  // screen, and back on the way out — the same rule as Pathways, Leaders and
  // the nav
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

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({ scrollTrigger });
        tl.fromTo(
          q("[data-lid]"),
          { rotationX: LID_CLOSED },
          { rotationX: 0, duration: 0.75, ease: "power2.inOut" },
          0,
        )
          // folded flat, the lid would show only as thin stretched edge lines
          // past the base, so it stays hidden until it starts to lift
          .fromTo(
            q("[data-lid]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12, ease: "power1.in" },
            0.04,
          )
          .fromTo(
            q("[data-screen-off]"),
            { opacity: 1 },
            { opacity: 0, duration: 0.3, ease: "power1.in" },
            0.6,
          );
        return tl;
      };
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
            start: "top 90%",
            end: "center 40%",
            scrub: 0.8,
          });
        },
      );
      // reduced motion: shown open
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
      {/* lg+: a tall track; the screen inside holds while the lid opens */}
      <div data-track className="relative lg:h-[260vh]">
        <div className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pt-16">
          <div className="container-page relative">
            <SectionHeading
              title="Your Innovation"
              accent="Toolkit, Included"
              intro="High-performance Apple MacBook provided to every student for academic use for coding, creating, collaborating, and bringing ideas to life anytime, anywhere."
            />

            <div data-laptop className="mt-6 lg:mt-2">
              <Laptop />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
