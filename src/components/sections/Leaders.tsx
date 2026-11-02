"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Built by Leaders Who've Shaped Education and Technology"
 *
 * Copy is sot.upgrad.com's, verbatim: heading, quote, the line under it, and
 * each leader's name, role and bio.
 *
 * Layout after a "FOUNDERS" reference the client supplied. Like Pathways,
 * the section fades from white to black as it reaches the middle of the
 * screen (timed GSAP fade of its --ld-* colour tokens) and back on the way
 * out; the nav goes dark with it. Then: a dark section
 * with one enormous word running edge to edge, a single group photo, the
 * title set beside it overlapping the photo's edge (a hand-drawn ring around
 * "Leaders", the rest of the heading in red beneath), and the leaders below
 * as three quiet text columns split by hairlines — index, name, role in red,
 * bio.
 *
 * Motion (GSAP): the big word drifts sideways as the section scrolls past
 * (scrubbed); the photo opens upward with a clip reveal; the ring draws
 * itself round "Leaders"; the columns rise in one after another.
 *
 * PHOTO IS A PLACEHOLDER: public/images/leaders/group-placeholder.jpg was
 * generated with Figma AI — three backlit figures, faces deliberately not
 * visible, so it can't be mistaken for the named leaders. Replace it with the
 * real group photo (3:2 works best) when it arrives.
 */
const LEADERS = [
  {
    name: "Ronnie Screwvala",
    role: "Visionary entrepreneur · Co-founder, upGrad",
    bio: "Built transformative enterprises and driven innovation in education and media",
  },
  {
    name: "Vishwa Mohan",
    role: "CEO, upGrad School of Technology",
    bio: "India's Top 40 CIOs (2023). Ex- CIO PhysicsWallah, Linkedin, Amazon, PayPal, Walmart, and Oracle",
  },
  {
    name: "Mehul Khandhedia",
    role: "CRO, upGrad School of Technology",
    bio: "Ex-Professor: Mumbai University, ex-Coursera, and PhysicsWallah. Curated 35,000+ career enablements",
  },
] as const;

const LIGHT = {
  "--ld-bg": "#ffffff",
  "--ld-fg": "#0b0d12",
  "--ld-word": "rgba(11,13,18,0.9)",
  "--ld-muted": "#3d4452",
  "--ld-soft": "rgba(61,68,82,0.8)",
  "--ld-ring": "rgba(11,13,18,0.6)",
  "--ld-line": "rgba(11,13,18,0.12)",
};
const DARK = {
  "--ld-bg": "#0b0b0c",
  "--ld-fg": "#ffffff",
  "--ld-word": "rgba(255,255,255,0.85)",
  "--ld-muted": "rgba(255,255,255,0.72)",
  "--ld-soft": "rgba(255,255,255,0.55)",
  "--ld-ring": "rgba(255,255,255,0.55)",
  "--ld-line": "rgba(255,255,255,0.14)",
};

export function Leaders() {
  const root = useRef<HTMLElement>(null);

  // white -> black in one timed fade while the section holds the middle of the
  // screen, and back on the way out — the same rule as Pathways and the nav
  useEffect(() => {
    const section = root.current;
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

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the big word drifts left as the section passes
        gsap.fromTo(
          q("[data-bigword]"),
          { xPercent: 3 },
          {
            xPercent: -3,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: q("[data-photo]")[0], start: "top 80%", toggleActions: "play none none none" },
        });
        tl.fromTo(
          q("[data-photo]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 },
        )
          .fromTo(q("[data-photo-img]"), { scale: 1.15 }, { scale: 1, duration: 1.8 }, 0)
          .fromTo(
            q("[data-title-line]"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1, stagger: 0.08 },
            0.35,
          )
          .fromTo(
            q("[data-ring]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            0.8,
          )
          .fromTo(q("[data-quote]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.9);

        gsap.fromTo(
          q("[data-col]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: q("[data-cols]")[0], start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="leaders"
      aria-labelledby="leaders-heading"
      className="overflow-hidden bg-[var(--ld-bg)] py-20 text-[color:var(--ld-fg)] lg:py-28"
      style={LIGHT as React.CSSProperties}
    >
      {/* one enormous word, wider than the screen so it runs off both edges */}
      <div aria-hidden className="flex justify-center">
        {/* flex centring lets the word overflow both edges evenly */}
        <span
          data-bigword
          className="block shrink-0 select-none whitespace-nowrap font-display text-[24vw] font-normal uppercase leading-[0.8] tracking-[-0.02em] text-[color:var(--ld-word)]"
        >
          Leaders
        </span>
      </div>

      <div className="container-page mt-12 lg:mt-16">
        {/* photo + title beside it, overlapping the photo's right edge */}
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
          <div data-photo className="relative aspect-[3/2] overflow-hidden rounded-[6px] bg-[#1b1b1e]">
            <div data-photo-img className="absolute inset-0">
              <Image
                src="/images/leaders/group-placeholder.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative z-10 lg:-ml-[22%]">
            <h2
              id="leaders-heading"
              className="font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
            >
              {/* the rise-in mask is padded (and pulled back) so it never
                  crops the ring that sits above and below the word */}
              <span className="-my-[0.35em] block overflow-hidden py-[0.35em]">
                <span data-title-line className="block">
                  Built by{" "}
                  <span className="relative ml-[0.22em] inline-block">
                    Leaders
                    {/* one continuous oval round the word, drawn in on scroll;
                        the extra left margin keeps it clear of "by" */}
                    <svg
                      aria-hidden
                      viewBox="0 0 200 80"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -left-[9%] -top-[16%] h-[136%] w-[118%] overflow-visible"
                    >
                      <path
                        data-ring
                        pathLength={1}
                        transform="rotate(-3 100 40)"
                        d="M 3 40 A 97 37 0 1 1 197 40 A 97 37 0 1 1 3 40 Z"
                        fill="none"
                        stroke="var(--ld-ring)"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeDasharray="1"
                      />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="mt-4 block overflow-hidden pb-[0.08em]">
                <span
                  data-title-line
                  className="block text-[clamp(1rem,1.4vw,1.25rem)] font-medium tracking-[-0.005em] text-accent"
                >
                  Who&rsquo;ve Shaped Education and Technology
                </span>
              </span>
            </h2>

            {/* each line kept to a single line on desktop, easing down in size on
                narrower screens so it always fits */}
            <div data-quote className="mt-7">
              <p className="text-[15px] font-medium leading-relaxed text-[color:var(--ld-fg)] lg:whitespace-nowrap lg:text-[clamp(13px,1.1vw,15px)]">
                <span className="text-accent">&ldquo;</span>Education is not about what you study,
                it&rsquo;s about who you become<span className="text-accent">&rdquo;</span>
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--ld-soft)] lg:whitespace-nowrap lg:text-[clamp(11.5px,0.98vw,13.5px)]">
                Together, they&rsquo;re inspiring a generation to dream fearlessly and achieve beyond
                limits.
              </p>
            </div>
          </div>
        </div>

        {/* leaders as three quiet text columns, split by hairlines */}
        <div
          data-cols
          className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0 lg:mt-24"
        >
          {LEADERS.map((l, i) => (
            <article
              key={l.name}
              data-col
              className="border-t border-[color:var(--ld-line)] pt-6 md:border-l md:border-t-0 md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-10"
            >
              <span className="font-mono text-[12px] text-[color:var(--ld-soft)]">0{i + 1}</span>
              <h3 className="mt-4 font-display text-[clamp(1.375rem,1.9vw,1.625rem)] font-semibold leading-tight tracking-[-0.02em]">
                {l.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-accent">{l.role}</p>
              <p className="mt-4 max-w-[360px] text-[14.5px] leading-relaxed text-[color:var(--ld-muted)]">
                {l.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
