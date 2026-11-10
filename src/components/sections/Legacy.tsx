import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { EcosystemCards } from "@/components/site/EcosystemCards";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Backed by upGrad's Learning Ecosystem" (Figma node 98:9430), set in the
 * site-wide section style: shared SectionHeading, the six ecosystem cards
 * rising in, and the seven stats counting up as they scroll into view.
 */
const STATS = [
  { label: "Learners", value: "10 M+" },
  { label: "Hiring Partners", value: "3000+" },
  { label: "Global Universities", value: "300+" },
  { label: "Countries", value: "70+" },
  { label: "Placements", value: "110K+" },
  { label: "Corporate clients trained annually", value: "600+" },
  { label: "Internships Enabled", value: "28L+" },
] as const;

export function Legacy() {
  return (
    <section id="legacy" className="bg-canvas">
      <div className="container-page flex flex-col items-center gap-14 py-8 lg:py-28">
        <SectionHeading
          title="Backed by"
          accent="upGrad’s Learning Ecosystem"
          intro="A legacy of 10+ years in higher education, driving learning, hiring, and career success."
        />

        {/* the six cards drop in one after another */}
        <Reveal className="w-full" stagger={0.09} y={48}>
          <EcosystemCards />
        </Reveal>

        {/* Wrapping grid below xl (two across on phones, the odd last one
            centred on its own row); at xl a single row of columns, each sized
            to its own label. */}
        <Reveal
          as="dl"
          stagger={0.06}
          className="grid w-full grid-cols-2 gap-y-9 pt-2 sm:grid-cols-3 sm:gap-y-10 sm:pt-4 md:grid-cols-4 xl:flex xl:items-start xl:justify-between xl:gap-y-0"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              data-reveal-item
              className="flex flex-col gap-2 px-3 text-center max-sm:last:odd:col-span-2 xl:flex-1 xl:px-3"
            >
              <dd className="m-0 font-display text-[30px] font-bold sm:text-[clamp(1.375rem,1.9vw,1.75rem)] leading-none tracking-[-0.02em] text-accent">
                <CountUp value={stat.value} />
              </dd>
              <dt className="text-[14px] leading-snug text-body sm:text-[13px]">{stat.label}</dt>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
