"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A stat like "10 M+" or "3000+": the leading number counts up from zero when
 * it scrolls into view; the rest ("M+", "+", "L+") follows as a plain suffix.
 * Server-rendered with the final value, so the real figure is always there.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const num = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([\d.]+)\s*(.*)$/);
  const target = match ? Number(match[1]) : NaN;
  const suffix = match ? match[2] : "";
  const gap = /\s/.test(value) ? " " : "";

  useGSAP(() => {
    const el = num.current;
    if (!el || Number.isNaN(target)) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { n: 0 };
      gsap.to(state, {
        n: target,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        onStart: () => {
          el.textContent = "0";
        },
        onUpdate: () => {
          el.textContent = String(Math.round(state.n));
        },
      });
    });
    return () => mm.revert();
  });

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      <span ref={num} className="tabular-nums">
        {match[1]}
      </span>
      {gap}
      {suffix}
    </span>
  );
}
