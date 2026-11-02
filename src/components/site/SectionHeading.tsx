"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MaskWord } from "@/components/motion/MaskWord";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Display size per heading: "lg" for open sections, "md" where a pinned
 *  stage leaves less vertical room. */
const SIZE = {
  lg: "text-[clamp(1.75rem,3vw,2.5rem)]",
  md: "text-[clamp(1.5rem,2.6vw,2.25rem)]",
} as const;

/**
 * Section heading in the hero's type system, used by every section:
 *
 *   h2       Plus Jakarta Sans bold, tight tracking; the `accent` phrase is
 *            Bricolage Grotesque in brand red (the hero's "Science")
 *   intro    body copy under it
 *
 * Every word sits in its own mask and rises into view, staggered, when the
 * heading scrolls in; the intro fades up after it. The real text is
 * always in the DOM, so nothing depends on the animation running.
 */
export function SectionHeading({
  id,
  title,
  accent,
  after,
  intro,
  align = "center",
  size = "lg",
  className = "",
}: {
  id?: string;
  title: string;
  accent?: string;
  after?: string;
  intro?: ReactNode;
  align?: "center" | "left";
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(ref);
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
        tl.fromTo(
          q("[data-heading-word]"),
          { yPercent: 110, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.05 },
        ).fromTo(
          q("[data-heading-fade]"),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 },
          0.15,
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const words = (text: string | undefined, accentWord: boolean) =>
    (text ?? "")
      .split(" ")
      .filter(Boolean)
      .map((w, i) => (
        <MaskWord
          key={`${w}-${i}`}
          className={
            accentWord
              ? "font-[family-name:var(--font-bricolage)] font-semibold tracking-[-0.01em] text-accent"
              : ""
          }
        >
          {w}
        </MaskWord>
      ));

  const centred = align === "center";

  return (
    <header
      ref={ref}
      className={`${centred ? "mx-auto text-center" : ""} max-w-[980px] ${className}`}
    >
      <h2
        id={id}
        className={`font-display font-bold leading-[1.15] tracking-[-0.03em] text-ink ${SIZE[size]}`}
      >
        <span className="sr-only">
          {[title, accent, after].filter(Boolean).join(" ")}
        </span>
        <span aria-hidden className={`flex flex-wrap gap-x-[0.24em] ${centred ? "justify-center" : ""}`}>
          {words(title, false)}
          {words(accent, true)}
          {words(after, false)}
        </span>
      </h2>
      {intro && (
        <p
          data-heading-fade
          className={`mt-4 text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.6] text-body ${
            centred ? "mx-auto max-w-[640px]" : "max-w-[560px]"
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
