"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { SOCIAL } from "./socials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Footer
 *
 * Copy and links are sot.upgrad.com's footer, verbatim: "Let's Connect" with
 * its line and "Get in touch", the quick links, the phone numbers and email,
 * the five social profiles, the disclaimer, the copyright and the three legal
 * links.
 *
 * Layout after two Framer references the client supplied. From
 * conclave26.framer.ai: the footer is one full-screen illustration (a Figma AI
 * campus above the clouds in soft morning light, in the hero's style —
 * campus-day.jpg), washed white off the left and along the foot as the hero
 * is, with the closing call in large type on its left, the ways to
 * reach us under it ("Get in touch" carries the hero CTA's sweeping
 * glow), and a thin bar of fine print along the foot. From
 * northtitan.framer.website: the page above lifts away to reveal it — the
 * footer is pinned beneath the page (sticky at the bottom, behind it) so the
 * last section slides up off it like a sheet; on phones too, where a footer
 * taller than the screen is pinned so its top is uncovered first.
 *
 * Motion (GSAP, scrubbed by the scroll): as the footer is uncovered the
 * illustration settles from a slight zoom and brightens, and the words rise
 * in.
 */
const CONTACT = "https://sot.upgrad.com/contactus";

const QUICK_LINKS = [
  { label: "Admissions", href: "https://sot.upgrad.com/admission" },
  { label: "Scholarships", href: "https://sot.upgrad.com/#scholarships" },
  { label: "FAQs", href: "https://sot.upgrad.com/allFAQs" },
  { label: "Contacts", href: CONTACT },
];

const REACH = [
  {
    label: "+91 8296506853",
    href: "https://wa.me/918296506853",
    icon: MessageCircle,
  },
  { label: "1800 210 8080", href: "tel:18002108080", icon: Phone },
  {
    label: "info@upgradsot.com",
    href: "mailto:info@upgradsot.com",
    icon: Mail,
  },
];

const LEGAL = [
  { label: "Privacy Policy", href: "https://sot.upgrad.com/privacy-policy" },
  {
    label: "Terms & Conditions",
    href: "https://sot.upgrad.com/terms-and-conditions",
  },
  {
    label: "Admission Policy",
    href: "https://sot.upgrad.com/terms-and-conditions/admission-policy",
  },
];

const DISCLAIMER =
  "Disclaimer: upGrad School of Technology (uGSOT) is a learning initiative established under its partner university. All academic degrees, approvals, recognitions, and regulatory compliances are solely under the purview of the respective partner university. Placements, internships, scholarships, start-up funding, and all additional opportunities are subject to specific terms, university policies, and applicable eligibility criteria. Access to start-up mentorship and guidance is provided as a value-added service, with any funding or incubation support being discretionary, limited, and subject to evaluation. No outcomes including admissions, internships, funding, placements, or career results are guaranteed, and individual results may vary. Logos displayed represent organizations where upGrad learners, alumni, or SMEs have worked; no endorsement or sponsorship by such companies is implied. Terms and conditions apply.";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [more, setMore] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // phones: the same pinned-beneath reveal, but the footer can be taller
      // than the screen there, and pinned by its bottom edge its top would
      // never show. So it is pinned by its bottom at (screen - its height):
      // when it fits that is 0, the reveal exactly as on desktop; when it is
      // taller it is uncovered from its top and then scrolls on to its foot.
      mm.add("(max-width: 1023px)", () => {
        const el = root.current!;
        const pin = () =>
          el.style.setProperty(
            "--footer-pin",
            `${Math.min(0, window.innerHeight - el.offsetHeight)}px`,
          );
        pin();
        const ro = new ResizeObserver(pin);
        ro.observe(el);
        window.addEventListener("resize", pin);
        return () => {
          ro.disconnect();
          window.removeEventListener("resize", pin);
          el.style.removeProperty("--footer-pin");
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // uncovered as the page above slides off it
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.6,
            },
          })
          .fromTo(
            q("[data-art]"),
            { scale: 1.12, filter: "brightness(0.9)" },
            { scale: 1, filter: "brightness(1)", ease: "none" },
            0,
          )
          .fromTo(
            q("[data-rise]"),
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: "power2.out", stagger: 0.08 },
            0.3,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="site-footer"
      className="sticky bottom-[var(--footer-pin,0px)] z-0 overflow-hidden bg-[#fbf6f1] text-ink lg:bottom-0 lg:h-[100svh] lg:min-h-[640px]"
    >
      {/* the illustration, darkened on the left and along the foot so the
          words read on it */}
      <div data-art aria-hidden className="absolute inset-0">
        <Image
          src="/images/footer/campus-day.jpg"
          alt=""
          fill
          // the footer sits pinned behind the page, so the browser sees it
          // as on screen from the start: fetch it after everything else
          fetchPriority="low"
          sizes="100vw"
          className="object-cover object-[70%_50%]"
        />
      </div>
      {/* the hero's own wash: white fading off the left (from the top on
          phones), and a white fade along the foot under the fine print */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.4)_40%,rgba(255,255,255,0)_60%)] max-lg:bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.45)_35%,rgba(255,255,255,0.82)_55%,rgba(255,255,255,0.9)_100%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_45%,#ffffff_100%)]"
      />

      <div className="container-page relative flex h-full flex-col pb-8 pt-24 lg:pt-28">
        {/* the closing call, large on the left, with how to reach us under it */}
        <div className="flex flex-1 flex-col justify-center">
          <div>
            <h2
              data-rise
              className="font-display text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            >
              Let&rsquo;s{" "}
              <span className="font-[family-name:var(--font-bricolage)] font-semibold text-accent">
                Connect
              </span>
            </h2>
            <p
              data-rise
              className="mt-4 text-[16px] leading-relaxed text-body sm:whitespace-nowrap"
            >
              Have queries? Fill out the enquiry form and our team will reach
              out to you!
            </p>
            <div data-rise className="mt-8">
              {/* with the hero CTA's glow: a dark sliver sweeping round the edge */}
              <a
                href={CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative inline-flex overflow-hidden rounded-[4px] p-[1.5px]"
              >
                <span
                  aria-hidden
                  style={{
                    backgroundImage:
                      "conic-gradient(transparent 200deg, #0b0d12)",
                  }}
                  className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
                />
                <span className="relative z-[2] inline-flex items-center gap-2 rounded-[3px] bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors group-hover/cta:bg-accent-hover">
                  Get in touch
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                    className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                  />
                </span>
              </a>
            </div>
            <div data-rise className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {REACH.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[14.5px] font-medium text-ink transition-colors hover:text-accent"
                >
                  <span className="grid size-8 place-items-center rounded-[6px] bg-accent/10 text-accent">
                    <Icon size={15} strokeWidth={2} aria-hidden />
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* the foot: logo, quick links and profiles; the disclaimer; the
            fine print */}
        <div data-rise className="mt-12">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 md:flex-row md:items-center md:justify-between">
            <Image
              src="/images/logo-sot.png"
              alt="upGrad School of Technology"
              width={467}
              height={144}
              className="h-9 w-auto self-start md:self-auto"
            />
            <nav
              aria-label="Quick links"
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {QUICK_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium text-ink/80 transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-[6px] bg-white text-ink shadow-[0_0_0_1px_rgba(11,13,18,0.08)] transition-colors hover:bg-accent hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                    <path d={s.path} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-body">
            <span className={more ? "block" : "line-clamp-2"}>
              {DISCLAIMER}
            </span>
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              className="mt-1 font-semibold text-ink/80 transition-colors hover:text-accent"
            >
              {more ? "Read less" : "Read more"}
            </button>
          </p>

          <div className="mt-5 flex flex-col gap-3 text-[13px] text-body md:flex-row md:items-center md:justify-between">
            <p>
              &copy; 2026 Techiora Labs Private Limited. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
              {LEGAL.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
