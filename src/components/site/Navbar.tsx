"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Phone, X } from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { GlowButton } from "./GlowButton";
import { Logo } from "./Logo";
import { SOCIAL } from "./socials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** sections with a black background: the nav switches to its dark style over them */
const DARK_SECTIONS = ["pathways", "leaders", "toolkit"];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campuses", href: "#campuses" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "FAQs", href: "#faqs" },
  { label: "Admission", href: "#admission" },
];

const SOT = "https://sot.upgrad.com";

type MenuLink = { label: string; href: string; note?: string; tag?: string };
/** a row of the menu: a page of its own, or a group that opens to its links */
type MenuRow = { label: string; href?: string; links?: MenuLink[] };

/**
 * Everything the Menu lists, as on sot.upgrad.com's menu: its top-level links
 * (Home, Admissions, FAQs, IAIB, Catalyst), its two campuses, and the
 * Resource and Help and Support lists under its More. The menu is drawn from
 * this alone. Each row is either a link (`href`) or a group (`links`) that
 * opens under its name to show them — add a link to a group, or a new row,
 * and it takes its place. Admissions and FAQs go to this page's own sections.
 */
const MENU: MenuRow[] = [
  { label: "Home", href: "/" },
  {
    label: "Campuses",
    links: [
      {
        label: "Sri Siddhartha Academy of Higher Education",
        href: `${SOT}/university/ssahe`,
        note: "Tumkuru (Outer Bangalore), Karnataka",
        tag: "NAAC A+",
      },
      {
        label: "Ajeenkya DY Patil University",
        href: `${SOT}/university/adypu`,
        note: "Pune, Maharashtra",
        tag: "NAAC A",
      },
    ],
  },
  { label: "Admissions", href: "#admission" },
  { label: "FAQs", href: "#faqs" },
  { label: "IAIB", href: `${SOT}/events/iaib` },
  { label: "Catalyst", href: `${SOT}/catalyst` },
  {
    label: "Resources",
    links: [
      { label: "AI Playground", href: `${SOT}/Playground` },
      { label: "Ignite AI Buildathon", href: `${SOT}/events/iaib` },
      { label: "uGNET", href: `${SOT}/uGNET` },
      { label: "EDP", href: `${SOT}/edp` },
      { label: "Blogs", href: `${SOT}/blogs` },
    ],
  },
  {
    label: "Help and Support",
    links: [
      { label: "Contact Us", href: `${SOT}/contactus` },
      { label: "Privacy Policy", href: `${SOT}/privacy-policy` },
      { label: "Terms & Conditions", href: `${SOT}/terms-and-conditions` },
      { label: "Admission Policy", href: `${SOT}/terms-and-conditions/admission-policy` },
    ],
  },
];

/**
 * Split floating nav — no full-width bar.
 *
 *  left    the logo on its own, no backing.
 *  centre  a compact link pill with an ink "tab" that slides to whichever link
 *          is hovered (resting on Home).
 *  right   Apply Now (rotating border glow) and a Menu button.
 *
 * The bar stays pinned to the top while scrolling. Over the hero it floats
 * with no backing; once the hero has scrolled away it gains a white bar
 * (blurred, hairline bottom edge) so it never sits on top of section content.
 * Over the dark sections (Pathways, Leaders) it switches to a dark bar (white logo and
 * links, white tab and Menu button), as makro.framer.website does.
 * Menu opens a side panel, after quadcse.com and lusion.co: a white panel
 * the screen's full height slides in from the right edge while the page dims
 * and blurs behind it. In it the MENU rows, large, numbered, between hairlines — each
 * label rolls up to a fresh copy on hover — and a group (Campuses,
 * Resources…) opens under its name in place. At its foot the programme line,
 * Apply Now, the admissions number and the school's social links. The panel
 * scrolls if the list grows past the screen; on phones it leaves a strip of
 * the dimmed page showing at the left. The panel has its own header (logo
 * and Close) and the bar fades away while it is open. Esc, Close or a click
 * on the dimmed page dismisses it; smooth scroll is paused while it is open.
 */
export function Navbar() {
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  /** the menu group opened to show its links (index in MENU), if any */
  const [group, setGroup] = useState<number | null>(null);
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState({ left: 0, width: 0, index: 0 });

  /* ------------------------------------------------ sliding tab in the pill */
  const moveTab = (index: number) => {
    const li = pill.current?.children[index] as HTMLElement | undefined;
    if (li) setTab({ left: li.offsetLeft, width: li.offsetWidth, index });
  };
  useEffect(() => {
    const reset = () => moveTab(0);
    reset();
    document.fonts?.ready.then(reset);
    // the pill is display:none below lg, so re-measure when it appears
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);

  /* ------------------------------------------------ white bar after the hero */
  useEffect(() => {
    const hero = document.querySelector("main > section");
    if (!hero) return;
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=60",
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    });
    return () => trigger.kill();
  }, []);

  /* ------------------------------------------------ dark bar over dark sections */
  // Read from the section's live position on every scroll rather than from
  // precomputed trigger offsets: Pathways changes height when it switches
  // between its pinned and plain layouts, which would leave offsets stale.
  useEffect(() => {
    const check = () => {
      const h = window.innerHeight;
      setDark(
        DARK_SECTIONS.some((id) => {
          const r = document.getElementById(id)?.getBoundingClientRect();
          return !!r && r.top < h * 0.55 && r.bottom > h * 0.45;
        }),
      );
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  /* ------------------------------------------------ side-panel menu */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(q(".menu-root"), { autoAlpha: 1 })
        .fromTo(q(".menu-backdrop"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(q(".menu-panel"), { xPercent: 106 }, { xPercent: 0, duration: 0.85 }, 0)
        .fromTo(
          q(".menu-link"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 },
          0.2,
        )
        .fromTo(
          q(".menu-fade"),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
          0.4,
        );
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) t?.progress(1);
      else t?.timeScale(1).play();
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      t?.timeScale(1.6).reverse();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setGroup(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setGroup(null);
  };

  /** a link inside an opened group: a quiet row, its note and tag under it */
  const subLink = (link: MenuLink) => (
    <Link
      href={link.href}
      onClick={close}
      className="group/sub flex items-start justify-between gap-3 rounded-[6px] px-3 py-2.5 transition-colors duration-300 hover:bg-sunken"
    >
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover/sub:text-accent">
          {link.label}
        </span>
        {link.note && <span className="mt-0.5 block text-[12.5px] text-body">{link.note}</span>}
        {link.tag && (
          <span className="mt-1.5 inline-block rounded-[4px] bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
            {link.tag}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={15}
        aria-hidden
        className="mt-0.5 shrink-0 text-ink/30 transition-all duration-300 group-hover/sub:rotate-45 group-hover/sub:text-accent"
      />
    </Link>
  );

  return (
    <header ref={root}>
      {/* ------------------------------------------------------------ bar */}
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,opacity] duration-500 ${
          open ? "pointer-events-none opacity-0" : ""
        } ${
          !solid || open
            ? "border-transparent bg-transparent"
            : dark
              ? "border-white/10 bg-black/85 backdrop-blur-xl"
              : "border-black/[0.06] bg-white/90 backdrop-blur-xl"
        }`}
      >
        <nav className="container-page flex h-[60px] items-center justify-between gap-4">
          <Logo onDark={dark && !open} />

          <ul
            ref={pill}
            onMouseLeave={() => moveTab(0)}
            className={`relative hidden items-center rounded-[6px] border p-1 backdrop-blur-xl transition-[opacity,background-color,border-color,box-shadow] duration-300 lg:flex ${
              solid ? "border-transparent bg-transparent" : "border-white/70 bg-white/70 shadow-[var(--shadow-sm)]"
            } ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} onMouseEnter={() => moveTab(i)} className="relative z-[1]">
                <Link
                  href={link.href}
                  className={`block whitespace-nowrap rounded-[4px] px-4 py-1.5 text-[14px] font-medium transition-colors duration-300 ${
                    tab.index === i
                      ? dark
                        ? "text-ink"
                        : "text-white"
                      : dark
                        ? "text-white/70 hover:text-white"
                        : "text-body hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* the sliding tab */}
            <span
              aria-hidden
              style={{ left: tab.left, width: tab.width }}
              className={`absolute inset-y-1 rounded-[4px] transition-[left,width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                dark ? "bg-white" : "bg-ink"
              }`}
            />
          </ul>

          <div className="flex items-center gap-2">
            <GlowButton
              href="#apply"
              size="sm"
              streak={dark ? "#fff" : "#0b0d12"}
              className={`transition-opacity duration-300 max-sm:hidden ${open ? "pointer-events-none opacity-0" : ""}`}
            >
              Apply Now
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
            </GlowButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`group inline-flex h-[38px] items-center gap-3 rounded-[6px] pl-4 pr-3.5 text-[13.5px] font-semibold transition-colors ${
                dark && !open ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-white hover:bg-black"
              }`}
            >
              <span className="relative block h-4 overflow-hidden">
                <span
                  className={`block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "-translate-y-4" : "translate-y-0"
                  }`}
                >
                  <span className="block h-4 leading-4">Menu</span>
                  <span className="block h-4 leading-4">Close</span>
                </span>
              </span>
              {/* two bars that cross into an X */}
              <span aria-hidden className="relative block size-3.5">
                <span
                  className={`absolute left-0 h-[1.5px] w-full transition-all ${dark && !open ? "bg-ink" : "bg-white"} duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] transition-all ${dark && !open ? "bg-ink" : "bg-white"} duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open
                      ? "top-1/2 w-full -translate-y-1/2 -rotate-45"
                      : "bottom-[3px] w-2/3 rotate-0 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* ------------------------------------------------------------ panel */}
      <div id="site-menu" aria-hidden={!open} inert={!open} className="menu-root invisible fixed inset-0 z-40">
        {/* the page, dimmed and blurred; a click on it closes the menu */}
        <div
          onClick={close}
          className="menu-backdrop absolute inset-0 bg-ink/30 backdrop-blur-[3px]"
        />

        <div
          data-lenis-prevent
          className="menu-panel absolute inset-y-0 right-0 flex w-[min(420px,86vw)] flex-col overflow-y-auto rounded-l-[6px] bg-white shadow-[var(--shadow-lg)]"
        >
          {/* the panel's own header: the logo, and Close level with the
              panel's padding (the bar fades away while the panel is open) */}
          <div className="flex items-center justify-between px-6 pb-5 pt-5 sm:px-8 sm:pt-6">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="group inline-flex h-[38px] items-center gap-2 rounded-[6px] bg-ink pl-4 pr-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent"
            >
              Close
              <X size={15} strokeWidth={2.2} aria-hidden className="transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>
          <nav aria-label="Site" className="px-6 sm:px-8">
            <ul className="border-t border-ink/10">
              {MENU.map((row, i) => {
                const active = group === i;
                const head = (
                  <>
                    <span className="w-6 shrink-0 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {/* the label rolls up to a fresh copy on hover */}
                    <span className="relative block h-[1.3em] overflow-hidden font-display text-[20px] font-bold leading-[1.3] tracking-[-0.02em] sm:text-[22px] tracking-[-0.03em]">
                      <span
                        className={`block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1/2 ${
                          active ? "text-accent" : "text-ink"
                        }`}
                      >
                        <span className="block">{row.label}</span>
                        <span aria-hidden className="block text-accent">
                          {row.label}
                        </span>
                      </span>
                    </span>
                    {row.links ? (
                      <ArrowRight
                        aria-hidden
                        className={`ml-auto size-4 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          active ? "-rotate-90 text-accent" : "rotate-90 text-ink/30 group-hover:text-accent"
                        }`}
                      />
                    ) : (
                      <ArrowUpRight
                        aria-hidden
                        className="ml-auto size-4 shrink-0 text-ink/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                      />
                    )}
                  </>
                );
                const rowClass = "group flex w-full items-center gap-4 py-3 text-left";
                return (
                  <li key={row.label} className="menu-link border-b border-ink/10">
                    {row.links ? (
                      <button
                        type="button"
                        aria-expanded={active}
                        onClick={() => setGroup(active ? null : i)}
                        className={rowClass}
                      >
                        {head}
                      </button>
                    ) : (
                      <Link href={row.href ?? "/"} onClick={close} className={rowClass}>
                        {head}
                      </Link>
                    )}

                    {/* the group's links, opened under its name */}
                    {row.links && (
                      <div
                        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden" inert={!active}>
                          <ul className="-mx-3 pb-4 pl-10">
                            {row.links.map((link) => (
                              <li key={link.href}>{subLink(link)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* the foot: the programme, Apply Now and the admissions line,
              then the school's channels */}
          <div className="mt-auto px-6 pb-6 pt-8 sm:px-8">
            <div className="menu-fade rounded-[6px] bg-sunken p-4">
              <p className="font-display text-[17px] font-bold leading-tight tracking-[-0.02em] text-ink">
                AI-First B.Tech in <span className="text-accent">Computer Science</span>
              </p>
              <p className="mt-1 text-[13.5px] text-body">Admission starts with uGNET</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <GlowButton href="#apply" streak="#0b0d12" size="sm" onClick={close}>
                  Apply Now
                  <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
                </GlowButton>
                <a
                  href="tel:18002108080"
                  className="inline-flex items-center gap-2 text-[13.5px] text-body transition-colors hover:text-ink"
                >
                  <Phone size={14} aria-hidden />
                  <span className="font-semibold text-ink">1800 210 8080</span>
                </a>
              </div>
            </div>
            <ul className="menu-fade mt-5 flex items-center gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`upGrad School of Technology on ${s.label}`}
                    className="grid size-9 place-items-center rounded-[6px] border border-ink/10 text-ink/70 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
