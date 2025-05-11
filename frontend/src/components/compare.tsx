import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage="https://i.pinimg.com/736x/c3/bd/3c/c3bd3cfcdd1ccd3ecbbabf75bd50a290.jpg"
        secondImage="https://i.pinimg.com/736x/2b/16/91/2b169101c8ebdf55da8004e57b7cba9c.jpg"
        firstImageClassName="object-cover object-left-top w-full"
        secondImageClassname="object-cover object-left-top w-full"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
        autoplay={true}
      />
    </div>
  );
}
