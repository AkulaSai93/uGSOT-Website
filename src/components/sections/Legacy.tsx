import { EcosystemCards } from "@/components/site/EcosystemCards";

/**
 * "Backed by upGrad's Learning Ecosystem" — implemented from Figma
 * node 98:9430.
 *
 *   section    bg white
 *   container  shared .container-page gutter, pt-64 pb-64, flex-col gap-48 centred
 *   heading    44px / 600 / lh 58.52 / tracking -0.4px, #0b0d12,
 *              with "upGrad's Learning Ecosystem" at weight 500 in #e6161f
 *   sub        24px / 400 / lh 36, #3d4452
 *   stats      7 x 176px grid, 108px row; each cell flex-col gap-20, px-16
 *   value      40px / 600 / lh 40, #e6161f
 *   label      16px / 400 / lh 24, #3d4452 (last two capped at 144px wide)
 */
const STATS = [
  { label: "Learners", value: "10 M+", narrow: false },
  { label: "Hiring Partners", value: "3000+", narrow: false },
  { label: "Global Universities", value: "300+", narrow: false },
  { label: "Countries", value: "70+", narrow: false },
  { label: "Placements", value: "110K+", narrow: false },
  { label: "Corporate clients trained annually", value: "600+", narrow: true },
  { label: "Internships Enabled", value: "28L+", narrow: true },
] as const;

export function Legacy() {
  return (
    <section id="legacy" className="bg-white">
      <div className="container-page flex flex-col items-center gap-12 pb-16 pt-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px] text-[#0b0d12]">
            Backed by{" "}
            <span className="font-medium text-[#e6161f]">
              upGrad&rsquo;s Learning Ecosystem
            </span>
          </h2>

          {/* One line at every width: 17px down to ~1090px, then viewport-scaled. */}
          <p className="whitespace-nowrap font-display text-[min(1rem,1.55vw)] font-normal leading-[1.6] text-muted">
            A legacy of 10+ years in higher education, driving learning, hiring,
            and career success
          </p>
        </div>

        <EcosystemCards />

        {/* Below xl this is a wrapping grid. At xl it becomes a flex row so
            each column sizes to its own label instead of being locked to an
            equal 176px — at equal widths "Corporate clients trained annually"
            would need to drop to 8.5px to stay on one line. */}
        <dl className="grid w-full grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-4 xl:flex xl:w-[1232px] xl:items-start xl:justify-between xl:gap-y-0">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-5 px-4 text-center xl:px-2"
            >
              <dd className="m-0 font-display text-[clamp(2rem,3vw,2.5rem)] font-semibold leading-none text-[#e6161f]">
                {stat.value}
              </dd>
              <dt className="font-display text-[15px] font-normal leading-6 text-[#3d4452] xl:whitespace-nowrap">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
