"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Frequently Asked Questions"
 *
 * Copy is sot.upgrad.com's, verbatim: the heading and line (less its lead-in), the five common
 * questions with their answers, and the link to the full list (allFAQs).
 *
 * Layout, kept clean: the centred heading, then the questions as a single
 * column of white rows with 6px corners and a thin border — the number in red,
 * the question, and a plus that turns into a cross while open. One answer
 * shows at a time (the first to start). Under them a quiet link to all FAQs.
 *
 * Motion (GSAP): the answer opens and closes by height while its text fades
 * in; the rows rise in one after another on scroll.
 */
const FAQS = [
  {
    q: "What programs does upGrad School of Technology offer in collaboration with partner universities?",
    a: "upGrad School of Technology (uGSOT) collaborates with accredited partner universities to offer B.E/B.Tech programs with a focus on technology and applied learning. The degree is conferred by the respective partner university. The curriculum is designed to prepare students for careers in software engineering, AI, and related fields through a rigorous, industry-aligned academic environment.",
  },
  {
    q: "What is the admission process for the partner-university B.E/B.Tech program?",
    a: "The admission process typically involves application submission, entrance assessment (uGNET), and a personal interview for shortlisted candidates. Eligibility, required documents, and important dates are published on our website. You can track your application progress through the student dashboard.",
  },
  {
    q: "What are the eligibility criteria for B.E/B.Tech at partner universities?",
    a: "Eligibility criteria include completion of 12th grade with Mathematics, Physics, and Chemistry from a recognized board. Specific year-of-passing and board requirements are updated each admission cycle. Check the current application guidelines on our website for the latest criteria.",
  },
  {
    q: "Are scholarships available for the partner-university program?",
    a: "Yes. Merit-based scholarships and financial aid options are available for the B.E/B.Tech program offered through partner universities. Eligibility is determined by performance in the entrance process and overall profile. Details on scholarship types, amounts, and application process are available during the admission cycle.",
  },
  {
    q: "What placement and career support is available?",
    a: "Students receive dedicated placement support, industry partnerships, and career guidance through the program. This includes placement preparation, company recruitment drives, and internship opportunities. Placement outcomes and support services are detailed on our website and in program brochures.",
  },
] as const;

const ALL_FAQS = "https://sot.upgrad.com/allFAQs";

/** `university`: on a campus page, its short name, which the eligibility
 *  question names in place of "partner universities", as that page does */
export function Faqs({ university }: { university?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const faqs = university
    ? FAQS.map((f) => ({ ...f, q: f.q.replace("at partner universities", `at ${university}`) }))
    : FAQS;
  const [open, setOpen] = useState<number | null>(0);
  const first = useRef(true);

  // open the chosen answer, close the rest
  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.utils
        .toArray<HTMLElement>("[data-answer]", root.current)
        .forEach((el, i) => {
          const body = el.firstElementChild;
          if (i === open) {
            if (first.current || reduced) gsap.set(el, { height: "auto" });
            else
              gsap.to(el, {
                height: "auto",
                duration: 0.55,
                ease: "expo.out",
                overwrite: true,
              });
            gsap.fromTo(
              body,
              { autoAlpha: 0, y: -6 },
              {
                autoAlpha: 1,
                y: 0,
                duration: first.current || reduced ? 0 : 0.5,
                delay: first.current || reduced ? 0 : 0.1,
                ease: "power2.out",
              },
            );
          } else if (first.current || reduced) gsap.set(el, { height: 0 });
          else
            gsap.to(el, {
              height: 0,
              duration: 0.4,
              ease: "power3.inOut",
              overwrite: true,
            });
        });
      first.current = false;
    },
    { dependencies: [open], scope: root },
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-row]"),
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: q("[data-list]")[0],
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

  return (
    <section ref={root} id="faqs" className="bg-canvas py-8 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Frequently Asked"
          accent="Questions"
          intro="Got questions? That’s a great sign. Some common queries:"
        />

        <ul
          data-list
          className="mx-auto mt-12 flex max-w-[860px] flex-col gap-3 lg:mt-14"
        >
          {faqs.map((f, i) => {
            const isOpen = i === open;
            return (
              <li
                key={f.q}
                data-row
                className={`rounded-[6px] border bg-white transition-colors duration-300 ${
                  isOpen ? "border-ink/20" : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-6 sm:px-6"
                  >
                    <span className="w-6 shrink-0 font-[family-name:var(--font-bricolage)] text-[14px] font-semibold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15.5px] font-semibold leading-snug text-ink sm:text-[16.5px]">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-8 shrink-0 place-items-center rounded-[6px] transition-colors duration-300 ${
                        isOpen
                          ? "bg-accent text-white"
                          : "bg-ink/[0.05] text-ink"
                      }`}
                    >
                      <Plus
                        size={16}
                        strokeWidth={2.25}
                        className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  data-answer
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="h-0 overflow-hidden"
                >
                  <p className="pb-6 pl-[60px] pr-5 text-[14.5px] leading-relaxed text-body sm:pl-[72px] sm:pr-16">
                    {f.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <a
            href={ALL_FAQS}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink transition-colors hover:text-accent"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/link:bg-[length:100%_1px]">
              View all FAQs
            </span>
            <ArrowUpRight
              size={15}
              strokeWidth={2}
              aria-hidden
              className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
