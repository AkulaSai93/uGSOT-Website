"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play, X } from "lucide-react";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Inside The IIT Race" — the Figuring Out x upGrad School of Technology
 * episode (Raj Shamani with Vishwa Mohan).
 *
 * Copy, logos and thumbnail are sot.upgrad.com's. Laid out like that page's
 * block, in the site's light theme: a full-width red band with the two show
 * logos in white running along the top, then the logos, title and line on
 * the left and the episode on the right; clicking it plays the episode in
 * the player overlay.
 *
 * Motion (GSAP): the logo strip loops right to left; the copy rises in and
 * the video opens with a clip reveal as the block scrolls in.
 */
const EPISODE: Video = {
  id: "Zmz5gE9nJqY",
  name: "Inside The IIT Race — Raj Shamani × Vishwa Mohan",
  thumb: "/images/spotlight/iit-race.jpg",
};
const LOOP_SECONDS = 30;

/** the two show logos with a cross between them; all white on the red band
 *  (spotlight/*-white.png are the logos recoloured to plain white, cropped
 *  tight; figuring-out-dark.png is the same lettering in ink. Neither keeps
 *  the Figuring Out logo's white box) */
function Lockup({ onRed = false }: { onRed?: boolean }) {
  const h = onRed ? "h-6" : "h-8";
  return (
    <span className={`flex shrink-0 items-center ${onRed ? "gap-6" : "gap-5"}`}>
      <Image
        src={onRed ? "/images/spotlight/figuring-out-white.png" : "/images/spotlight/figuring-out-dark.png"}
        alt="Figuring Out with Raj Shamani"
        width={411}
        height={84}
        className={`${h} w-auto`}
      />
      <X aria-hidden size={onRed ? 16 : 20} strokeWidth={1.75} className={onRed ? "text-white" : "text-body"} />
      <Image
        src={onRed ? "/images/spotlight/sot-white.png" : "/images/logo-sot.png"}
        alt="upGrad School of Technology"
        width={onRed ? 445 : 467}
        height={onRed ? 122 : 144}
        className={`${h} w-auto`}
      />
    </span>
  );
}

export function IITRace() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-track]"),
          { xPercent: 0 },
          { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1, force3D: true },
        );
        gsap.fromTo(
          q("[data-copy] > *"),
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 80%", toggleActions: "play none none none" },
          },
        );
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q("[data-video]")[0], start: "top 80%", toggleActions: "play none none none" },
        });
        tl.fromTo(
          q("[data-video]"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.out" },
        ).fromTo(q("[data-video-img]"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="iit-race" className="bg-canvas pb-12 lg:pb-14">
      {/* the two shows in white on a full-width red band, running right to left */}
      <div aria-hidden className="overflow-hidden bg-accent py-3">
        <div data-track className="flex w-max will-change-transform">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="pr-20">
              <Lockup onRed />
            </span>
          ))}
        </div>
      </div>

      <div className="container-page">
        <div className="mt-14 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div data-copy>
            <Lockup />
            <h2 className="mt-10 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
              Inside The{" "}
              <span className="font-[family-name:var(--font-bricolage)] font-semibold text-accent">IIT Race</span>
            </h2>
            <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-body">
              The reality behind the IIT dream, what students are rarely told about placement packages,
              and why chasing salary numbers often creates the wrong expectations.
            </p>
          </div>

          <button
            type="button"
            data-video
            onClick={() => setPlaying(true)}
            aria-label="Play the episode: Inside The IIT Race"
            className="group relative block aspect-video w-full overflow-hidden rounded-[6px] bg-ink shadow-[0_30px_60px_-30px_rgba(11,13,18,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span data-video-img className="absolute inset-0">
              <Image
                src={EPISODE.thumb}
                alt="Raj Shamani and Vishwa Mohan on Figuring Out"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </span>
            <span aria-hidden className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-white text-ink shadow-[0_8px_24px_-8px_rgba(11,13,18,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 sm:size-20">
                <Play size={24} fill="currentColor" strokeWidth={0} className="translate-x-[2px]" />
              </span>
            </span>
          </button>
        </div>
      </div>

      {playing && <VideoPlayer video={EPISODE} onClose={() => setPlaying(false)} />}
    </section>
  );
}
