"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll reveal shared by every section, in the hero's language: elements
 * rise 32px and fade in with expo.out as they enter the viewport.
 *
 * Children marked `data-reveal-item` animate one after another (stagger);
 * with none marked, the wrapper itself animates. Plays once. Nothing is hidden
 * by CSS: the start state is applied on mount, so without JS (or under reduced
 * motion) the content simply shows.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  stagger = 0.08,
  y = 32,
  start = "top 85%",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = el.querySelectorAll("[data-reveal-item]");
        const targets = items.length ? items : el;
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger,
            scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
