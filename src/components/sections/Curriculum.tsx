"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * "Build Industry-Preferred Skills Through Practical Learning"
 *
 * Copy, subjects and skills are sot.upgrad.com's; project descriptions are
 * shortened to one line each.
 *
 * Layout combines two references:
 *  - left, from mastersunion.org ("Hands-on Learning"): the four years scroll
 *    past as tall blocks hung on a vertical timeline, each with a badge,
 *    title and a numbered list (the year's subjects)
 *  - right, from scaler.com ("Future-Proof Curriculum"): a sticky panel with
 *    the active year's title, a project carousel and skill chips
 *
 * The active year is whichever block's top has crossed 45% of the viewport,
 * tracked by one rAF-throttled scroll handler. Below lg the panel is not
 * sticky: each year renders its own panel inline under its block.
 */
type Project = { title: string; body: string; img: string };
type Year = {
  key: string;
  label: string;
  title: string;
  body: string;
  subjects: string[];
  skills: string[];
  projects: Project[];
};

const YEARS: Year[] = [
  {
    key: "y1",
    label: "Year 1",
    title: "Foundations",
    body: "Build strong fundamentals in programming, math, and core computer science.",
    subjects: [
      "Python",
      "Engineering Mathematics I",
      "Web Essentials",
      "Data Structures & Algorithms I",
      "FrontEnd Development",
      "Engineering Mathematics II",
      "Java",
    ],
    skills: [
      "Python",
      "Java",
      "Engineering Mathematics",
      "DSA",
      "Frontend (HTML, CSS, JS, React)",
      "Linux",
      "Git & GitHub",
    ],
    projects: [
      {
        title: "Online Reporting & Flight Booking Platform",
        body: "Search, book and report on flights.",
        img: "y1-1.jpg",
      },
      {
        title: "Dynamic UI with JSON Configs",
        body: "Change layouts and forms without code.",
        img: "y1-2.jpg",
      },
      {
        title: "Distributed Payment Processor",
        body: "Fault-tolerant payments with reliable webhooks.",
        img: "y1-3.jpg",
      },
      {
        title: "API Gateway: Rate Limiting & Circuit Breaker",
        body: "Manage traffic and handle failures gracefully.",
        img: "y1-4.jpg",
      },
      {
        title: "Automated Assignment Evaluation System",
        body: "Auto-grade Python code with tests and CI.",
        img: "y1-5.jpg",
      },
      {
        title: "React-Based Student Dashboard",
        body: "Timetable, announcements and events in one view.",
        img: "y1-6.jpg",
      },
    ],
  },
  {
    key: "y2",
    label: "Year 2",
    title: "Core Tech",
    body: "Dive deep into algorithms, data structures, and system design fundamentals.",
    subjects: [
      "Engineering Mathematics III",
      "Data Structures & Algorithms II",
      "Database Management Systems",
      "Backend Development (MERN)",
      "Operating Systems",
      "Generative AI & Agentic Systems",
      "Cloud Computing Fundamentals",
    ],
    skills: [
      "Advanced DSA",
      "SQL & DBMS",
      "Backend (MERN)",
      "Operating Systems",
      "Generative AI",
      "Cloud Computing",
    ],
    projects: [
      {
        title: "Real-Time IoT Healthcare Management",
        body: "Live patient data from IoT devices.",
        img: "y2-1.jpg",
      },
      {
        title: "End-to-End Web Contact Center with WebRTC",
        body: "Browser-based calls with live agent management.",
        img: "y2-2.jpg",
      },
      {
        title: "Multi-Language Encrypted Chat Platform",
        body: "End-to-end encrypted, multi-language chat.",
        img: "y2-3.jpg",
      },
      {
        title: "Real-Time Collaborative Document Editor",
        body: "Many users editing one document live.",
        img: "y2-4.jpg",
      },
      {
        title: "Student Performance Analytics Dashboard",
        body: "Turn marks data into visual insights.",
        img: "y2-5.jpg",
      },
      {
        title: "IoT Smart Monitoring Setup",
        body: "Live temperature and humidity with alerts.",
        img: "y2-6.jpg",
      },
    ],
  },
  {
    key: "y3",
    label: "Year 3",
    title: "Advanced AI & Quantum",
    body: "Explore cutting-edge technologies including AI, ML, and quantum computing.",
    subjects: [
      "Internship I (6 Months)",
      "Compiler Design",
      "Artificial Intelligence",
      "Computer Organization & Architecture",
      "Deep Learning",
      "Cybersecurity Essentials",
      "Software Engineering",
      "Quantum Programming",
    ],
    skills: [
      "Compiler Design",
      "Artificial Intelligence",
      "Computer Architecture",
      "Deep Learning",
      "Software Engineering",
      "Quantum Programming",
    ],
    projects: [
      {
        title: "Automated Vulnerability Management",
        body: "Automate dependency scans and security patches.",
        img: "y3-1.jpg",
      },
      {
        title: "Multi-Tenant SaaS with Tenant Isolation",
        body: "One platform, securely isolated per organisation.",
        img: "y3-2.jpg",
      },
      {
        title: "Image Recognition Attendance System",
        body: "Mark attendance with face recognition.",
        img: "y3-3.jpg",
      },
      {
        title: "Smart Campus Navigation App",
        body: "Search and route around campus on a map.",
        img: "y3-4.jpg",
      },
      {
        title: "Cloud Deployment + Monitoring Pipeline",
        body: "Containerise, deploy and monitor with CI/CD.",
        img: "y3-5.jpg",
      },
      {
        title: "Fraud Detection for Transactions",
        body: "Flag suspicious transactions with ML.",
        img: "y3-6.jpg",
      },
    ],
  },
  {
    key: "y4",
    label: "Year 4",
    title: "Industry & Innovation",
    body: "Real-world industry projects and innovative solutions for complex problems.",
    subjects: [
      "Computer Networks",
      "Deep Learning",
      "Capstone Project Phase I",
      "Real-World Product Development & Agile Project Management",
      "Theory of Computation (TOC)",
      "IoT & Edge Computing for Intelligent Systems",
      "AI-Native Cloud Architecture & Distributed Systems",
      "Capstone Project Phase II",
    ],
    skills: [
      "Computer Networks",
      "Deep Learning",
      "Product Dev",
      "Agile",
      "Cloud & Distributed Systems",
      "Advanced DSA & System Design",
    ],
    projects: [
      {
        title: "Enterprise Helpdesk & Ticket System",
        body: "Track issues with roles, SLAs and dashboards.",
        img: "y4-1.jpg",
      },
      {
        title: "Supply Chain Tracker with Blockchain",
        body: "Tamper-proof shipment tracking.",
        img: "y4-2.jpg",
      },
      {
        title: "Smart Waste Segregation IoT System",
        body: "Sort waste with sensors and alerts.",
        img: "y4-3.jpg",
      },
      {
        title: "Credit Card Fraud Alert Platform",
        body: "Real-time fraud alerts on the cloud.",
        img: "y4-4.jpg",
      },
      {
        title: "Smart Parking System with Analytics",
        body: "Live parking availability and analytics.",
        img: "y4-5.jpg",
      },
      {
        title: "Personalized Learning Recommendation Engine",
        body: "Suggest courses from learner behaviour.",
        img: "y4-6.jpg",
      },
    ],
  },
];

/** line icons for the timeline badges, one per year */
function YearIcon({ k }: { k: string }) {
  const paths: Record<string, ReactNode> = {
    // foundations: stacked blocks
    y1: <path d="M4 15h7v5H4zM13 15h7v5h-7zM8.5 9h7v5h-7zM12 4l3 3-3 1-3-1z" />,
    // core tech: chip
    y2: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
      </>
    ),
    // AI & quantum: atom
    y3: (
      <>
        <circle cx="12" cy="12" r="1.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      </>
    ),
    // industry & innovation: briefcase
    y4: (
      <>
        <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
        <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M3.5 12.5h17" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[k]}
    </svg>
  );
}

/** small uppercase label used for each block of the panel */
function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
      {children}
    </p>
  );
}

/**
 * Detail panel, structured after scaler.com's "Future-Proof Curriculum"
 * (year title, project carousel, skills) but kept quiet: one white surface,
 * uppercase labels, full-bleed project images and plain chips.
 */
function YearPanel({ year, index }: { year: Year; index: number }) {
  const rowRef = useRef<HTMLUListElement | null>(null);
  // which overlay arrows to show — none at an end of the row
  const [edges, setEdges] = useState({ start: true, end: false });
  const syncEdges = () => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({
      start: row.scrollLeft <= 4,
      end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4,
    });
  };
  const scrollRow = (dir: 1 | -1) =>
    rowRef.current?.scrollBy({ left: dir * (rowRef.current.clientWidth - 40), behavior: "smooth" });

  return (
    <div className="overflow-hidden rounded-lg border border-black/[0.08] bg-white">
      <div className="px-7 pt-6">
        <p className="text-[13px] font-semibold text-[#e6161f]">
          {year.label}
          <span className="ml-2 font-medium text-muted">
            {String(index + 1).padStart(2, "0")} / {String(YEARS.length).padStart(2, "0")}
          </span>
        </p>
        <h3 className="mt-2 text-[24px] font-semibold leading-tight text-ink">
          {year.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-body">
          {year.body}
        </p>
      </div>

      <div className="mt-5 px-7">
        <PanelLabel>Projects you&apos;ll be working on</PanelLabel>
      </div>

      {/* Carousel with Scaler's floating arrows: a round translucent button
          over the edge card, level with the images. */}
      <div className="relative mt-4">
        <ul
          ref={rowRef}
          onScroll={syncEdges}
          className="flex snap-x snap-mandatory scroll-px-7 gap-4 overflow-x-auto px-7 pb-1 [scrollbar-width:none]"
        >
          {year.projects.map((p) => (
            <li
              key={p.title}
              className="w-[calc((100%-32px)/3)] min-w-[220px] shrink-0 snap-start rounded-xl border border-black/[0.1] bg-white p-4"
            >
              <div className="relative aspect-[1.68] overflow-hidden rounded-md bg-sunken">
                <Image
                  src={`/images/curriculum/${p.img}`}
                  alt=""
                  fill
                  sizes="320px"
                  // the generated art sits small in its frame; zoom in so the
                  // browser window fills the tile as in the reference
                  className="scale-[1.45] object-cover"
                />
              </div>
              <h4 className="mt-3.5 line-clamp-2 min-h-[2lh] text-[16px] font-semibold leading-snug text-[#e6161f]">
                {p.title}
              </h4>
              <p className="mt-1.5 text-[13.5px] leading-snug text-[#616161]">
                {p.body}
              </p>
            </li>
          ))}
        </ul>

        {([-1, 1] as const).map((dir) =>
          (dir < 0 ? edges.start : edges.end) ? null : (
            <button
              key={dir}
              type="button"
              onClick={() => scrollRow(dir)}
              aria-label={dir < 0 ? "Previous projects" : "Next projects"}
              className={`absolute top-[54px] grid size-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 ${
                dir < 0 ? "left-3" : "right-3"
              }`}
            >
              <svg viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={dir < 0 ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} />
              </svg>
            </button>
          ),
        )}
      </div>

      <div className="mx-7 mt-5 border-t border-black/[0.06] pb-6 pt-5">
        <PanelLabel>Skills you&apos;ll build</PanelLabel>
        <ul className="mt-3 flex flex-wrap gap-2">
          {year.skills.map((s) => (
            <li
              key={s}
              className="rounded bg-[#f4f4f5] px-3 py-1.5 text-[13px] font-medium text-ink"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Curriculum() {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let next = 0;
      blockRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
      setActive(next);

      // On short windows the panel can be taller than the space under the
      // navbar; pin it higher so its bottom edge stays on screen.
      const panel = stickyRef.current;
      if (panel) {
        const top = Math.min(100, window.innerHeight - panel.offsetHeight - 16);
        panel.style.top = `${top}px`;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="curriculum" className="bg-white py-14 lg:py-16">
      <div className="container-page">
        <header className="mx-auto max-w-[934px] text-center">
          <h2 className="font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px] text-ink">
            Build Industry-Preferred Skills Through{" "}
            <span className="text-[#e6161f]">Practical Learning</span>
          </h2>
          <p className="mt-5 font-display text-[clamp(0.9375rem,1.2vw,1rem)] font-normal leading-[1.6] text-muted">
            A structured learning journey designed with input from industry
            experts.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-12">
          {/* Left: timeline of years (Masters' Union) */}
          {/* min-w-0: without it the inline YearPanel carousel sets this grid
              item's min width and the whole page scrolls sideways on phones. */}
          <div className="relative min-w-0">
            {/* the rail the badges hang on */}
            <span
              aria-hidden
              className="absolute bottom-0 left-[19px] top-2 w-px bg-black/10"
            />
            {YEARS.map((year, i) => {
              const on = i === active;
              return (
                <div
                  key={year.key}
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                  className="relative pb-16 pl-14 last:pb-0 lg:min-h-[78vh] lg:last:min-h-[70vh]"
                >
                  <span
                    className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full border text-[13px] font-semibold transition-colors duration-300 ${
                      on
                        ? "border-[#e6161f] bg-[#e6161f] text-white"
                        : "border-black/15 bg-white text-ink"
                    }`}
                  >
                    <YearIcon k={year.key} />
                  </span>

                  <div
                    className={`transition-opacity duration-300 ${
                      on ? "opacity-100" : "lg:opacity-40"
                    }`}
                  >
                    <span className="inline-block rounded bg-[#f3f4f6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                      {year.label}
                    </span>
                    <h3 className="mt-3 text-[clamp(1.25rem,1.7vw,1.5rem)] font-semibold leading-tight text-ink">
                      {year.title}
                    </h3>

                    <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Subjects
                    </p>
                    <ol className="mt-3 space-y-2.5">
                      {year.subjects.map((s, n) => (
                        <li key={s} className="flex items-start gap-3 text-[14px] leading-snug text-ink">
                          <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full border border-black/15 text-[11px] font-semibold">
                            {n + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>

                  </div>

                  {/* below lg the panel sits inline with its year */}
                  <div className="mt-8 lg:hidden">
                    <YearPanel year={year} index={i} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: sticky detail panel (Scaler) */}
          <div className="hidden lg:block">
            <div ref={stickyRef} className="sticky top-[100px]">
              <div key={YEARS[active].key} className="animate-[curriculum-in_400ms_ease-out]">
                <YearPanel year={YEARS[active]} index={active} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes curriculum-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
