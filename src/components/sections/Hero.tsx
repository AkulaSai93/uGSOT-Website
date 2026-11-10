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

/** The upGrad SoT hero footage, re-encoded and served from the site
 *  (public/videos/hero): the CloudFront originals were 8.3MB (webm, which
 *  Chrome picked) and 5.9MB (mp4). These are 3.2MB at 720p for desktop and
 *  1.9MB at 480p for phones, 24fps, with a poster frame so the pill shows a
 *  picture at once. */
const VIDEO = {
  desktop: "/videos/hero/hero-720.mp4",
  phone: "/videos/hero/hero-480.mp4",
  poster: "/videos/hero/hero-poster.jpg",
};

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
 * scrubs the pill open to a clean full-bleed film. On desktop the headline
 * splits apart as it does; below lg it fades out where it is instead, so the
 * small screen never clutters. Reduced motion: one static screen, no scrub,
 * everything visible.
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

        // Headline metrics change once the display face swaps in.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });

      // Phones and tablets: act 2 without the clutter. The film still opens
      // from its pill to the full screen as you scroll, but the headline and
      // the content under it fade out where they are instead of splitting
      // sideways. The pill is measured afresh on every update (not once per
      // refresh), so the film can't drift off it when the mobile address bar
      // resizes the screen.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const text = q("h1, .hero-bottom, .hero-logos");
        const fade = q(".hero-fade")[0];
        const video = q<HTMLVideoElement>(".hero-video")[0];
        const ease = gsap.parseEase("power2.inOut");
        let progress = 0;
        const render = () => {
          const b = pillBox();
          const w = stage.current!.clientWidth;
          const h = stage.current!.clientHeight;
          const t = ease(Math.min(progress / 0.7, 1));
          gsap.set(media.current, {
            left: b.left * (1 - t),
            top: b.top * (1 - t),
            width: b.width + (w - b.width) * t,
            height: b.height + (h - b.height) * t,
            borderRadius: (b.height / 2) * (1 - t),
          });
          gsap.set(video, { scale: 1.35 - 0.35 * Math.min(progress / 0.7, 1) });
          gsap.set(text, { opacity: 1 - Math.min(progress / 0.3, 1) });
          gsap.set(fade, { opacity: Math.min(Math.max((progress - 0.45) / 0.25, 0), 1) });
        };
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progress = self.progress;
            render();
            if (progress > 0 && video?.paused) video.play().catch(() => {});
          },
        });
        render();
        const ro = new ResizeObserver(render);
        ro.observe(stage.current!);
        document.fonts?.ready.then(render);
        return () => {
          ro.disconnect();
          st.kill();
        };
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
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
        className="sticky top-0 isolate h-svh min-h-[640px] overflow-clip max-lg:h-dvh"
      >
        {/* --------------------------------------------- background image */}
        {/* Full-bleed illustration, Conclave-style: students looking out at a
            city skyline at sunrise on the right, calm bright sky on the left. A white wash
            on the left (and top-to-bottom on phones) keeps the ink type clean. */}
        <div aria-hidden className="hero-bg-wrap absolute inset-0 -z-10">
          <div className="hero-bg absolute inset-0">
            {/* desktop: the wide scene, students on the right of the copy */}
            <Image
              src="/images/hero/hero-skyline.jpg"
              alt=""
              fill
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-[100%_100%] max-lg:hidden"
            />
            {/* phones and tablets: the same scene drawn tall (Figma AI) —
                open sky where the copy sits, the skyline and the students
                small at the foot — so nothing busy sits behind the text */}
            <Image
              src="/images/hero/hero-skyline-mobile.jpg"
              alt=""
              fill
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-bottom lg:hidden"
            />
          </div>
          {/* a light wash so the copy reads: across from the left on
              desktop; on phones, strongest through the middle where the copy
              is, lighter at the top and the foot so the sky and the
              students still show */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.4)_40%,rgba(255,255,255,0)_60%)] max-lg:bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.5)_22%,rgba(255,255,255,0.66)_50%,rgba(255,255,255,0.4)_70%,rgba(255,255,255,0)_82%)]" />
          {/* phones: a black overlay low at the foot, just under the white
              company logos, leaving the students above it clear */}
          <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(0deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0)_100%)] lg:hidden" />
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
            preload="metadata"
            poster={VIDEO.poster}
            className="hero-video absolute inset-0 size-full object-cover"
          >
            <source media="(max-width: 1023px)" src={VIDEO.phone} type="video/mp4" />
            <source src={VIDEO.desktop} type="video/mp4" />
          </video>
          {/* Bottom fade into the page canvas below, so the full-bleed film
              has no hard edge. Hidden while the film is still a pill. */}
          {/* over the full-bleed film: a white fade into the page on
              desktop; on phones a black overlay instead, matching the one
              under the logos */}
          <div className="hero-fade absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_45%,#ffffff_100%)] opacity-0 max-lg:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        {/* ------------------------------------------------------- act 1 */}
        <div className="container-page relative z-10 flex h-full flex-col justify-start pb-[118px] pt-[clamp(84px,12svh,112px)] lg:justify-center lg:pb-8 lg:pt-[88px]">
          {/* The words are the heading's real text (one mask each, real spaces
              between), so it reads, selects and copies as written. */}
          {/* Below lg (phones, mostly) the whole block is centred and a size
              up: the headline (sized so "Computer Science" holds one line),
              the lines under it, the facts and full-width buttons. It sits
              from the top rather than the middle, so the students in the
              picture show between the buttons and the logos. */}
          <h1 className="font-display text-[min(10.2vw,8.6vh)] font-bold leading-[0.95] tracking-[-0.04em] max-lg:text-center max-lg:leading-[1.08] sm:text-[min(9vw,8.6vh)] lg:text-[min(6vw,9.5vh)]">
            <span className="block">
              <span className="hero-line-1 block">
                <MaskWord attr="hero">AI-First</MaskWord>
              </span>{" "}
              <span className="hero-line-2 flex items-center gap-[0.18em] max-lg:justify-center">
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
              <span className="hero-line-3 block whitespace-nowrap">
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
          <div className="hero-bottom mt-[clamp(1.25rem,3vh,1.75rem)] w-full max-w-[640px] max-lg:mx-auto max-lg:text-center">
            <p
              data-reveal="fade"
              className="text-[16px] leading-relaxed text-body lg:text-[15px]"
            >
              Quantum Computing <span className="text-ink/30">|</span> GenAI
              &amp; ML <span className="text-ink/30">|</span> Full Stack
              Development &amp; Cloud Innovation
            </p>

            <p
              data-reveal="fade"
              className="mt-[clamp(0.75rem,1.8vh,1rem)] text-[17px] font-bold text-ink lg:text-[14.5px]"
            >
              Admission starts with uGNET
            </p>

            <div data-reveal="fade">
              <HeroFacts className="mt-[clamp(0.75rem,1.8vh,1rem)] max-lg:justify-center" />
            </div>

            <div
              data-reveal="fade"
              className="mt-[clamp(1.25rem,2.8vh,1.5rem)] flex flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
            >
              <Magnetic>
                <GlowButton
                  href="#apply"
                  streak="#0b0d12"
                  className="max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center max-sm:[&>span:last-child]:py-4 max-sm:[&>span:last-child]:text-[16px]"
                >
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
                  className="inline-flex items-center justify-center gap-2.5 rounded-[6px] border border-ink/25 bg-white/60 px-6 py-[14.5px] backdrop-blur-md text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white max-sm:w-full max-sm:py-[17.5px] max-sm:text-[16px]"
                >
                  <Download size={16} strokeWidth={2} aria-hidden />
                  Download Brochure
                </Link>
              </Magnetic>
            </div>

            {/* desktop: the strip under the buttons */}
            <div
              data-reveal="fade"
              className="mt-[clamp(1.25rem,3vh,2rem)] hidden lg:block"
            >
              <CompanyLogos tone="light" compact />
            </div>
          </div>
        </div>

        {/* phones and tablets: the strip at the hero's foot, in white over
            the black overlay */}
        <div className="hero-logos container-page absolute inset-x-0 bottom-0 z-10 pb-[max(20px,env(safe-area-inset-bottom))] text-center lg:hidden">
          <div data-reveal="fade">
            <CompanyLogos tone="dark" compact className="[&>p]:text-[14px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
