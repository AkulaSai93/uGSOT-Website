import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Legacy } from "@/components/sections/Legacy";
import { BestOfBoth } from "@/components/sections/BestOfBoth";
import { BuiltDifferent } from "@/components/sections/BuiltDifferent";
import { Specializations } from "@/components/sections/Specializations";
import { Curriculum } from "@/components/sections/Curriculum";
import { Pathways } from "@/components/sections/Pathways";

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
      </main>
    </>
  );
}
