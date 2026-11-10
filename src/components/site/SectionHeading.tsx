"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MaskWord } from "@/components/motion/MaskWord";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Display size per heading: "lg" for open sections, "md" where a pinned
 *  stage leaves less vertical room. A page can set --section-heading-size to
 *  size every "lg" heading on it alike (the campus pages do). */
const SIZE = {
  lg: "text-[length:var(--section-heading-size,clamp(1.75rem,3vw,2.5rem))]",
  md: "text-[clamp(1.5rem,2.6vw,2.25rem)]",
} as const;

/**
 * Section heading in the hero's type system, used by every section:
 *
 *   h2       Plus Jakarta Sans bold, tight tracking; the `accent` phrase is
 *            Bricolage Grotesque in brand red (the hero's "Science")
 *   intro    body copy under it
 *
 * Colours read --heading-fg / --heading-muted when a section sets them (e.g.
 * Pathways fading to black), falling back to the site ink and body colours.
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
  breakBeforeAccent = false,
  phoneBreakBefore,
  titleClassName = "",
  accentClassName = "text-accent",
  align = "center",
  size = "lg",
  className = "",
}: {
  id?: string;
  title: string;
  accent?: string;
  after?: string;
  intro?: ReactNode;
  /** start the accent phrase on its own line */
  breakBeforeAccent?: boolean;
  /** below lg, break the line before this word of the title instead (and
   *  keep the accent on the same line as the title's tail) */
  phoneBreakBefore?: string;
  /** extra classes for the h2, e.g. a phone font size that fits its lines */
  titleClassName?: string;
  /** the accent phrase's colour, for headings on a red ground */
  accentClassName?: string;
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
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
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

  // each word in its own mask, with real spaces between them, so the heading
  // reads, selects and copies as one line of text
  const words = (text: string | undefined, accentWord: boolean) =>
    (text ?? "")
      .split(" ")
      .filter(Boolean)
      .flatMap((w, i) => [
        i > 0 ? " " : null,
        !accentWord && w === phoneBreakBefore ? (
          <br key={`br-${i}`} className="lg:hidden" />
        ) : null,
        <MaskWord
          key={`${w}-${i}`}
          className={
            accentWord
              ? `font-[family-name:var(--font-bricolage)] font-semibold tracking-[-0.01em] ${accentClassName}`
              : ""
          }
        >
          {w}
        </MaskWord>,
      ]);

  const centred = align === "center";

  return (
    <header
      ref={ref}
      className={`${centred ? "mx-auto text-center" : ""} max-w-[980px] ${className}`}
    >
      <h2
        id={id}
        className={`font-display font-bold leading-[1.15] tracking-[-0.03em] text-[color:var(--heading-fg,var(--ink))] ${SIZE[size]} ${titleClassName}`}
      >
        {words(title, false)}
        {accent &&
          (breakBeforeAccent ? (
            phoneBreakBefore ? (
              <>
                {" "}
                <br className="max-lg:hidden" />
              </>
            ) : (
              <br />
            )
          ) : (
            " "
          ))}
        {words(accent, true)}
        {after && " "}
        {words(after, false)}
      </h2>
      {intro && (
        <p
          data-heading-fade
          className={`mt-4 text-balance text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.6] text-[color:var(--heading-muted,var(--ink-body))] ${
            centred ? "mx-auto max-w-[640px]" : "max-w-[560px]"
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
