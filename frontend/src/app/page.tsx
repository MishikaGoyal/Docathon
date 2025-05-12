import { NavbarDemo } from "@/components/Navbar";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { div } from "framer-motion/client";
import { FeaturesSectionDemo } from "@/components/Featmain";
import Footer from "@/components/Footer";
import { NavbarButton } from "@/components/ui/resizable-navbar";
function page() {
  return (
    <div>
      <NavbarDemo />
      <div className=" flex mt-28 ml-14 gap-16">
        <Image
          src="/home.gif"
          width={600}
          height={500}
          alt="img"
          className="rounded-xl"
        />
        <div>
          <p className="w-2xl mt-16">
            <span className="text-lg text-purple-500">
              Discover a Smarter Way
            </span>
            <br></br>
            to Understand Your Health Step into the future of healthcare with
            our platform that bridges technology and medicine. We help you
            better understand your medical journey through features like
            automatic transcription of doctor-patient conversations, simplified
            explanations of medical terms in consent forms, and cancer awareness
            resources in your regional language. Stay informed and safe with
            tools like drug interaction analysis, all designed to make
            healthcare more accessible and understandable for everyone.
          </p>
          <NavbarButton variant="primary" className="mt-6">
            Get Started
          </NavbarButton>
        </div>
      </div>
      <div className="-mt-4 " id="features">
        <FeaturesSectionDemo />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default page;
