import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Legacy } from "@/components/sections/Legacy";
import { BestOfBoth } from "@/components/sections/BestOfBoth";
import { BuiltDifferent } from "@/components/sections/BuiltDifferent";
import { Specializations } from "@/components/sections/Specializations";
import { Curriculum } from "@/components/sections/Curriculum";
import { Pathways } from "@/components/sections/Pathways";
import { Campuses } from "@/components/sections/Campuses";
import { Leaders } from "@/components/sections/Leaders";
import { Faculty } from "@/components/sections/Faculty";
import { Festivals } from "@/components/sections/Festivals";
import { IITRace } from "@/components/sections/IITRace";
import { Spotlight } from "@/components/sections/Spotlight";
import { News } from "@/components/sections/News";
import { Awards } from "@/components/sections/Awards";
import { Scholarships } from "@/components/sections/Scholarships";
import { Admission } from "@/components/sections/Admission";
import { Toolkit } from "@/components/sections/Toolkit";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faqs } from "@/components/sections/Faqs";
import { Mentorship } from "@/components/sections/Mentorship";
import { Social } from "@/components/sections/Social";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* the page sits above the footer and slides up off it */}
      <main className="relative z-10 flex-1 bg-canvas">
        <Hero />
        <Legacy />
        <BestOfBoth />
        <BuiltDifferent />
        <Specializations />
        <Curriculum />
        <Pathways />
        <Campuses />
        <Leaders />
        <Faculty />
        <Mentorship />
        <Festivals />
        <IITRace />
        <Spotlight />
        <News />
        <Awards />
        <Scholarships />
        <Admission />
        <Toolkit />
        <Testimonials />
        <Social />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
