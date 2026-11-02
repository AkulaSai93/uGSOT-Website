"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/**
 * "Campuses"
 *
 * Copy, photos and links from sot.upgrad.com (the two partner universities,
 * their NAAC grades, locations and "Explore" pages), verbatim.
 *
 * Layout after the campus tour on scaler.com/school-of-technology: one large
 * stage with a glass tab switch floating at its top centre. Here each tab is a
 * campus. The photo carries a black fade along its bottom edge only, and the
 * details sit on it in white: "In collaboration with", the university's
 * name and location on the left, and on the right the Explore button wearing
 * its NAAC grade as a red tab on its top edge (flared, inward-curved
 * shoulders, like a folder tab).
 *
 * Switching is GSAP: the incoming photo wipes in from the right (clip-path)
 * while settling from a slight zoom, then the details below rise in line by
 * line. The tab highlight slides between the two options.
 */
const CAMPUSES = [
  {
    key: "ssahe",
    name: "Sri Siddhartha Academy of Higher Education",
    tab: "Tumkuru",
    region: "Karnataka",
    location: "Tumkuru (Outer Bangalore), Karnataka",
    naac: "NAAC A+ Accredited",
    href: "https://sot.upgrad.com/university/ssahe",
  },
  {
    key: "adypu",
    name: "Ajeenkya DY Patil University",
    tab: "Pune",
    region: "Maharashtra",
    location: "Pune, Maharashtra",
    naac: "NAAC A Accredited",
    href: "https://sot.upgrad.com/university/adypu",
  },
] as const;

/** radius of the tab's top corners and of its flared shoulders */
const SHOULDER = 8;
const TAB_RED = "#e4002b";

/**
 * Explore button with the NAAC grade sitting on its top edge as a red tab.
 * The shoulders are two small squares filled red except for a quarter
 * circle, so the tab flares into the button's top edge like a folder tab.
 * The button sits one layer above the tab and overlaps it by 1px, so the
 * join is clean with no hairline of red along the white edge.
 */
function ExploreButton({ campus }: { campus: (typeof CAMPUSES)[number] }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="relative z-[1] -mb-px px-4 pb-1.5 pt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white"
        style={{ background: TAB_RED, borderRadius: `${SHOULDER}px ${SHOULDER}px 0 0` }}
      >
        {/* flared shoulders */}
        <span
          aria-hidden
          className="absolute bottom-0"
          style={{
            left: -SHOULDER,
            width: SHOULDER,
            height: SHOULDER,
            background: `radial-gradient(circle at 0 0, transparent ${SHOULDER - 0.5}px, ${TAB_RED} ${SHOULDER}px)`,
          }}
        />
        <span
          aria-hidden
          className="absolute bottom-0"
          style={{
            right: -SHOULDER,
            width: SHOULDER,
            height: SHOULDER,
            background: `radial-gradient(circle at 100% 0, transparent ${SHOULDER - 0.5}px, ${TAB_RED} ${SHOULDER}px)`,
          }}
        />
        {campus.naac}
      </span>
      <Link
        href={campus.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative z-[2] inline-flex w-full min-w-[212px] items-center justify-center gap-2 rounded-[6px] bg-white px-6 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:text-accent"
      >
        Explore campus
        <ArrowUpRight
          size={16}
          strokeWidth={2}
          aria-hidden
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}

export function Campuses() {
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState({ left: 0, width: 0 });
  const first = useRef(true);
  const switchTl = useRef<gsap.core.Timeline | null>(null);

  // sliding tab highlight
  useEffect(() => {
    const place = () => {
      const btn = tabs.current?.children[active + 1] as HTMLElement | undefined;
      if (btn) setTab({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", wrap.current);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const incoming = slides[active];

      slides.forEach((s, i) => gsap.set(s, { zIndex: i === active ? 2 : 1 }));

      // A switch made while the previous wipe is still running must cancel it:
      // otherwise that wipe's onComplete would hide the photo just chosen and
      // leave the stage empty.
      switchTl.current?.kill();

      if (first.current || reduced) {
        first.current = false;
        slides.forEach((s, i) => gsap.set(s, { autoAlpha: i === active ? 1 : 0, clipPath: "inset(0% 0% 0% 0%)" }));
        return;
      }

      switchTl.current = gsap
        .timeline({
          defaults: { ease: "expo.inOut" },
          // only the latest switch can finish (earlier ones are killed above),
          // so `active` here is always the campus on screen
          onComplete: () => slides.forEach((s, i) => i !== active && gsap.set(s, { autoAlpha: 0 })),
        })
        .set(incoming, { autoAlpha: 1 })
        .fromTo(incoming, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 })
        .fromTo(incoming.querySelector("[data-photo]"), { scale: 1.15 }, { scale: 1, duration: 1.5, ease: "expo.out" }, 0)
        .fromTo(
          gsap.utils.toArray("[data-line]", wrap.current),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: "expo.out" },
          0.35,
        );
    },
    { dependencies: [active], scope: wrap },
  );

  const c = CAMPUSES[active];

  return (
    <section id="campuses" className="bg-canvas py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Our"
          accent="Campuses"
          intro={
            <>
              uGSOT is collaborating with cutting-edge university campuses across India,
              <br className="hidden sm:block" /> giving students world-class learning spaces
              right where innovation thrives
            </>
          }
        />

        <Reveal className="mt-14">
          <div ref={wrap}>
            <div className="relative h-[clamp(560px,72vh,680px)] overflow-hidden rounded-[6px] bg-sunken">
              {CAMPUSES.map((campus, i) => (
                <div
                  key={campus.key}
                  data-slide
                  aria-hidden={i !== active}
                  className={`absolute inset-0 ${i === active ? "" : "invisible"}`}
                >
                  <div data-photo className="absolute inset-0">
                    <Image
                      src={`/images/campuses/${campus.key}.webp`}
                      alt={campus.name}
                      fill
                      sizes="(min-width: 1280px) 1232px, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                </div>
              ))}

              {/* glass tab switch, top centre (Scaler's campus-tour tabs) */}
              <div
                ref={tabs}
                role="tablist"
                aria-label="Campuses"
                className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center rounded-[6px] border border-white/20 bg-black/35 p-1 backdrop-blur-md sm:top-6"
              >
                <span
                  aria-hidden
                  style={{ left: tab.left, width: tab.width }}
                  className="absolute inset-y-1 rounded-[4px] bg-white transition-[left,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                {CAMPUSES.map((campus, i) => (
                  <button
                    key={campus.key}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={`relative z-[1] whitespace-nowrap rounded-[4px] px-4 py-2 text-[13.5px] font-semibold transition-colors duration-300 sm:px-5 ${
                      i === active ? "text-ink" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {campus.tab}
                    <span className="hidden sm:inline">
                      {" "}
                      &middot; {campus.region}
                    </span>
                  </button>
                ))}
              </div>
              {/* black fade along the bottom of the photo, under the details */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[60%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.85)_100%)]"
              />
              {/* details, white type straight on the photo's dark lower edge */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                <div className="max-w-[720px]">
                  <p data-line className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    In collaboration with
                  </p>
                  <h3
                    data-line
                    className="mt-2 font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white"
                  >
                    {c.name}
                  </h3>
                  <p data-line className="mt-2.5 inline-flex items-center gap-2 text-[15px] text-white/85">
                    <MapPin size={16} strokeWidth={2} aria-hidden />
                    {c.location}
                  </p>
                </div>
                <div data-line className="shrink-0">
                  <ExploreButton campus={c} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
