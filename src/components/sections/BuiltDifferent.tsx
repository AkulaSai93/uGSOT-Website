/**
 * "How We're Built Different" — reproduced from sot.upgrad.com, built from that
 * section's own class list and computed styles rather than by eye:
 *
 *   section    padding 64px vertical at lg (py-14 / sm:py-16 / lg:py-16).
 *              Rendered light per the site's light-theme brief: the source
 *              panel is black, so surfaces and text are mapped to this
 *              project's light tokens while sizes, spacing and the red
 *              accent stay exactly as measured.
 *   container  shared .container-page gutter, flex-col, gap-10 -> lg:gap-[60px]
 *   header     max-w-[609px], centred; h2 32/36/40px, 600, lh 60px,
 *              "How " white + "We're Built Different" in --primary red
 *   intro      16px / 400 / lh 24px, white, mt-20px
 *   grid       1 -> md:2 -> lg:4 columns (320px each at 1440), hairline
 *              dividers in neutral-800, no card backgrounds
 *   cell       py-8 sm:py-10, contents centred, px-6 sm:px-8 md:px-10
 *   icon       h-20 w-20 -> sm:24 -> md:28 box, image object-contain,
 *              scales to 110% on hover over 300ms
 *   title      16px -> sm:18px, 700, lh 28px, neutral-50, centred, mb-2 sm:mb-3
 *   body       12px -> sm:14px, 400, lh 1.625, neutral-400, centred, max-w-xs
 *   accent bar 4x32px at left, centred vertically, neutral-700, grows to 80px
 *              on hover with a red glow layer fading in
 */
const PRIMARY = "oklch(0.577 0.245 27.325)";

const FEATURES = [
  {
    title: "Future-Ready Curriculum",
    body: "Stay updated with the latest in GenAI, MLOps, Quantum Computing, and Cybersecurity every six months.",
    icon: "brain.gif",
  },
  {
    title: "WorkX360 Internship Program",
    body: "Get access to paid, real-world experience through rotational internships with top startups and companies.",
    icon: "intern.gif",
  },
  {
    title: "Global Learning Experience",
    body: "Explore semester-abroad programs and global competitions for wider exposure.",
    icon: "map.gif",
  },
  {
    title: "Innovation Through Action",
    body: "Regular hackathons, open-source projects, and sponsorships for GSoC, ICPC, and NASA contests.",
    icon: "system.gif",
  },
  {
    title: "Personalized Growth Tracks",
    body: "Choose your path—high-paying jobs, entrepreneurship, or research—from the very first day.",
    icon: "root.gif",
  },
  {
    title: "Lifelong Career Support",
    body: "Get internship and job application support for your career growth.",
    icon: "career.gif",
  },
  {
    title: "Smart Scholarships & Support",
    body: "Access up to 100% scholarships with flexible, stress-free financing options.",
    icon: "scholar.gif",
  },
  {
    title: "Strong Network, Strong Careers",
    body: "Connect with 3000+ hiring partners and benefit from active alumni-driven placements.",
    icon: "placement.gif",
  },
] as const;

export function BuiltDifferent() {
  return (
    <section
      id="built-different"
      aria-labelledby="built-different-heading"
      className="w-full bg-surface py-14 sm:py-16"
    >
      <div className="container-page flex flex-col gap-10 lg:gap-[60px]">
        <header className="mx-auto max-w-[609px] text-center text-ink">
          <h2
            id="built-different-heading"
            className="font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-semibold leading-[1.33] tracking-[-0.4px]"
          >
            How{" "}
            <span style={{ color: PRIMARY }}>We&rsquo;re Built Different</span>
          </h2>
          <p className="mt-5 font-display text-[clamp(0.9375rem,1.2vw,1rem)] font-normal leading-[1.6] text-muted">
            Designed to go beyond traditional education with hands-on learning,
            global exposure, industry integration, and career-focused outcomes.
          </p>
        </header>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group/feature relative flex flex-col overflow-hidden border-b border-line py-8 last:border-b-0 sm:py-10 md:border-r md:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b lg:border-l lg:border-r lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-last-child(-n+4)]:border-b-0"
            >
              {/* left accent bar: 4x32, grows to 80 and glows red on hover */}
              <div
                aria-hidden
                className="absolute left-0 top-1/2 h-8 w-1 origin-center -translate-y-1/2 rounded-br-full rounded-tr-full bg-line-strong transition-all duration-300 group-hover/feature:h-20"
              >
                <div
                  style={{
                    backgroundColor: PRIMARY,
                    boxShadow: `0 0 20px color-mix(in srgb, ${PRIMARY} 60%, transparent)`,
                  }}
                  className="absolute inset-0 rounded-br-full rounded-tr-full opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100"
                />
              </div>

              <div className="relative flex flex-col items-center px-6 sm:px-8 md:px-10">
                <div className="relative z-10 mb-4 flex size-20 items-center justify-center sm:mb-6 sm:size-24 md:size-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/built/${feature.icon}`}
                    alt=""
                    width={112}
                    height={112}
                    loading="lazy"
                    className="pointer-events-none h-full w-full select-none object-contain transition-all duration-300 group-hover/feature:scale-110"
                  />
                </div>

                <h3 className="relative z-10 mb-2 text-center text-base font-bold text-ink sm:mb-3 sm:text-lg">
                  {feature.title}
                </h3>

                <p className="relative z-10 max-w-xs text-center text-xs leading-relaxed text-body sm:text-sm">
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
