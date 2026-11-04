"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Build Industry-Preferred Skills Through Practical Learning"
 *
 * Copy, subjects and skills are sot.upgrad.com's; project descriptions are
 * shortened to one line each. Project pictures are Figma AI illustrations in
 * sot.upgrad.com's flat red-and-grey style (/images/curriculum/v3).
 *
 * Layout: the four years as four large cards, each in its own soft tint (the
 * pink, peach, blue and green of the stacked cards on sot.upgrad.com/catalyst),
 * that stack as you scroll — each pins under the nav, and the next slides up over it like
 * the next sheet in a deck. On each card: the year's number large in red, its
 * title and line, and its skills as chips on the left; on the right the
 * year's subjects in two numbered columns and, beneath, its six projects in a
 * sideways row of tiles (picture, title, line). Below lg the cards simply
 * follow one another.
 *
 * Motion (GSAP, scrubbed by the scroll): as a card is covered by the next it
 * shrinks back a little and greys over (a veil, so it stays solid), so the
 * deck reads in depth; the cards rise
 * in on first scroll.
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

/** each year's card colour, the soft tints sot.upgrad.com/catalyst uses for
 *  its stacked cards: pink, peach, blue, green */
const TINTS = ["#fce9eb", "#fff7ec", "#f1f6ff", "#eaf4ec"];

/** one project: its picture, title and line */
function ProjectTile({ p }: { p: Project }) {
  return (
    <li className="group/tile w-[210px] shrink-0 snap-start sm:w-[230px]">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[6px] border border-ink/10 bg-white">
        <Image
          src={`/images/curriculum/v3/${p.img}`}
          alt=""
          fill
          sizes="240px"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.05]"
        />
      </div>
      <h5 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">
        {p.title}
      </h5>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-body">
        {p.body}
      </p>
    </li>
  );
}

/** small grey label over each block of a card */
function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
      {children}
    </p>
  );
}

/** a year's card */
function YearCard({ year, index }: { year: Year; index: number }) {
  const row = useRef<HTMLUListElement>(null);
  const scrollRow = (dir: 1 | -1) =>
    row.current?.scrollBy({ left: dir * 250, behavior: "smooth" });

  return (
    <article
      data-card
      style={{ background: TINTS[index % TINTS.length] }}
      className="relative grid origin-top gap-8 rounded-[6px] border border-ink/[0.06] p-6 shadow-[0_24px_48px_-32px_rgba(11,13,18,0.25)] sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-12 lg:p-10"
    >
      {/* the veil that dims the card as the next one covers it */}
      <span
        data-veil
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[6px] bg-[#eceef2]/70 opacity-0"
      />
      {/* left: the year, its title and line, its skills */}
      <div className="flex flex-col">
        <p className="font-[family-name:var(--font-bricolage)] text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-3 text-[13px] font-semibold text-ink/60">
          {year.label}
        </p>
        <h3 className="mt-1 font-display text-[clamp(1.375rem,2vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
          {year.title}
        </h3>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">
          {year.body}
        </p>

        <div className="mt-8 lg:mt-auto">
          <Label>Skills you&apos;ll build</Label>
          <ul className="mt-3 flex flex-wrap gap-2">
            {year.skills.map((sk) => (
              <li
                key={sk}
                className="rounded-[4px] bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-ink"
              >
                {sk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* right: subjects, then projects */}
      <div className="min-w-0">
        <Label>Subjects</Label>
        <ol className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {year.subjects.map((sub, n) => (
            <li
              key={sub}
              className="flex items-baseline gap-3 text-[14px] leading-snug text-ink"
            >
              <span className="w-5 shrink-0 font-[family-name:var(--font-bricolage)] text-[12.5px] font-semibold text-accent">
                {String(n + 1).padStart(2, "0")}
              </span>
              {sub}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-center justify-between">
          <Label>Projects you&apos;ll be working on</Label>
          <div className="hidden gap-1.5 sm:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollRow(dir)}
                aria-label={dir < 0 ? "Previous projects" : "Next projects"}
                className="grid size-8 place-items-center rounded-[6px] border border-ink/10 bg-white text-ink transition-colors hover:border-ink/30"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d={dir < 0 ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <ul
          ref={row}
          className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          {year.projects.map((p) => (
            <ProjectTile key={p.title} p={p} />
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Curriculum() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-slot]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: q("[data-deck]")[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      // lg+: each card shrinks back and dims as the next slides over it
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const slots = q("[data-slot]");
          slots.forEach((slot, i) => {
            const next = slots[i + 1];
            if (!next) return;
            const st = {
              trigger: next,
              start: "top bottom",
              end: "top 100px",
              scrub: true,
            };
            gsap.to(slot.querySelector("[data-card]"), {
              scale: 0.94,
              ease: "none",
              scrollTrigger: st,
            });
            // a veil rather than opacity, so the card stays solid and the one
            // beneath never shows through
            gsap.fromTo(
              slot.querySelector("[data-veil]"),
              { opacity: 0 },
              { opacity: 1, ease: "none", scrollTrigger: { ...st } },
            );
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="curriculum" className="bg-canvas py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Build Industry Preferred Skills Through"
          accent="Practical Learning"
          breakBeforeAccent
          intro="A structured learning journey designed with input from industry experts."
        />

        {/* the deck: each year pins under the nav, the next stacking over it */}
        <div
          data-deck
          className="mt-14 flex flex-col gap-6 lg:mt-16 lg:gap-[18vh]"
        >
          {YEARS.map((year, i) => (
            <div
              key={year.key}
              data-slot
              className="lg:sticky"
              style={{ top: `calc(92px + ${i * 14}px)` }}
            >
              <div className="origin-top">
                <YearCard year={year} index={i} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
