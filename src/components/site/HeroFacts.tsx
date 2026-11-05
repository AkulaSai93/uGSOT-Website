/**
 * Fact strip under the hero copy, in the style of the Newton School hero.
 *
 * Labels are written in capitals rather than set uppercase by CSS, so the
 * brand's lower-case "u" in uGNET survives.
 *
 * Every value is sourced from the live site — nothing invented:
 *  - Duration:    sot.upgrad.com/admission fee table runs Sem 1–8 → 4 years
 *  - uGNET:       sot.upgrad.com/uGNET — "MODE: Online (Assessment Platform)",
 *                 "EXAM TIME: Scheduled after you call admissions".
 *                 There is no fixed exam date published, so this cell states
 *                 the real scheduling model rather than a made-up date.
 */
const FACTS = [
  { label: "COURSE DURATION", value: "4 Years", note: "8 semesters" },
  { label: "uGNET EXAM", value: "Scheduled on call", note: "Online test" },
] as const;

export function HeroFacts({ className = "" }: { className?: string }) {
  return (
    <dl className={`flex items-stretch gap-x-5 text-left sm:gap-x-7 ${className}`}>
      {FACTS.map((fact, i) => (
        <div
          key={fact.label}
          /* the two cells sit side by side at every width, with a rule
             between them */
          className={i > 0 ? "border-l border-ink/15 pl-5 sm:pl-7" : undefined}
        >
          <dt className="whitespace-nowrap text-[11px] font-semibold tracking-[0.12em] text-muted lg:text-[10.5px] lg:tracking-[0.14em]">
            {fact.label}
          </dt>
          <dd className="mt-1.5 whitespace-nowrap font-display text-[clamp(16px,5vw,19px)] font-bold leading-none text-ink lg:mt-1 lg:text-[16px]">
            {fact.value}
          </dd>
          <p className="mt-1.5 text-[13px] text-muted lg:mt-1 lg:text-[11.5px]">{fact.note}</p>
        </div>
      ))}
    </dl>
  );
}
