import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <div className="">
      <div className=" flex ml-32 mt-24">
        <Image
          src="/dochero.gif"
          width={800}
          height={600}
          alt="pic"
          className="rounded-2xl mr-16 mt-6"
        />

        <div>
          <p className="text-lg w-xl mt-32 ml-2 mr-4">
            <span className="text-2xl font-bold mb-3">We Are Here </span>
            <br></br>We are committed to working hand-in-hand with you to
            overcome challenges and ensure a healthier, happier life for every
            patient. By harnessing the power of cutting-edge technologies,
            intelligent systems, and collaborative healthcare, we aim to
            streamline your workflow, enhance decision-making, and support
            better outcomes. Together, let’s continue to innovate, learn, and
            grow — shaping the future of medicine through teamwork, compassion,
            and technology.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
