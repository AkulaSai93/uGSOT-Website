import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "New-Gen Engineering Specializations"
 *
 * Copy and imagery from sot.upgrad.com — heading, intro and the six domains,
 * verbatim.
 *
 * Layout is a bento grid (4 columns x 2 rows at lg) with the copy laid over
 * each photo; AI/ML and Cloud are the wide tiles. Heading and tiles follow
 * the site-wide section style; the tiles rise in, staggered, on scroll.
 */
const SPECIALIZATIONS = [
  {
    title: "Artificial Intelligence & Machine Learning",
    body: "Build intelligent systems that learn and adapt",
    key: "aiml",
  },
  {
    title: "Blockchain",
    body: "Master decentralized technologies and Web3",
    key: "blockchain",
  },
  {
    title: "Cybersecurity",
    body: "Protect systems with advanced security practices",
    key: "cybersecurity",
  },
  {
    title: "FullStack Web Development",
    body: "Create modern web applications end-to-end",
    key: "webdev",
  },
  {
    title: "Quantum Computing",
    body: "Explore next-generation computational power",
    key: "quantum",
  },
  {
    title: "Cloud Innovation",
    body: "Design scalable cloud-native architectures",
    key: "cloud",
  },
] as const;

/** Bento placement on a 4-column, 2-row grid (lg): AI/ML and Cloud are the
 *  wide tiles, diagonally opposite each other. */
const PLACEMENT: Record<(typeof SPECIALIZATIONS)[number]["key"], string> = {
  aiml: "lg:col-span-2 lg:col-start-1 lg:row-start-1",
  webdev: "lg:col-start-3 lg:row-start-1",
  quantum: "lg:col-start-4 lg:row-start-1",
  blockchain: "lg:col-start-1 lg:row-start-2",
  cybersecurity: "lg:col-start-2 lg:row-start-2",
  cloud: "lg:col-span-2 lg:col-start-3 lg:row-start-2",
};

function Card({ spec }: { spec: (typeof SPECIALIZATIONS)[number] }) {
  const wide = spec.key === "aiml" || spec.key === "cloud";
  return (
    <article
      data-reveal-item
      className={`group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[6px] bg-ink p-6 ${PLACEMENT[spec.key]}`}
      style={{ isolation: "isolate" }}
    >
      <Image
        src={`/images/specializations/${spec.key}.jpg`}
        alt=""
        fill
        sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
        className="-z-10 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {/* bottom scrim so the copy stays legible over any photo */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.75)_100%)]"
      />

      {/* Title sits at the bottom; the description opens beneath it on hover
          (or keyboard focus) by animating its grid row from 0fr to 1fr. */}
      <div>
        <h3
          className={`font-display font-bold leading-tight tracking-[-0.02em] text-white ${
            wide ? "max-w-[480px] text-[clamp(1.25rem,1.7vw,1.5rem)]" : "text-[16px]"
          }`}
        >
          {spec.title}
        </h3>
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <p className="min-h-0 max-w-[340px] overflow-hidden pt-2 text-[14px] leading-snug text-white/85">
            {spec.body}
          </p>
        </div>
      </div>
    </article>
  );
}

export function Specializations() {
  return (
    <section id="specializations" className="relative bg-canvas py-20 lg:py-28">
      <div className="container-page relative">
        <SectionHeading
          title="New-Gen Engineering"
          accent="Specializations"
          intro={
            <>
              Explore future-focused domains shaping the next decade of technology
              <br className="hidden sm:block" /> AI / ML, Cloud, Blockchain and many more
            </>
          }
        />

        {/* Styles are inline rather than in globals.css: this project's dev
            server does not reliably pick up new rules added there. */}
        <Reveal
          stagger={0.08}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[300px_300px]"
        >
          {SPECIALIZATIONS.map((spec) => (
            <Card key={spec.key} spec={spec} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
