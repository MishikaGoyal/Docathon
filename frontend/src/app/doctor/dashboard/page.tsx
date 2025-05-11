import { FeaturesSectionDemo } from "../Components/DocFeat";
import Footer from "@/components/Footer";
import Hero from "../Components/DocHero";
import { NavbarDemo } from "../Components/DocNav";
import Image from "next/image";

export default function DoctorDashboard() {
  return (
    <div>
      <div>
        <NavbarDemo />
        <Hero />
        <div className="mt-36 border-t-2">
          <h4 className="text-3xl mt-4  lg:text-4xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Supports
          </h4>
          <FeaturesSectionDemo />
        </div>
        <div className="mt-36 border-t-2">
          <Footer />
        </div>
      </div>
    </div>
  );
}
