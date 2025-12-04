import React from "react";
import Hero from "@/components/shared/Hero";

const page = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-4xl w-full h-full flex flex-col gap-4 items-center justify-center py-10 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col items-center justify-center gap-1.5">
          <h1 className="font-bold text-4xl">What do you need to study?</h1>
          <p className="text-muted-foreground font-semibold text-lg">
            Upload your PDF and we`ll do the rest
          </p>
        </div>

        {/* Main Component - upload area */}
        <Hero />
      </div>
    </div>
  );
};

export default page;
