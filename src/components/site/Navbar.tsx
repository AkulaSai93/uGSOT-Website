"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { GlowButton } from "./GlowButton";
import { Logo } from "./Logo";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campuses", href: "#campuses" },
  { label: "More", href: "#more" },
  { label: "FAQs", href: "#faqs" },
  { label: "Admission", href: "#admission" },
];

/**
 * Split floating nav — no full-width bar.
 *
 *  left    the logo on its own, no backing.
 *  centre  a compact link pill with an ink "tab" that slides to whichever link
 *          is hovered (resting on Home).
 *  right   Apply Now (rotating border glow) and a Menu button.
 *
 * The bar stays pinned to the top while scrolling.
 * Menu opens a full-screen sheet: it wipes down from the top, big links rise
 * in one by one, with the campus image and admissions contact alongside.
 * Esc or Close dismisses it; smooth scroll is paused while it is open.
 */
export function Navbar() {
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState({ left: 0, width: 0, index: 0 });

  /* ------------------------------------------------ sliding tab in the pill */
  const moveTab = (index: number) => {
    const li = pill.current?.children[index] as HTMLElement | undefined;
    if (li) setTab({ left: li.offsetLeft, width: li.offsetWidth, index });
  };
  useEffect(() => {
    moveTab(0);
    document.fonts?.ready.then(() => moveTab(0));
  }, []);

  /* ------------------------------------------------ full-screen menu */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(q(".menu-sheet"), { autoAlpha: 1 })
        .fromTo(
          q(".menu-sheet"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
        )
        .fromTo(
          q(".menu-link"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.06 },
          0.45,
        )
        .fromTo(
          q(".menu-fade"),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.6,
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={root}>
      {/* ------------------------------------------------------------ bar */}
      <div className="fixed inset-x-0 top-0 z-50">
        <nav className="container-page flex h-[76px] items-center justify-between gap-4 pt-3">
          <Logo />

          <ul
            ref={pill}
            onMouseLeave={() => moveTab(0)}
            className={`relative hidden items-center rounded-[6px] border border-white/70 bg-white/70 p-1 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-opacity duration-300 lg:flex ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} onMouseEnter={() => moveTab(i)} className="relative z-[1]">
                <Link
                  href={link.href}
                  className={`block whitespace-nowrap rounded-[4px] px-4 py-2 text-[14px] font-medium transition-colors duration-300 ${
                    tab.index === i ? "text-white" : "text-body hover:text-ink"
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
              className="absolute inset-y-1 rounded-[4px] bg-ink transition-[left,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </ul>

          <div className="flex items-center gap-2">
            <GlowButton href="#apply" size="sm" streak="#0b0d12" className="max-sm:hidden">
              Apply Now
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
            </GlowButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group inline-flex h-[42px] items-center gap-3 rounded-[6px] bg-ink pl-4 pr-3.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
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
                  className={`absolute left-0 h-[1.5px] w-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

      {/* ------------------------------------------------------------ sheet */}
      <div
        id="site-menu"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className="menu-sheet invisible fixed inset-0 z-40 overflow-y-auto bg-[#fbf8f5]"
      >
        <div className="container-page grid min-h-full gap-10 pb-10 pt-[112px] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-14">
          <nav aria-label="Site">
            <p className="menu-fade text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Navigate
            </p>
            <ul className="group/list mt-5">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden border-b border-ink/10">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="menu-link group flex items-baseline gap-4 py-2 transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100 sm:gap-6"
                  >
                    <span className="w-6 font-mono text-[12px] text-accent">0{i + 1}</span>
                    <span className="font-display text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="ml-auto size-7 self-center text-accent opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <aside className="flex flex-col gap-6">
            <div className="menu-fade relative aspect-[16/10] overflow-hidden rounded-[6px]">
              <Image
                src="/images/hero/hero-campus.png"
                alt="Students looking out at the upGrad School of Technology campus"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[85%_80%]"
              />
            </div>
            <div className="menu-fade">
              <p className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-ink">
                AI-First B.Tech in <span className="text-accent">Computer Science</span>
              </p>
              <p className="mt-1.5 text-[14px] text-body">Admission starts with uGNET</p>
            </div>
            <div className="menu-fade flex flex-wrap items-center gap-3">
              <GlowButton href="#apply" streak="#0b0d12" onClick={close}>
                Apply Now
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </GlowButton>
              <Link
                href="#visit"
                onClick={close}
                className="inline-flex items-center rounded-[6px] border border-ink/25 px-6 py-[14.5px] text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                Get in Touch
              </Link>
            </div>
            <a
              href="tel:18002108080"
              className="menu-fade inline-flex items-center gap-2 text-[14px] text-body transition-colors hover:text-ink"
            >
              <Phone size={14} aria-hidden />
              Admissions: <span className="font-semibold text-ink">1800 210 8080</span>
            </a>
          </aside>
        </div>
      </div>
    </header>
  );
}
