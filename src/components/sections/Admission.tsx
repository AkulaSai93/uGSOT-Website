"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Admission Process"
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line, the five steps,
 * the "Check Eligibility" link (to the uGNET page, as there) and the
 * scholarship note with "Resume Application".
 *
 * Layout after a reference the client supplied: the centred heading, then on
 * the left the five steps down a timeline (a dot with a soft halo, the step,
 * its title and line), and on the right the scholarship note as a bold red
 * card with a black border, its button a full-width white bar with the
 * hero CTA's sweeping glow round its edge. The card stays in view
 * beside the steps on desktop; on phones it follows them.
 *
 * Motion (GSAP): as the steps scroll through the screen the red line fills
 * down the track (scrubbed) and each dot turns red as the line reaches it;
 * the steps rise in one after another and the card rises in. The button
 * glow sweeps round the button all the time, as on the hero's.
 */
const UGNET = "https://sot.upgrad.com/uGNET";
/** where "Resume Application" goes; the uGNET page until a direct link is supplied */
const RESUME_HREF = UGNET;

const STEPS = [
  {
    title: "Apply for the uGNET Exam",
    body: "Submit your application to secure a chance to appear for the entrance assessment.",
    link: { label: "Check Eligibility", href: UGNET },
  },
  {
    title: "Appear for the Exam",
    body: "Take the uGSOT exam to demonstrate your aptitude and readiness for the program.",
  },
  {
    title: "Personal Interview",
    body: "Showcase your skills, passion, and potential in a one-on-one discussion with our admission panel.",
  },
  {
    title: "Counselling Session",
    body: "Receive guidance on program selection, career pathways, and tailored learning opportunities.",
  },
  {
    title: "Block Your Seat",
    body: "Confirm your admission and reserve your spot in the program to kickstart your tech journey.",
  },
] as const;

export function Admission() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLSpanElement>(null);

  // the track runs from the first dot's centre to the last one's: its foot is
  // lifted by the height of the last step less half a dot
  useEffect(() => {
    const list = track.current?.parentElement;
    const last = list?.lastElementChild as HTMLElement | null;
    if (!track.current || !last) return;
    const fit = () => {
      if (track.current)
        track.current.style.bottom = `${last.offsetHeight - 16}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(last);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const list = q("[data-steps]")[0];
      const dots = q("[data-dot]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-step]"),
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: {
              trigger: list,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
        gsap.fromTo(
          q("[data-cta]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: q("[data-cta]")[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        // the red line fills down the track as the steps pass through the
        // screen; each dot lights up once the line has reached it
        gsap.fromTo(
          q("[data-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.6,
              onUpdate: (self) => {
                dots.forEach((d, i) =>
                  d.toggleAttribute(
                    "data-on",
                    self.progress >= i / (dots.length - 1) - 0.001,
                  ),
                );
              },
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="admission" className="bg-canvas py-8 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Admission"
          accent="Process"
          intro="A simple, transparent journey from application to admission."
        />

        <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          {/* left: the steps down a timeline */}
          <ol data-steps className="relative flex flex-col gap-10">
            {/* the track and its red fill, through the dots' centres */}
            <span
              ref={track}
              aria-hidden
              className="absolute left-[15px] top-4 w-px bg-ink/10"
            >
              <span
                data-fill
                className="absolute inset-0 origin-top bg-accent"
              />
            </span>

            {STEPS.map((step, i) => (
              <li key={step.title} data-step className="relative pl-14">
                {/* a dot with a soft halo; both turn red once reached */}
                <span
                  data-dot
                  aria-hidden
                  className="group/dot absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-ink/[0.06] transition-colors duration-500 data-[on]:bg-accent/15"
                >
                  <span className="size-3.5 rounded-full bg-ink/25 transition-colors duration-500 group-data-[on]/dot:bg-accent" />
                </span>
                <p className="font-[family-name:var(--font-bricolage)] text-[13px] font-semibold text-accent">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-body">
                  {step.body}
                </p>
                {"link" in step && (
                  <a
                    href={step.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent"
                  >
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/link:bg-[length:100%_1px]">
                      {step.link.label}
                    </span>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2}
                      aria-hidden
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                )}
              </li>
            ))}
          </ol>

          {/* right: the scholarship note as a bold card; it stays in view
              beside the steps on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              data-cta
              className="rounded-[6px] border-2 border-ink bg-accent p-7 text-white sm:p-9"
            >
              <h3 className="font-display text-[clamp(1.5rem,2.3vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                Study Without Limits: Up to 100% Scholarships
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                We&rsquo;ve set aside ₹7 Cr+ in scholarships and eligible
                students can have up to 100% of tuition covered. Continue
                registration, complete payment, and book your exam slot.
              </p>
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative mt-10 flex w-full overflow-hidden rounded-[6px] p-[2px]"
              >
                {/* the hero CTA's glow: a dark sliver sweeping round the edge */}
                <span
                  aria-hidden
                  style={{
                    backgroundImage:
                      "conic-gradient(transparent 200deg, #0b0d12)",
                  }}
                  className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
                />
                <span className="relative z-[2] flex w-full items-center justify-center gap-2 rounded-[4px] bg-white px-6 py-4 text-[16px] font-semibold text-ink transition-colors duration-200 group-hover/cta:bg-white/90">
                  Resume Application
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2}
                    aria-hidden
                    className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
