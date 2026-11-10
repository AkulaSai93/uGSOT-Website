"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { GlowButton } from "./GlowButton";
import { Logo } from "./Logo";

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
 * Everything the Menu lists, as on sot.upgrad.com's menu: its two campuses,
 * the Resources and Help and Support lists under More, and the top-level
 * links. The menu is drawn from this alone. Each row is either a link
 * (`href`) or a group (`links`) that opens under its name to show them —
 * add a link to a group, or a new row, and it takes its place.
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
  {
    label: "Resources",
    links: [
      { label: "AI Playground", href: `${SOT}/Playground` },
      { label: "Ignite AI Buildathon", href: `${SOT}/events/iaib` },
      { label: "uGNET", href: `${SOT}/uGNET` },
      { label: "EDP", href: `${SOT}/edp` },
    ],
  },
  { label: "Catalyst", href: `${SOT}/catalyst` },
  {
    label: "Help and Support",
    links: [
      { label: "Admissions", href: "#admission" },
      { label: "FAQs", href: "#faqs" },
      { label: "Blogs", href: `${SOT}/blogs` },
      { label: "Get in Touch", href: `${SOT}/contactus` },
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
 * Menu opens a full-screen sheet: it wipes down from the top and the MENU
 * rows rise in one by one, numbered. Beside them, a pane the same height as
 * the list: the campus image, Apply Now, Get in Touch and the admissions
 * number — or, while a group row is hovered or clicked (desktop), that
 * group's links as cards, swapped in place so the layout never shifts. Below
 * lg a group opens under its name instead. The sheet scrolls if the list
 * grows past the screen.
 * Esc or Close dismisses it; smooth scroll is paused while it is open.
 */
export function Navbar() {
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  /** the menu's picture is only fetched once the menu is first opened */
  const [menuSeen, setMenuSeen] = useState(false);
  if (open && !menuSeen) setMenuSeen(true);
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

  const close = () => {
    setOpen(false);
    setGroup(null);
  };
  const openGroup = group === null ? null : MENU[group];

  /** a link inside a group: a small card (bigger when the group has few) */
  const subLink = (link: MenuLink, big = false) => (
    <Link
      href={link.href}
      onClick={close}
      className={`group/sub flex items-start justify-between gap-3 rounded-[6px] border border-ink/10 bg-white transition-colors duration-300 hover:border-ink ${
        big ? "p-5" : "px-4 py-3"
      }`}
    >
      <span className="min-w-0">
        <span className={`block font-semibold leading-snug text-ink transition-colors duration-300 group-hover/sub:text-accent ${big ? "text-[17px]" : "text-[15px]"}`}>
          {link.label}
        </span>
        {link.note && <span className="mt-1 block text-[13px] text-body">{link.note}</span>}
        {link.tag && (
          <span className="mt-2.5 inline-block rounded-[4px] bg-accent px-1.5 py-0.5 text-[10.5px] font-bold text-white">
            {link.tag}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={16}
        aria-hidden
        className="mt-0.5 shrink-0 text-ink/30 transition-all duration-300 group-hover/sub:rotate-45 group-hover/sub:text-accent"
      />
    </Link>
  );

  return (
    <header ref={root}>
      {/* ------------------------------------------------------------ bar */}
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
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
            <GlowButton href="#apply" size="sm" streak={dark ? "#fff" : "#0b0d12"} className="max-sm:hidden">
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

      {/* ------------------------------------------------------------ sheet */}
      <div
        id="site-menu"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className="menu-sheet invisible fixed inset-0 z-40 overflow-y-auto bg-[#ffffff]"
      >
        <div className="container-page grid min-h-full content-center gap-10 pb-10 pt-[100px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-stretch lg:gap-16 lg:pb-12">
          {/* left: the rows. On desktop a group shows its links in the pane
              on the right (on hover or click); below lg it opens in place. */}
          <nav aria-label="Site">
            <ul className="border-t border-ink/10">
              {MENU.map((row, i) => {
                const active = group === i;
                const head = (
                  <>
                    <span className="w-7 shrink-0 font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.03em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 ${
                        active ? "translate-x-2 text-accent" : "text-ink"
                      }`}
                    >
                      {row.label}
                    </span>
                    {row.links ? (
                      <ArrowRight
                        aria-hidden
                        className={`ml-auto size-5 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          active
                            ? "text-accent max-lg:-rotate-90 lg:translate-x-1"
                            : "text-ink/30 group-hover:text-accent max-lg:rotate-90"
                        }`}
                      />
                    ) : (
                      <ArrowUpRight
                        aria-hidden
                        className="ml-auto size-5 shrink-0 text-ink/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                      />
                    )}
                  </>
                );
                const rowClass = "menu-link group flex w-full items-center gap-4 py-5 text-left sm:gap-6";
                return (
                  <li
                    key={row.label}
                    className="border-b border-ink/10"
                    onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setGroup(row.links ? i : null)}
                  >
                    <div className="overflow-hidden">
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
                    </div>

                    {/* below lg: the group's links, opened under its name */}
                    {row.links && (
                      <div
                        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden" inert={!active}>
                          <ul className="grid gap-2 pb-5 sm:grid-cols-2">
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

          {/* right: the programme card, or on desktop the open group's links
              in its place — the same box either way, so nothing shifts */}
          <div className="menu-fade relative">
            {openGroup?.links ? (
              <div key={openGroup.label} className="flex h-full flex-col rounded-[6px] bg-sunken p-6 max-lg:hidden">
                <p className="animate-rise font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-ink">
                  {openGroup.label}
                </p>
                {/* the cards share the pane's height, so a short list fills it
                    and a long one shrinks to fit (scrolling past a point) */}
                <ul
                  className={`mt-5 grid min-h-0 flex-1 auto-rows-[minmax(64px,1fr)] gap-2 overflow-y-auto ${
                    openGroup.links.length > 2 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {openGroup.links.map((link, k) => (
                    <li key={link.href} className="animate-rise [&>a]:h-full" style={{ animationDelay: `${60 + k * 45}ms` }}>
                      {subLink(link, openGroup.links!.length <= 2)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <aside className={`flex h-full flex-col gap-5 ${openGroup?.links ? "lg:hidden" : ""}`}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] lg:aspect-auto lg:min-h-[200px] lg:flex-1">
                {menuSeen && (
                  <Image
                    src="/images/hero/hero-campus.png"
                    alt="Students looking out at the upGrad School of Technology campus"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-[85%_80%]"
                  />
                )}
              </div>
              <div>
                <p className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-ink">
                  AI-First B.Tech in <span className="text-accent">Computer Science</span>
                </p>
                <p className="mt-1.5 text-[14px] text-body">Admission starts with uGNET</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
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
                  className="inline-flex items-center gap-2 text-[14px] text-body transition-colors hover:text-ink"
                >
                  <Phone size={14} aria-hidden />
                  <span className="font-semibold text-ink">1800 210 8080</span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </header>
  );
}
