"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LOANS } from "./loans";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Third Party Credit Facility Providers — the education-loan lenders and
 * their terms, as sot.upgrad.com's university pages give them (see loans.ts).
 *
 * Layout: the heading and its line, centred. Then the lenders as one
 * horizontal bar, a tab each with its logo and name (a swipeable row on
 * phones); the chosen one is outlined in ink. Under it that lender's terms in
 * the fee table's plain style: a cool grey header (Loan Type and its loan
 * types), a row per term, a value spanning the columns where one holds for
 * every type. On phones the terms stack, each value under its loan type.
 * Then the five notes, small, in a numbered list.
 *
 * Motion (GSAP): the bar and the table rise in; switching lenders fades the
 * terms in. Reduced motion: shown as they are.
 */
export function CampusLoans() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const lender = LOANS.lenders[active];
  const first = useRef(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-loan-rise]",
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: "[data-loan-bar]",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // the chosen lender's terms fade in on a switch
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-loan-terms]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
      );
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} id="loans" className="bg-canvas py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title="Third Party Credit"
          accent="Facility Providers"
          intro={LOANS.intro}
        />

        {/* the lenders, one horizontal bar */}
        <div
          data-loan-bar
          data-loan-rise
          role="tablist"
          aria-label="Our Financial Partners"
          className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] max-sm:-mx-5 max-sm:px-5 sm:grid sm:grid-cols-4 lg:mt-12"
        >
          {LOANS.lenders.map((l, i) => {
            const on = i === active;
            return (
              <button
                key={l.name}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="loan-terms"
                onClick={() => setActive(i)}
                className={`flex min-w-[150px] shrink-0 snap-start items-center gap-3 rounded-[6px] border bg-white px-4 py-3.5 text-left transition-colors duration-300 sm:min-w-0 ${
                  on
                    ? "border-ink ring-1 ring-ink"
                    : "border-ink/10 hover:border-ink/30"
                }`}
              >
                <span className="relative h-8 w-10 shrink-0">
                  <Image
                    src={l.logo}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
                <span
                  className={`text-[14px] font-semibold ${on ? "text-ink" : "text-body"}`}
                >
                  {l.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* the chosen lender's terms */}
        <div
          id="loan-terms"
          role="tabpanel"
          aria-label={lender.name}
          data-loan-rise
          className="mt-4 lg:mt-5"
        >
          <div data-loan-terms>
            {/* tablet and up: a table */}
            <div className="hidden overflow-hidden rounded-[6px] border border-ink/10 sm:block">
              <table className="w-full table-fixed text-[14px]">
                <thead>
                  <tr className="bg-[#f6f7f9] text-left">
                    <th
                      scope="col"
                      className="w-[32%] px-5 py-4 font-semibold text-ink"
                    >
                      Loan Type
                    </th>
                    {lender.columns.map((c) => (
                      <th
                        key={c}
                        scope="col"
                        className="border-l border-ink/10 px-5 py-4 font-semibold text-ink"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lender.rows.map((r) => (
                    <tr
                      key={r.label}
                      className="border-t border-ink/10 align-top"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-left font-medium text-ink"
                      >
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td
                          key={i}
                          colSpan={
                            r.values.length === 1 ? lender.columns.length : 1
                          }
                          className="border-l border-ink/10 px-5 py-4 leading-relaxed text-body"
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* phones: each term, its values under their loan type */}
            <dl className="divide-y divide-ink/10 overflow-hidden rounded-[6px] border border-ink/10 sm:hidden">
              {lender.rows.map((r) => (
                <div key={r.label} className="px-4 py-3.5">
                  <dt className="text-[13px] font-semibold text-ink">
                    {r.label}
                  </dt>
                  <dd
                    className={`mt-1.5 grid gap-3 text-[13px] leading-snug text-body ${r.values.length > 1 ? "grid-cols-2" : ""}`}
                  >
                    {r.values.map((v, i) => (
                      <span key={i}>
                        {r.values.length > 1 && (
                          <span className="block text-[11px] font-medium text-muted">
                            {lender.columns[i]}
                          </span>
                        )}
                        {v}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* the notes */}
        <div data-loan-rise className="mt-8 lg:mt-10">
          <h3 className="text-[14px] font-bold text-ink">Notes</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-body marker:text-muted">
            {LOANS.notes.map((n) => (
              <li key={n.slice(0, 24)}>{n}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
