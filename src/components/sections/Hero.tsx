"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Download } from "lucide-react";
import { MaskWord } from "@/components/motion/MaskWord";
import { Magnetic } from "@/components/motion/Magnetic";
import { CompanyLogos } from "@/components/site/CompanyLogos";
import { GlowButton } from "@/components/site/GlowButton";
import { HeroFacts } from "@/components/site/HeroFacts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Existing upGrad SoT hero footage. Swap for a self-hosted /videos/hero.webm later. */
const VIDEO_BASE =
  "https://dd848r0fq5a5i.cloudfront.net/asset-optimization/video/landing_herosection_video/landing_herosection_video";

/**
 * Hero — "the campus opens up".
 *
 * Act 1 (first screen): oversized kinetic headline over a full-bleed
 * illustration in the Conclave 2026 manner (public/images/hero/hero-skyline.jpg,
 * generated with Figma AI): students seen from behind looking out at a city
 * skyline at sunrise, painterly clouds, a near-neutral palette with only a
 * touch of red, and bright on the left for the copy. The campus film plays inside a pill set into the headline itself
 * ("B.Tech in [film]"). Below it, the same content block as the current
 * site: specialisations, uGNET, facts, CTAs.
 *
 * Act 2 (scroll): the section is 200svh tall with a sticky stage. Scrolling
 * scrubs the pill open to a clean full-bleed film while the headline splits
 * apart. Reduced motion: one static screen, no scrub, everything visible.
 *
 * Content-first: every fact, CTA and specialisation is in the first screen as
 * real text.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Media box geometry = the pill's box, relative to the sticky stage.
      const pillBox = () => {
        const s = stage.current!.getBoundingClientRect();
        const p = pill.current!.getBoundingClientRect();
        return {
          left: p.left - s.left,
          top: p.top - s.top,
          width: p.width,
          height: p.height,
        };
      };
      const placeOnPill = () => {
        const b = pillBox();
        gsap.set(media.current, { ...b, borderRadius: b.height / 2 });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        placeOnPill();
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        const ro = new ResizeObserver(placeOnPill);
        ro.observe(stage.current!);
        document.fonts?.ready.then(placeOnPill);
        return () => ro.disconnect();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------------------------------------------- act 1: entrance */
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .fromTo(
            q(".hero-bg"),
            { scale: 1.12, opacity: 0 },
            { scale: 1, opacity: 1, duration: 2.2 },
            0,
          )
          .fromTo(
            q("[data-reveal='word']"),
            { yPercent: 110, rotate: 4, autoAlpha: 0 },
            {
              yPercent: 0,
              rotate: 0,
              autoAlpha: 1,
              duration: 1.15,
              stagger: 0.075,
            },
            0.1,
          )
          .fromTo(
            media.current,
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.1 },
            0.5,
          )
          .fromTo(
            q("[data-reveal='fade']"),
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.06 },
            0.55,
          );

        /* ---------------------------------------------- act 2: scroll */
        const vw = () => window.innerWidth;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // Mobile browsers may pause a tiny muted video; make sure the film
            // is running by the time it fills the screen.
            onUpdate: () => {
              const v = q<HTMLVideoElement>(".hero-video")[0];
              if (v?.paused) v.play().catch(() => {});
            },
          },
        });

        tl.fromTo(
          media.current,
          {
            left: () => pillBox().left,
            top: () => pillBox().top,
            width: () => pillBox().width,
            height: () => pillBox().height,
            borderRadius: () => pillBox().height / 2,
          },
          {
            left: 0,
            top: 0,
            width: () => stage.current!.clientWidth,
            height: () => stage.current!.clientHeight,
            borderRadius: 0,
            duration: 0.55,
            ease: "power2.inOut",
          },
          0,
        )
          .to(
            q(".hero-line-1"),
            { x: () => -vw() * 0.18, opacity: 0, duration: 0.4 },
            0,
          )
          .to(
            q(".hero-line-3"),
            { x: () => vw() * 0.18, opacity: 0, duration: 0.4 },
            0,
          )
          .to(q(".hero-line-2-text"), { opacity: 0, duration: 0.25 }, 0)
          .to(q(".hero-bottom"), { y: 40, opacity: 0, duration: 0.25 }, 0)
          .to(
            q(".hero-bg-wrap"),
            { scale: 1.1, yPercent: -3, duration: 0.55 },
            0,
          )
          .fromTo(
            q(".hero-video"),
            { scale: 1.35 },
            { scale: 1, duration: 0.7 },
            0,
          )
          .to(q(".hero-fade"), { opacity: 1, duration: 0.25 }, 0.3)
          .to({}, { duration: 0.25 }); // hold the full-bleed film before the stage scrolls away

        // Headline metrics change once the display face swaps in.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="AI-First B.Tech in Computer Science"
      className="relative h-[200svh] bg-[#ffffff] text-ink motion-reduce:h-svh"
    >
      <div
        ref={stage}
        className="sticky top-0 isolate h-svh min-h-[640px] overflow-clip"
      >
        {/* --------------------------------------------- background image */}
        {/* Full-bleed illustration, Conclave-style: students looking out at a
            city skyline at sunrise on the right, calm bright sky on the left. A white wash
            on the left (and top-to-bottom on phones) keeps the ink type clean. */}
        <div aria-hidden className="hero-bg-wrap absolute inset-0 -z-10">
          <div className="hero-bg absolute inset-0">
            <Image
              src="/images/hero/hero-skyline.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[78%_100%] lg:object-[100%_100%]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.4)_40%,rgba(255,255,255,0)_60%)] max-lg:bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.45)_35%,rgba(255,255,255,0.82)_55%,rgba(255,255,255,0.9)_100%)]" />
        </div>

        {/* ------------------------------------------- the campus film (pill → full bleed) */}
        <div
          ref={media}
          data-reveal="media"
          aria-hidden
          className="absolute left-0 top-0 z-0 size-0 overflow-hidden bg-[#e9e4de] shadow-[0_10px_30px_-12px_rgba(11,13,18,0.35)] will-change-[width,height,left,top]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-video absolute inset-0 size-full object-cover"
          >
            <source src={`${VIDEO_BASE}.webm`} type="video/webm" />
            <source src={`${VIDEO_BASE}.mp4`} type="video/mp4" />
          </video>
          {/* Bottom fade into the page canvas below, so the full-bleed film
              has no hard edge. Hidden while the film is still a pill. */}
          <div className="hero-fade absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_45%,#ffffff_100%)] opacity-0" />
        </div>

        {/* ------------------------------------------------------- act 1 */}
        <div className="container-page relative z-10 flex h-full flex-col justify-center pb-8 pt-[80px] lg:pt-[88px]">
          {/* The words are the heading's real text (one mask each, real spaces
              between), so it reads, selects and copies as written. */}
          <h1 className="font-display text-[min(11vw,9vh)] font-bold leading-[0.95] tracking-[-0.04em] sm:text-[min(6vw,9.5vh)]">
            <span className="block">
              <span className="hero-line-1 block">
                <MaskWord attr="hero">AI-First</MaskWord>
              </span>{" "}
              <span className="hero-line-2 flex items-center gap-[0.18em]">
                <span className="hero-line-2-text inline-block whitespace-nowrap">
                  <MaskWord attr="hero">B.Tech</MaskWord>{" "}
                  <MaskWord
                    attr="hero"
                    className="font-[family-name:var(--font-bricolage)] font-semibold tracking-[-0.02em] text-ink/55"
                  >
                    in
                  </MaskWord>
                </span>
                {/* Placeholder box: the floating film is measured against it. */}
                <span
                  ref={pill}
                  aria-hidden
                  className="inline-block h-[0.74em] w-[1.9em] shrink-0 translate-y-[0.04em] rounded-full"
                />
              </span>{" "}
              <span className="hero-line-3 block">
                <MaskWord attr="hero">Computer</MaskWord>{" "}
                <MaskWord
                  attr="hero"
                  className="font-[family-name:var(--font-bricolage)] font-semibold tracking-[-0.02em] text-accent"
                >
                  Science
                </MaskWord>
              </span>
            </span>
          </h1>

          {/* Content block, same order as the current site's hero. */}
          <div className="hero-bottom mt-[clamp(1rem,2.6vh,1.75rem)] max-w-[640px]">
            <p
              data-reveal="fade"
              className="text-[14px] leading-relaxed text-body sm:text-[15px]"
            >
              Quantum Computing <span className="text-ink/30">|</span> GenAI
              &amp; ML <span className="text-ink/30">|</span> Full Stack
              Development &amp; Cloud Innovation
            </p>

            <p
              data-reveal="fade"
              className="mt-[clamp(0.625rem,1.8vh,1rem)] text-[14.5px] font-bold text-ink"
            >
              Admission starts with uGNET
            </p>

            <div data-reveal="fade">
              <HeroFacts className="mt-[clamp(0.625rem,1.6vh,1rem)]" />
            </div>

            <div
              data-reveal="fade"
              className="mt-[clamp(1rem,2.4vh,1.5rem)] flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <GlowButton href="#apply" streak="#0b0d12">
                  Apply Now
                  <ArrowRight
                    size={16}
                    strokeWidth={2.2}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </GlowButton>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link
                  href="#brochure"
                  className="inline-flex items-center gap-2.5 rounded-[6px] border border-ink/25 px-6 py-[14.5px] text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Download size={16} strokeWidth={2} aria-hidden />
                  Download Brochure
                </Link>
              </Magnetic>
            </div>

            <div
              data-reveal="fade"
              className="mt-[clamp(1.25rem,3vh,2rem)] hidden lg:block"
            >
              <CompanyLogos tone="light" compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
