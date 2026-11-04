"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

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
 * northtitan.framer.website: the page above lifts away to reveal it — on
 * desktop the footer is pinned beneath the page (sticky at the bottom, behind
 * it) so the last section slides up off it like a sheet.
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

/** the five profiles, each as a small brand mark drawn in currentColor */
const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/upgrad-school-of-technology",
    path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-7.1c0-1.7-.03-3.88-2.36-3.88-2.36 0-2.72 1.84-2.72 3.75V23h-4V8z",
  },
  {
    label: "X",
    href: "https://x.com/uGSOT",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61584595769199",
    path: "M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/upgrad_schooloftech/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@upGradSchoolofTechnology",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
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
      className="relative overflow-hidden bg-[#fbf6f1] text-ink lg:sticky lg:bottom-0 lg:z-0 lg:h-[100svh] lg:min-h-[640px]"
    >
      {/* the illustration, darkened on the left and along the foot so the
          words read on it */}
      <div data-art aria-hidden className="absolute inset-0">
        <Image
          src="/images/footer/campus-day.jpg"
          alt=""
          fill
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
