import React from "react";
import Image from "next/image";
import { NavbarButton } from "./ui/resizable-navbar";
function Hero() {
  return (
    <div className="">
      <div className=" flex ml-32 mt-16 ">
        <Image
          src="/main.gif"
          width={600}
          height={200}
          alt="pic"
          className="rounded-2xl mr-16 mt-6"
        />

        <div>
          <p className="text-lg w-xl mt-28 ml-2 mr-4">
            <span className="text-2xl font-bold mb-3">Get started </span>
            <br></br>where technology meets healthcare—empowering you to
            understand medical terms, confidently navigate consent forms, and
            detect conditions like breast cancer early. From transcribing
            doctor-patient conversations to simplifying complex medical
            language, we help you take control of your health.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
