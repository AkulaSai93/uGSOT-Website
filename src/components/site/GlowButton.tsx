import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Primary CTA with a rotating border glow.
 *
 * Structure mirrors the upGrad Framer hero: an oversized
 * `conic-gradient(transparent 200deg, <streak>)` spins behind the button, and
 * the solid fill sits inset on top of it, so only a sweeping sliver of light
 * shows around the edge. The spinner is a square wider than the button's
 * diagonal, so it covers every edge at any angle. The glow holds still under
 * prefers-reduced-motion.
 *
 * `streak` is the colour of the sweeping sliver: white for dark backdrops,
 * ink for light ones (a white sliver vanishes against a light page).
 * `size="sm"` is the compact variant used in the nav.
 */
export function GlowButton({
  href,
  children,
  className = "",
  streak = "#fff",
  size = "md",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  streak?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex overflow-hidden rounded-[6px] p-[1.5px] ${className}`}
    >
      <span
        aria-hidden
        style={{ backgroundImage: `conic-gradient(transparent 200deg, ${streak})` }}
        className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
      />
      <span
        className={`relative z-[2] inline-flex items-center gap-2 whitespace-nowrap rounded-[5px] bg-accent font-semibold ${
          size === "sm" ? "px-4 py-2.5 text-[13.5px]" : "px-6 py-3.5 text-[15px]"
        } text-white transition-colors group-hover:bg-accent-hover`}
      >
        {children}
      </span>
    </Link>
  );
}
