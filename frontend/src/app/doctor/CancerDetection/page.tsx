import FileUploadDemo from "@/components/cancer/FileUpload";
import Footer from "@/components/Footer";
import { FileUpload } from "@/components/ui/file-upload";
import React from "react";

function page() {
  return (
    <div>
      <div className="flex gap-6 mt-6">
        <img
          src="https://i.pinimg.com/736x/9b/bd/81/9bbd81f0ecd3b6a6dd1c7cd6e72ae858.jpg"
          alt=""
          className="mt-12 ml-6 rounded-xl"
        />
        <div>
          <p className="mt-24 mb-6 ">
            Detect Breast Cancer with the help of AI that provides fast and easy
            results.
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
