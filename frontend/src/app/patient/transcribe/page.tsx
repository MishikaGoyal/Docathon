import { FileUploadDemo } from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { FileUpload } from "@/components/ui/file-upload";
import React from "react";

function page() {
  return (
    <div>
      <div className="flex gap-6 mt-6">
        <img
          src="https://i.pinimg.com/originals/69/18/2d/69182d6b99b01ef12321803cfb30ab57.gif"
          alt=""
          className="mt-12 ml-6 rounded-xl"
        />
        <div>
          <p className="mt-24 mb-6 ">
            Transcribe your conversation now, transcribe now get summary for
            future reference
          </p>
          <FileUploadDemo />
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default page;
