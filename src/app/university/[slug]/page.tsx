import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CampusHero } from "@/components/campus/CampusHero";
import { CampusAbout } from "@/components/campus/CampusAbout";
import { CampusFees } from "@/components/campus/CampusFees";
import { CampusLoans } from "@/components/campus/CampusLoans";
import { CampusRecognitions } from "@/components/campus/CampusRecognitions";
// shared with the home page, as sot.upgrad.com's university pages repeat them
import { Faculty } from "@/components/sections/Faculty";
import { Scholarships } from "@/components/sections/Scholarships";
import { Admission } from "@/components/sections/Admission";
import { Faqs } from "@/components/sections/Faqs";
import { CAMPUSES, campusBySlug } from "@/components/campus/campuses";

/** the campuses in the list are built ahead; any other slug is a 404 (below) */
export function generateStaticParams() {
  return CAMPUSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/university/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const campus = campusBySlug(slug);
  if (!campus) return {};
  return {
    title: `${campus.programme.lead} ${campus.programme.accent} ${campus.programme.tail ?? ""} at ${campus.short} | upGrad School of Technology`.replace(/\s+/g, " "),
    description: `${campus.programme.lead} ${campus.programme.accent} at ${campus.name}, ${campus.location}, in collaboration with upGrad School of Technology.`,
  };
}

export default function CampusPage(props: PageProps<"/university/[slug]">) {
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        {/* the campus is read from the URL inside Suspense, so the page's
            shell renders at once; the listed campuses are prerendered whole */}
        <Suspense fallback={null}>
          <Campus params={props.params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function Campus({ params }: Pick<PageProps<"/university/[slug]">, "params">) {
  const { slug } = await params;
  const campus = campusBySlug(slug);
  if (!campus) notFound();
  return (
    // a campus page is a run of short sections, so they sit closer than on
    // the home page: every section after the hero gets less padding, and
    // every section heading the size of "Campus Facilities" (the shared home
    // sections too, on this page only)
    <div className="[--section-heading-size:clamp(1.25rem,2vw,1.75rem)] [&>section:not(:first-child)]:py-6 lg:[&>section:not(:first-child)]:py-12">
      <CampusHero campus={campus} />
      <CampusRecognitions campus={campus} />
      <CampusAbout campus={campus} />
      <Faculty />
      <CampusFees campus={campus} />
      <CampusLoans />
      <Scholarships />
      <Admission />
      <Faqs university={campus.short} />
    </div>
  );
}
