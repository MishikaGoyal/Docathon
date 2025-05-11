import { NavbarDemo } from "@/components/Navbar";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { div } from "framer-motion/client";
import { FeaturesSectionDemo } from "@/components/Featmain";
import Footer from "@/components/Footer";

function page() {
  return (
    <div>
      <NavbarDemo />
      <div className="mt-28 ml-14">
        <Image
          src="/home.gif"
          width={600}
          height={500}
          alt="img"
          className="rounded-xl"
        />
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
