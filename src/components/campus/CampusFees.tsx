"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { Campus } from "./campuses";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Program Fee Structure — the university page's fee table and its hostel
 * tables, every figure and line as published there, laid out with less
 * clutter than the page's eight-column grid of dashes.
 *
 * Layout (after newtonschool.co's programme pages): on white, the heading
 * and its line, centred. On desktop one plain table: the fee components down
 * the side, the eight semesters across, a dash where a component doesn't
 * apply, and the total in a bold last row. On phones the same as a semester
 * at a time (the first open), its components and its total. Then Hostel & Accommodation, folded away
 * behind one row: opened, a Boys / Girls switch, a card per room (non-AC and
 * AC fee a year, where, the washroom), what the fee includes, laundry, the
 * common facilities and the note.
 *
 * Motion (GSAP): the table (or the semesters) rises in; the hostel row opens by
 * height. Reduced motion: shown as they are, the row opens at once.
 */
export function CampusFees({ campus }: { campus: Campus }) {
  const root = useRef<HTMLElement>(null);
  const [hostelOpen, setHostelOpen] = useState(false);
  const [group, setGroup] = useState(0);
  const { fees, hostel } = campus;
  /** the semester open on phones (the first to start) */
  const [openSem, setOpenSem] = useState<number | null>(0);
  /** every fee component, in the order the semesters list them */
  const components = [
    ...new Set(fees.semesters.flatMap((s) => s.items.map((it) => it.label))),
  ];
  const amountOf = (s: Campus["fees"]["semesters"][number], label: string) =>
    s.items.find((it) => it.label === label)?.amount;
  const g = hostel.groups[group];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-fee-rise]",
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: "[data-fee-cards]",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // the hostel panel opens and closes by height
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.to("[data-hostel-body]", {
        height: hostelOpen ? "auto" : 0,
        duration: reduce ? 0 : 0.6,
        ease: "expo.out",
        overwrite: true,
      });
    },
    { scope: root, dependencies: [hostelOpen] },
  );

  return (
    <section ref={root} id="fees" className="bg-canvas py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title="Program Fee"
          accent="Structure"
          intro={fees.intro}
        />

        {/* desktop: one table, the components down the side and the
            semesters across, the total in the last row */}
        <div
          data-fee-cards
          data-fee-rise
          className="mt-8 hidden overflow-hidden rounded-[6px] border border-ink/10 lg:mt-12 lg:block"
        >
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-[#f6f7f9] text-left">
                <th scope="col" className="px-5 py-4 font-semibold text-ink">
                  Fee Components
                </th>
                {fees.semesters.map((s) => (
                  <th
                    key={s.sem}
                    scope="col"
                    className="border-l border-ink/10 px-5 py-4 font-semibold text-ink"
                  >
                    Semester {s.sem}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {components.map((c) => (
                <tr key={c} className="border-t border-ink/10">
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-medium text-body"
                  >
                    {c}
                  </th>
                  {fees.semesters.map((s) => (
                    <td
                      key={s.sem}
                      className="border-l border-ink/10 px-5 py-4 tabular-nums text-body"
                    >
                      {amountOf(s, c) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-ink/10 text-ink">
                <th
                  scope="row"
                  className="px-5 py-4 text-left font-bold uppercase tracking-[0.04em]"
                >
                  Total
                </th>
                {fees.semesters.map((s) => (
                  <td
                    key={s.sem}
                    className="border-l border-ink/10 px-5 py-4 font-bold tabular-nums"
                  >
                    {s.total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* phones: a semester at a time, the first open */}
        <ul data-fee-rise className="mt-8 space-y-3 lg:hidden">
          {fees.semesters.map((s, i) => {
            const isOpen = openSem === i;
            return (
              <li
                key={s.sem}
                className="overflow-hidden rounded-[6px] border border-ink/10"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSem(isOpen ? null : i)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left ${isOpen ? "bg-[#f6f7f9]" : "bg-white"}`}
                >
                  <span className="font-display text-[16px] font-bold text-ink">
                    Semester {s.sem}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-ink">
                      {s.total}
                    </span>
                    <ChevronDown
                      size={18}
                      aria-hidden
                      className={`text-ink transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <dl className="text-[14px]">
                    {s.items.map((it) => (
                      <div
                        key={it.label}
                        className="flex justify-between gap-4 border-t border-ink/10 px-4 py-3"
                      >
                        <dt className="text-body">{it.label}</dt>
                        <dd className="tabular-nums text-body">{it.amount}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 border-t border-ink/10 px-4 py-3 font-bold text-ink">
                      <dt className="uppercase tracking-[0.04em]">Total</dt>
                      <dd className="font-display">{s.total}</dd>
                    </div>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>

        {/* hostel & accommodation, folded away */}
        <div
          data-fee-rise
          className="mt-4 rounded-[6px] bg-accent text-white lg:mt-5"
        >
          <h3>
            <button
              type="button"
              aria-expanded={hostelOpen}
              aria-controls="hostel-body"
              onClick={() => setHostelOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left sm:px-6 sm:py-4"
            >
              <span>
                <span className="block font-display text-[clamp(1rem,1.3vw,1.125rem)] font-bold tracking-[-0.02em] text-white">
                  {hostel.title}
                </span>
                <span className="mt-0.5 block text-[12px] text-white/80 sm:text-[13px]">
                  {hostel.lead}
                </span>
              </span>
              <span
                aria-hidden
                className={`grid size-8 shrink-0 place-items-center rounded-[6px] transition-[transform,background-color,color] duration-300 ${
                  hostelOpen
                    ? "rotate-180 bg-ink text-white"
                    : "bg-white text-ink"
                }`}
              >
                <ChevronDown size={18} />
              </span>
            </button>
          </h3>

          <div
            id="hostel-body"
            data-hostel-body
            className="h-0 overflow-hidden"
          >
            <div className="border-t border-white/20 p-5 sm:p-6">
              {/* boys / girls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Hostel"
                  className="flex gap-1 rounded-[6px] bg-white p-1"
                >
                  {hostel.groups.map((h, i) => (
                    <button
                      key={h.name}
                      type="button"
                      role="tab"
                      aria-selected={i === group}
                      onClick={() => setGroup(i)}
                      className={`rounded-[6px] px-4 py-2 text-[14px] font-semibold transition-colors duration-300 ${
                        i === group
                          ? "bg-ink text-white"
                          : "text-body hover:text-ink"
                      }`}
                    >
                      Accommodation for {h.name}
                    </button>
                  ))}
                </div>
                <span className="text-[13px] text-white/75">{g.basis}</span>
              </div>

              {/* a card per room */}
              <ul
                role="tabpanel"
                className={`mt-5 grid gap-3 sm:grid-cols-2 ${g.rooms.length > 2 ? "lg:grid-cols-3" : ""}`}
              >
                {g.rooms.map((r) => (
                  <li
                    key={r.occupancy}
                    className="rounded-[6px] border border-ink/10 bg-white p-5"
                  >
                    <p className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
                      {r.occupancy}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-[12px] text-muted">
                          Non-AC / year
                        </dt>
                        <dd className="mt-0.5 font-display text-[18px] font-bold text-ink">
                          {r.nonAc}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[12px] text-muted">AC / year</dt>
                        <dd className="mt-0.5 font-display text-[18px] font-bold text-accent">
                          {r.ac}
                        </dd>
                      </div>
                    </dl>
                    {r.acNote && (
                      <p className="mt-2 text-[12px] text-body">{r.acNote}</p>
                    )}
                    <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-[13px]">
                      {r.location && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted">Location</dt>
                          <dd className="text-right text-ink">{r.location}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Washroom</dt>
                        <dd className="text-right text-ink">{r.washroom}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Facts title="Included in the annual fee" items={g.included} />
                <div>
                  <h4 className="text-[14px] font-bold text-white">
                    {hostel.laundry.title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/85">
                    {hostel.laundry.free}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/85">
                    {hostel.laundry.paid}
                  </p>
                </div>
                <div className="space-y-5">
                  {hostel.common.map((c) => (
                    <Facts key={c.title} title={c.title} items={c.items} />
                  ))}
                </div>
              </div>

              <p className="mt-6 border-t border-white/20 pt-4 text-[12px] leading-relaxed text-white/75">
                {hostel.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** a short list with checks, in white on the red panel */
function Facts({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[14px] font-bold text-white">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex gap-2 text-[13px] leading-snug text-white/85"
          >
            <Check
              size={14}
              strokeWidth={2.6}
              aria-hidden
              className="mt-0.5 shrink-0 text-white"
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
