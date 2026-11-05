"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Taught by World's Top Tech and Academic Minds"
 *
 * Copy, names, roles and portraits are sot.upgrad.com's (all 21 faculty).
 * Portraits are the site's cut-outs with its baked-in red block and swoosh
 * removed (public/images/faculty/*.png).
 *
 * Cards after a "speaker lineup" reference the client supplied: a frame with
 * "selection" corner handles, after the client's "PLACED" poster in black and
 * white: near-black throughout, the faintest lift at the foot,
 * frosted vertical glass bands, a glossy sheen and a fine bright inner edge,
 * the portrait outlined like a sticker with a white band (sticker-v2: the
 * band recoloured from the old yellow, orange and pink),
 * a name pill with a cursor, and the role in a white box beneath. Every
 * faculty member gets one, and they run past in a single moving strip under a
 * centred heading, alternate cards set lower for the staggered lineup look.
 *
 * Motion (GSAP): the strip loops endlessly right to left (the list is rendered
 * twice and the track slides by exactly half its width); hovering eases it to a stop and
 * leaving speeds it back up. The cards drop in like stickers (up, tilted,
 * settling level) when the strip first scrolls into view.
 */
type Person = { name: string; role: string; img: string };

const FACULTY: Person[] = [
  { name: "Vishwa Mohan", role: "CEO of upGrad SOT", img: "vishwa-mohan" },
  {
    name: "Rishi Saraf",
    role: "Cofounder & CEO DevDynamics",
    img: "rishi-saraf",
  },
  {
    name: "Gaurav Kaushik",
    role: "Senior Staff Software Engineer & Problem Solving Track Lead",
    img: "gaurav-kaushik",
  },
  {
    name: "Gladden Rumao",
    role: "Staff Software AI Engineer",
    img: "gladden-rumao",
  },
  {
    name: "Jyoti Nigam",
    role: "Data Scientist at upGrad SOT",
    img: "jyoti-nigam",
  },
  {
    name: "Rishabh Bafna",
    role: "Senior AI Engineer & Lead Instructor",
    img: "rishabh-bafna",
  },
  { name: "Mithun S", role: "SDE II at Cisco", img: "mithun-s" },
  {
    name: "Piyush Jain",
    role: "Senior Mathematician and Lead Instructor",
    img: "piyush-jain",
  },
  {
    name: "Bhavishya Rao",
    role: "Mathematics Teaching Assistant",
    img: "bhavishya-rao",
  },
  { name: "Akash Tiwari", role: "SDE + Instructor", img: "akash-tiwari" },
  { name: "Rahul Yadav", role: "SDE 2 + Lead Instructor", img: "rahul-yadav" },
  { name: "Deepak Mishra", role: "SDE + Instructor", img: "deepak-mishra" },
  {
    name: "Drishti Aggarwal",
    role: "SDE + Instructor",
    img: "drishti-aggarwal",
  },
  {
    name: "Dhanshree",
    role: "Mathematics Teaching Assistant",
    img: "dhanshree",
  },
  { name: "Simran Pathania", role: "SDE + SME", img: "simran-pathania" },
  { name: "Jai Prasad B", role: "SDE + Instructor", img: "jai-prasad-b" },
  { name: "Avinash Agrawal", role: "SDE + Instructor", img: "avinash-agrawal" },
  {
    name: "Shivam Shrivastava",
    role: "SDE + Instructor",
    img: "shivam-shrivastava",
  },
  {
    name: "Ananya Saini",
    role: "Mathematics Teaching Assistant",
    img: "ananya-saini",
  },
  {
    name: "Shivam Pandey",
    role: "Mathematics Teaching Assistant",
    img: "shivam-pandey",
  },
  { name: "Yash Gautam", role: "SDE + Instructor", img: "yash-gautam" },
];

/** company logos as sot.upgrad.com shows them per faculty member
 *  (public/images/faculty/logos); w/h are the files' pixel sizes */
const LOGOS = {
  upgradsot: {
    src: "upgradsot.webp",
    alt: "upGrad School of Technology",
    w: 595,
    h: 191,
  },
  linkedin: { src: "linkedin.webp", alt: "LinkedIn", w: 614, h: 177 },
  walmart: { src: "walmart.webp", alt: "Walmart", w: 681, h: 177 },
  paypal: { src: "paypal.webp", alt: "PayPal", w: 638, h: 177 },
  oracle: { src: "oracle.webp", alt: "Oracle", w: 1033, h: 177 },
  pw: { src: "pw.webp", alt: "PhysicsWallah", w: 100, h: 100 },
  hotstar: { src: "hotstar.webp", alt: "Hotstar", w: 300, h: 100 },
  vmware: { src: "vmware.webp", alt: "VMware", w: 511, h: 100 },
  salesforce: { src: "salesforce.webp", alt: "Salesforce", w: 259, h: 177 },
  microsoft: { src: "microsoft.webp", alt: "Microsoft", w: 734, h: 177 },
  barclays: { src: "barclays.webp", alt: "Barclays", w: 513, h: 100 },
  cisco: { src: "cisco_dark.webp", alt: "Cisco", w: 176, h: 100 },
  ineuron: { src: "ineuron.webp", alt: "iNeuron", w: 367, h: 100 },
  krmangalam: {
    src: "kr-mangalam.png",
    alt: "K.R. Mangalam University",
    w: 128,
    h: 128,
  },
} as const;
type LogoKey = keyof typeof LOGOS;

/** everyone else on sot.upgrad.com carries the upGrad SOT logo alone */
const COMPANIES: Record<string, LogoKey[]> = {
  "vishwa-mohan": [
    "upgradsot",
    "linkedin",
    "walmart",
    "paypal",
    "oracle",
    "pw",
  ],
  "rishi-saraf": ["upgradsot", "hotstar", "vmware", "walmart"],
  "gaurav-kaushik": ["salesforce", "microsoft", "paypal"],
  "gladden-rumao": ["upgradsot", "barclays"],
  "mithun-s": ["upgradsot", "cisco", "ineuron"],
  "akash-tiwari": ["upgradsot", "krmangalam"],
};
/** logo height by how many a card carries: one logo can be big, a full row
 *  of six has to share two lines of the box */
const logoHeightFor = (n: number) =>
  n === 1 ? 30 : n === 2 ? 22 : n === 3 ? 20 : 18;

/** every card's backdrop, after the client's "PLACED" poster reference, in
 *  black: near-black throughout, the faintest lift at the foot, with a soft
 *  glossy sheen */
const BACKDROP = [
  // a glossy sheen across the glass
  "linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0) 50%)",
  // near-black throughout, the faintest lift and see-through at the foot
  "linear-gradient(180deg, #040405 0%, #08080a 70%, rgba(20,21,24,0.96) 100%)",
].join(", ");

/** the PLACED poster's frosted glass: wide, soft vertical bands of light and
 *  shade, blurred */
function Glass() {
  return (
    <span aria-hidden className="absolute inset-0">
      {/* frosted vertical bands */}
      <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0)_0px,rgba(255,255,255,0.06)_10px,rgba(255,255,255,0.015)_22px,rgba(0,0,0,0.3)_34px,rgba(255,255,255,0)_44px)] blur-[3px]" />
    </span>
  );
}
const INK = "#0b0d12";
/** seconds for the strip to travel one full copy of the list */
const LOOP_SECONDS = 55;

function Handle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-[3] size-2.5 border border-ink bg-white ${className}`}
    />
  );
}

function StickerCard({
  p,
  index,
  copy,
}: {
  p: Person;
  /** position within one copy of the list, so both copies match exactly */
  index: number;
  copy: boolean;
}) {
  const logos = COMPANIES[p.img] ?? ["upgradsot"];
  const logoHeight = logoHeightFor(logos.length);
  return (
    <li
      data-card
      aria-hidden={copy || undefined}
      className={`group w-[280px] shrink-0 px-4 ${index % 2 ? "pt-12" : ""}`}
    >
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-2">
        {/* the photo frame, outlined like a selected design layer */}
        <div
          className="relative border border-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.14)]"
          style={{ background: BACKDROP }}
        >
          <Handle className="-left-[5px] -top-[5px]" />
          <Handle className="-right-[5px] -top-[5px]" />
          <Handle className="-bottom-[5px] -left-[5px]" />
          <Handle className="-bottom-[5px] -right-[5px]" />

          {/* designation, in the open space above the portrait */}
          <p className="absolute inset-x-0 top-0 z-[2] px-5 pt-4 text-center text-[13px] font-semibold leading-snug text-white/90">
            {p.role}
          </p>

          <div className="relative aspect-[1/1.12] overflow-hidden">
            <Glass />
            <div className="absolute inset-x-[6%] bottom-0 top-[22%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
              {/* the sticker look (a white band, an ink outline
                  and a soft offset shadow) is baked into these PNGs: as CSS
                  drop-shadow filters it had to be repainted on all 42 cards
                  every frame and made the strip stutter */}
              <Image
                src={`/images/faculty/sticker-v2/${p.img}.png`}
                alt={copy ? "" : p.name}
                fill
                sizes="280px"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* name pill with a pointer, over the frame's lower edge */}
          <span className="absolute bottom-3.5 left-1/2 z-[3] -translate-x-1/2 whitespace-nowrap">
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="absolute -left-4 -top-3 size-4 -rotate-12 text-accent"
              fill="currentColor"
            >
              <path
                d="M2 1.5 14 7l-5.2 1.7L6.6 14z"
                stroke={INK}
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="inline-block rounded-[6px] border border-ink bg-accent px-3.5 py-1 text-[13px] font-semibold text-white shadow-[2px_2px_0_rgba(11,13,18,0.25)]">
              {p.name}
            </span>
          </span>
        </div>

        {/* companies they've worked with, in a white box just inset under the
            frame; room for two rows so every card is the same height */}
        <ul className="mx-2 -mt-px flex min-h-[61px] flex-wrap items-center justify-center gap-x-2.5 gap-y-2 border border-t-0 border-ink bg-white px-2 py-2">
          {logos.map((k) => {
            const l = LOGOS[k];
            return (
              <li key={k}>
                <Image
                  src={`/images/faculty/logos/${l.src}`}
                  alt={copy ? "" : l.alt}
                  width={Math.round((l.w / l.h) * logoHeight)}
                  height={logoHeight}
                  className="block w-auto object-contain"
                  style={{ height: logoHeight }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export function Faculty() {
  const root = useRef<HTMLElement>(null);
  /** slides the strip one card back (-1) or on (1); set up with the loop */
  const step = useRef<(dir: 1 | -1) => void>(() => {});

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0];
      const strip = q("[data-strip]")[0];
      const mm = gsap.matchMedia();

      // travels right to left: slides back by one copy of the list, then
      // repeats. On its own GPU layer (force3D) so each frame is just a move,
      // never a repaint of the cards. Started many loops in, so the arrows can
      // step it backwards past the start; with reduced motion it stands still
      // and only the arrows move it.
      const makeLoop = (auto: boolean) => {
        const loop = gsap.fromTo(
          track,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: LOOP_SECONDS,
            ease: "none",
            repeat: -1,
            force3D: true,
            paused: !auto,
          },
        );
        loop.totalTime(LOOP_SECONDS * 100);

        // the arrows: glide the loop one card's worth of its time either way
        // (the repeat wraps it), the auto-scroll held while it does. However
        // many clicks come in a row, it picks up again shortly after the last
        // one — a beat's pause, then easing back up to speed (~1.5s in all)
        let resume: gsap.core.Tween | null = null;
        step.current = (dir) => {
          resume?.kill();
          loop.pause();
          gsap.to(loop, {
            totalTime: loop.totalTime() + (dir * LOOP_SECONDS) / FACULTY.length,
            duration: 0.7,
            ease: "power3.inOut",
            // only an earlier step's glide, not the hover slow-down
            overwrite: "auto",
            onComplete: () => {
              if (!auto) return;
              resume = gsap.delayedCall(0.3, () => {
                loop.timeScale(0).play();
                gsap.to(loop, { timeScale: 1, duration: 0.5, ease: "power1.in", overwrite: "auto" });
              });
            },
          });
        };
        return loop;
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        makeLoop(false);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = makeLoop(true);

        // ease to a stop under the pointer, back up to speed on leave
        const slow = () =>
          gsap.to(loop, {
            timeScale: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        const go = () =>
          gsap.to(loop, {
            timeScale: 1,
            duration: 0.8,
            ease: "power2.in",
            overwrite: "auto",
          });
        strip.addEventListener("mouseenter", slow);
        strip.addEventListener("mouseleave", go);

        // only the cards on screen when the strip arrives drop in; animating
        // all 42 (most off-screen) cost frames for nothing
        const onScreen = q("[data-card]").filter((c) => {
          const r = c.getBoundingClientRect();
          return r.right > 0 && r.left < window.innerWidth;
        });
        gsap.fromTo(
          onScreen,
          { y: 80, rotation: (i) => (i % 2 ? 5 : -5), autoAlpha: 0 },
          {
            y: 0,
            rotation: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: strip,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        return () => {
          strip.removeEventListener("mouseenter", slow);
          strip.removeEventListener("mouseleave", go);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="faculty"
      className="bg-canvas pb-12 pt-12 lg:pb-16 lg:pt-28"
    >
      <div className="container-page">
        <SectionHeading
          title="Taught by World's Top Tech and"
          accent="Academic Minds"
          intro={
            // one line from sm up: the block is widened past the intro's
            // 640px cap, evenly on both sides, so it stays centred
            <span className="sm:-mx-12 sm:block sm:whitespace-nowrap">
              Industry experts and innovators who turn real-world experience
              into transformative learning.
            </span>
          }
        />

        {/* every faculty member, in one strip that keeps moving, held to the
            same width as every other section. Its edges fade with white
            overlays rather than a CSS mask, which would be re-applied over
            the moving strip on every frame */}
        <div
          data-strip
          className="relative mt-14 overflow-hidden [contain:paint] lg:mt-16"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-canvas to-transparent sm:w-16"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-canvas to-transparent sm:w-16"
          />
          <ul
            data-track
            className="flex w-max py-6 will-change-transform [backface-visibility:hidden]"
          >
            {[...FACULTY, ...FACULTY].map((p, i) => (
              <StickerCard
                key={`${p.img}-${i}`}
                p={p}
                index={i % FACULTY.length}
                copy={i >= FACULTY.length}
              />
            ))}
          </ul>
        </div>

        {/* move the strip by hand, one card at a time */}
        <div className="mt-6 flex justify-center gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step.current(dir)}
              aria-label={dir < 0 ? "Previous faculty member" : "Next faculty member"}
              className="grid size-11 place-items-center rounded-[6px] border border-ink/15 bg-white text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {dir < 0 ? (
                <ArrowLeft size={18} strokeWidth={2} aria-hidden />
              ) : (
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
