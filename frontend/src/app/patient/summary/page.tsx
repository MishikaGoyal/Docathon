import FileUploadDemo from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { FileUpload } from "@/components/ui/file-upload";
import React from "react";

function page() {
  return (
    <div>
      <div className="flex gap-8 mt-6">
        <div className="ml-8 flex-1 max-w-2xl">
          <p className="mt-24 mb-6 ml-8">
            Transcribe your conversation now, transcribe now get summary for
            future reference
          </p>
          <FileUploadDemo />
        </div>

        <div className="mt-16 ml-4">
          <img
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ3cG11Mnp5dmQ0Nzd3MWg0b2RqdHhlYWptcGZ2eG0xZzhxbzAwaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DET8El3bpXNjKbwshW/giphy.gif"
            alt="Predicting GIF"
            className="w-[600px] h-[600px] rounded-xl object-contain"
          />
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default page;
