import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-topbar text-white">
      <div className="container-page flex h-9 items-center justify-center gap-3 text-[12.5px]">
        <p className="truncate">
          For admissions please contact{" "}
          <a href="tel:18002108080" className="font-semibold hover:underline">
            1800 210 8080
          </a>
        </p>
        <Link
          href="#apply"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-white underline-offset-4 hover:underline"
        >
          Apply Now
          <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
