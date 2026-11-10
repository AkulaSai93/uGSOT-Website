"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Download } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";
import { CompanyLogos } from "@/components/site/CompanyLogos";
import type { Campus } from "./campuses";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The campus page's hero, after Scaler's programme pages
 * (scaler.com/school-of-technology/ai-b): the university's own campus film
 * fills the first screen, the copy in white over its darkened foot, and a
 * panel at the side. Type, colour and corners are the home page's.
 *
 * Layout: the film full-bleed (its still shows until it starts), darkened from
 * the foot and the left. On it, bottom left: the programme as a
 * two-line headline (its middle in the red accent), one line of who and where
 * and the tracks, the two CTAs and the approvals as one quiet line; bottom
 * right, the home page's "Built by people who've worked at" logos, where
 * Scaler shows its "Designed & Delivered by" ones. Then the facts (duration,
 * campus, eligibility, age) on a white strip overlapping the film's
 * foot, as Scaler's highlight cards do. Below lg it stacks and centres.
 *
 * Motion (GSAP): the film settles from a slight zoom as the copy fades up line
 * by line; the logos and the facts rise last. As the page scrolls away the film drifts slower than the page.
 * Reduced motion: shown as it is.
 */
export function CampusHero({ campus }: { campus: Campus }) {
  const root = useRef<HTMLElement>(null);
  const [filmOn, setFilmOn] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(q("[data-film-media]"), { scale: 1.12 }, { scale: 1, duration: 2.2 }, 0)
          .fromTo(q("[data-fade]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07 }, 0.4)
          .fromTo(q("[data-panel]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0.6)
          .fromTo(q("[data-facts] > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0.8);

        // the film drifts a little slower than the page as it scrolls away
        gsap.to(q("[data-film-drift]"), {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const src = `https://player.vimeo.com/video/${campus.vimeo}?background=1&autoplay=1&loop=1&muted=1&dnt=1`;

  return (
    <section ref={root} aria-labelledby="campus-title" className="relative bg-canvas pb-8 lg:pb-14">
      {/* the first screen: the campus film behind the copy */}
      <div id="campus-hero" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink">
        <div aria-hidden className="absolute inset-0 -z-10 [container-type:size]">
          <div data-film-drift className="absolute inset-0">
            <div data-film-media className="absolute inset-0">
              <Image src={campus.poster} alt="" fill preload sizes="100vw" className="object-cover" />
              {/* the 16:9 film, sized to cover the screen whatever its shape */}
              <iframe
                src={src}
                title={`${campus.name} — campus film`}
                allow="autoplay; fullscreen; picture-in-picture"
                loading="eager"
                tabIndex={-1}
                onLoad={() => setFilmOn(true)}
                className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
                  filmOn ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
          {/* darkened from the foot and the left, so the white copy reads */}
          {/* an even shade (deeper on phones, where the copy runs the full height) */}
          <div className="absolute inset-0 bg-black/30 max-lg:bg-black/50" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0)_70%)] max-lg:hidden" />
        </div>

        <div className="container-page w-full pb-24 pt-[110px] lg:pb-28">
          <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
            {/* the programme, who and where, the CTAs, the approvals */}
            <div className="text-white max-lg:text-center">
              {/* the programme, two lines at most, its middle in the accent */}
              <h1
                id="campus-title"
                data-fade
                className="max-w-[760px] font-display text-[clamp(2rem,3.6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em] max-lg:mx-auto"
              >
                {campus.programme.lead}{" "}
                <span className="font-[family-name:var(--font-bricolage)] font-semibold tracking-[-0.02em] text-accent">
                  {campus.programme.accent}
                </span>
                {campus.programme.tail && <> {campus.programme.tail}</>}
              </h1>

              <p data-fade className="mt-4 text-[16px] leading-relaxed text-white/85 lg:text-[17px]">
                With {campus.name}, {campus.location.split(" (")[0]}
                <span className="text-white/40"> · </span>
                {campus.tracks.join(" | ")}
              </p>

              <div data-fade className="mt-7 flex flex-wrap items-center gap-3 max-lg:justify-center">
                <GlowButton
                  href="#apply"
                  className="max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center max-sm:[&>span:last-child]:py-4"
                >
                  Apply Now
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                </GlowButton>
                <Link
                  href="#brochure"
                  className="inline-flex items-center justify-center gap-2.5 rounded-[6px] border border-white/30 bg-white/10 px-6 py-[14.5px] text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-ink max-sm:w-full max-sm:py-[17.5px]"
                >
                  <Download size={16} strokeWidth={2} aria-hidden />
                  Download Brochure
                </Link>
              </div>

              {/* the approvals, as one quiet line under the CTAs */}
              <ul data-fade className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium text-white/80 max-lg:justify-center">
                {campus.approvals.map((a) => (
                  <li key={a} className="inline-flex items-center gap-1.5">
                    <Check size={14} strokeWidth={2.6} aria-hidden className="text-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* who builds the programme: the home page's company logos */}
            <div data-panel className="min-w-0 lg:justify-self-end">
              <CompanyLogos tone="dark" className="max-lg:text-center" />
            </div>
          </div>
        </div>
      </div>

      {/* the facts and who can apply, on a white strip over the film's foot */}
      <div className="container-page">
        <dl
          data-facts
          className="relative z-10 mx-auto -mt-12 grid max-w-[1080px] grid-cols-2 rounded-[6px] border border-ink/10 bg-white sm:-mt-14 lg:grid-cols-4"
        >
          {campus.facts.map((f, i) => (
            <div
              key={f.label}
              className={`p-4 sm:p-6 ${i % 2 === 1 ? "border-l border-ink/10" : ""} ${
                i > 1 ? "max-lg:border-t max-lg:border-ink/10" : ""
              } ${i === 2 ? "lg:border-l lg:border-ink/10" : ""}`}
            >
              <dt className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{f.label}</dt>
              <dd className="mt-1.5">
                <span className="block font-display text-[clamp(1rem,1.8vw,1.5rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
                  {f.value}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-body">{f.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
