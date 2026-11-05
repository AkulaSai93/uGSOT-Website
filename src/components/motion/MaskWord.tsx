import type { ReactNode } from "react";

/**
 * One headline word inside an overflow mask, so it can rise into view.
 * The mask is padded on every side (and pulled back with matching negative
 * margins, so layout is unchanged) because glyphs that overhang their advance
 * box (italic and display letters, descenders) would otherwise be clipped.
 *
 * It clips with clip-path rather than overflow: an inline-block with overflow
 * hidden takes its bottom edge as its baseline, so words in the two heading
 * fonts (Plus Jakarta Sans, Bricolage Grotesque — different descenders) sat
 * on different lines. Clipped this way each word keeps its own text baseline
 * and the whole heading sits on one.
 *
 * `attr` names the data attribute the animation targets: the hero uses
 * data-reveal="word" (hidden before first paint), section headings use
 * data-heading-word (animated on scroll).
 */
export function MaskWord({
  children,
  className = "",
  attr = "heading",
}: {
  children: ReactNode;
  className?: string;
  attr?: "hero" | "heading";
}) {
  const data = attr === "hero" ? { "data-reveal": "word" } : { "data-heading-word": "" };
  return (
    <span className="-mx-[0.15em] -mb-[0.12em] -mt-[0.06em] inline-block px-[0.15em] pb-[0.12em] pt-[0.06em] align-baseline [clip-path:inset(0)]">
      <span {...data} className={`inline-block ${className}`}>
        {children}
      </span>
    </span>
  );
}
