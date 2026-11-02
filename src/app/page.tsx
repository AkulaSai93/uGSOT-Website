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
import { IITRace } from "@/components/sections/IITRace";
import { Spotlight } from "@/components/sections/Spotlight";
import { News } from "@/components/sections/News";
import { Scholarships } from "@/components/sections/Scholarships";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
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
        <IITRace />
        <Spotlight />
        <News />
        <Scholarships />
      </main>
    </>
  );
}
