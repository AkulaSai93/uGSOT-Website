"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Latest News & Insights"
 *
 * Copy (headlines, outlets, dates) and images are sot.upgrad.com's six press
 * cards; each image carries its outlet's masthead.
 *
 * Layout after the "Internship Report" card on scaler.com/school-of-technology,
 * in the site's light theme: each story is a card with a small book on the
 * left (the story's picture as its cover) and, on the right, the outlet and
 * date, the headline cut to two lines, and a "Read more" button. Hovering a
 * card opens the book: the cover swings back on its spine to show the pages
 * underneath. The cards run past in one strip that keeps moving.
 *
 * LINKS TO ADD: each story's `href` below is a placeholder ("#"). Paste the
 * article URL in when you have it; "Read more" (and the book) then open it in
 * a new tab.
 *
 * Motion (GSAP): the strip loops right to left (the list is rendered twice
 * and the track slides by exactly half its width); hovering the strip eases
 * it to a stop so a story can be read and clicked, and leaving speeds it back
 * up. The cover swing is a CSS 3D transition.
 */
type Story = {
  outlet: string;
  date: string;
  headline: string;
  img: string;
  /** full article on the outlet's site; "#" until the link is supplied */
  href: string;
};

const STORIES: Story[] = [
  {
    outlet: "The Hindu",
    date: "07 May 2026",
    headline:
      "upGrad School of Technology Introduces Scholarships for AI-Focused B.Tech Programmes, to Address India's Engineering Skills Gap",
    img: "thehindu",
    href: "#",
  },
  {
    outlet: "News in Pics",
    date: "07 May 2026",
    headline:
      "upGrad School of Technology Introduces Scholarships for AI-Focused B.Tech Programmes, to Address India's Engineering Skills Gap.",
    img: "newsinpics",
    href: "#",
  },
  {
    outlet: "Business News for Profit",
    date: "07 May 2026",
    headline:
      "upGrad School of Technology has announced scholarships of up to 100% for students enrolling in its four-year B.Tech Computer Science programmes.",
    img: "businessnewsforprofit",
    href: "#",
  },
  {
    outlet: "PNI News",
    date: "07 May 2026",
    headline:
      "Scholarships are awarded based on defined merit and eligibility criteria, and among eligible candidates, allocation may be on a first-come-first-served basis until exhaustion.",
    img: "pninews",
    href: "#",
  },
  {
    outlet: "Business News This Week",
    date: "07 May 2026",
    headline:
      "The selection process is governed by the uGNET cycle, which includes a rigorous entrance examination and a personal interview.",
    img: "businessnewsthisweek",
    href: "#",
  },
  {
    outlet: "BW Education",
    date: "07 May 2026",
    headline:
      "New Scholarship Scheme Targets AI & Future-tech Engineering Aspirants.",
    img: "bweducation",
    href: "#",
  },
];

/** seconds for the strip to travel one full copy of the stories */
const LOOP_SECONDS = 45;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** placeholder links stay on the page; real ones open the article in a new tab */
const linkProps = (href: string) =>
  href === "#"
    ? { href }
    : { href, target: "_blank", rel: "noopener noreferrer" };

/**
 * The book: a stack of pages with the cover on top, hinged on its left edge.
 * On the card's hover the cover swings back (rotateY about the spine) and the
 * pages show; the page edges peek out to the right like a closed book's.
 */
function Book({ s }: { s: Story }) {
  return (
    <a
      {...linkProps(s.href)}
      tabIndex={-1}
      aria-hidden
      className="relative block aspect-[3/4] w-[112px] shrink-0 [perspective:1000px] sm:w-[136px]"
    >
      {/* page edges, then the first page */}
      <span className="absolute inset-y-[3px] left-[6px] right-[-6px] rounded-r-[4px] border border-ink/10 bg-white" />
      <span className="absolute inset-y-[1.5px] left-[3px] right-[-3px] rounded-r-[4px] border border-ink/10 bg-white" />
      <span className="absolute inset-0 overflow-hidden rounded-r-[4px] border border-ink/10 bg-white px-3 py-4">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-accent">
          {s.outlet}
        </span>
        <span className="mt-2 line-clamp-4 block text-[9.5px] font-semibold leading-snug text-ink">
          {s.headline}
        </span>
        <span className="mt-3 flex flex-col gap-1.5">
          {[100, 92, 96, 70].map((w) => (
            <span
              key={w}
              className="block h-[3px] rounded-full bg-ink/10"
              style={{ width: `${w}%` }}
            />
          ))}
        </span>
      </span>
      {/* the cover */}
      <span
        className={`absolute inset-0 origin-left overflow-hidden rounded-r-[4px] shadow-[6px_10px_24px_-10px_rgba(11,13,18,0.5)] transition-transform duration-700 [backface-visibility:hidden] [transform-style:preserve-3d] ${EASE} group-hover:[transform:rotateY(-58deg)]`}
      >
        <Image
          src={`/images/news/${s.img}.jpg`}
          alt=""
          fill
          sizes="150px"
          className="object-cover"
        />
        {/* spine shading and a soft sheen across the cover */}
        <span className="absolute inset-y-0 left-0 w-3 bg-[linear-gradient(90deg,rgba(0,0,0,0.35),rgba(0,0,0,0)_100%)]" />
        <span className="absolute inset-y-0 left-3 w-px bg-white/25" />
        <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_40%)]" />
      </span>
    </a>
  );
}

function StoryCard({ s, copy }: { s: Story; copy: boolean }) {
  return (
    <li aria-hidden={copy || undefined} className="pr-5">
      <article className="group flex h-full w-[min(86vw,540px)] items-center gap-6 rounded-[4px] border border-ink/10 bg-white p-5 sm:gap-7">
        <Book s={s} />
        <div className="min-w-0">
          <p className="whitespace-nowrap text-[12.5px] font-semibold text-accent">
            {s.outlet}
            <span aria-hidden className="mx-1.5 text-ink/25">
              ·
            </span>
            <span className="font-medium text-body">{s.date}</span>
          </p>
          {/* kept short: two lines, the rest trails off in an ellipsis */}
          <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-ink sm:text-[16px]">
            {s.headline}
          </h3>
          <a
            {...linkProps(s.href)}
            tabIndex={copy ? -1 : undefined}
            aria-label={`Read more: ${s.headline} (${s.outlet})`}
            className="group/link mt-4 inline-flex items-center gap-2 rounded-[6px] bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-ink"
          >
            Read more
            <ArrowUpRight
              size={15}
              strokeWidth={2}
              aria-hidden
              className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </a>
        </div>
      </article>
    </li>
  );
}

export function News() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0];
      const strip = q("[data-strip]")[0];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.fromTo(
          track,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: LOOP_SECONDS,
            ease: "none",
            repeat: -1,
            force3D: true,
          },
        );
        // ease to a stop under the pointer (so a story can be read and clicked)
        const slow = () =>
          gsap.to(loop, {
            timeScale: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        const go = () =>
          gsap.to(loop, {
            timeScale: 1,
            duration: 0.8,
            ease: "power2.in",
            overwrite: true,
          });
        strip.addEventListener("mouseenter", slow);
        strip.addEventListener("mouseleave", go);

        gsap.fromTo(
          strip,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
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
    <section ref={root} id="news" className="bg-canvas pb-12 pt-20 lg:pb-14 lg:pt-28">
      <div className="container-page">
        <SectionHeading
          title="Latest"
          accent="News & Insights"
          intro="Curated reports from our global editorial desk."
        />

        {/* the stories, in one strip that keeps moving; held to the page width
            with its edges fading out */}
        <div
          data-strip
          className="relative mt-12 overflow-hidden [contain:paint] motion-reduce:overflow-x-auto lg:mt-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-canvas to-transparent sm:w-16"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-canvas to-transparent sm:w-16"
          />
          <ul data-track className="flex w-max py-3 will-change-transform">
            {[...STORIES, ...STORIES].map((s, i) => (
              <StoryCard
                key={`${s.img}-${i}`}
                s={s}
                copy={i >= STORIES.length}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
