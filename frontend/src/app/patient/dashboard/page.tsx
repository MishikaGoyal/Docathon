import { FeaturesSectionDemo } from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { NavbarDemo } from "@/components/patient/Navbar";
import Image from "next/image";

export default function PatientDashboard() {
  return (
    <div>
      <div>
        <Hero />
        <div className="mt-36 border-t-2">
          <h4 className="text-5xl mt-4  lg:text-4xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Packed with multiple features
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
