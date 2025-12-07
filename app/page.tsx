import React from "react";
import Hero from "@/components/shared/Hero";

const page = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="lg:max-w-5xl w-full h-full flex flex-col gap-4 items-center justify-center pt-8 pb-10 px-4 sm:px-6 lg:px-0">
        <div className="flex max-sm:text-center max-sm:items-center max-sm:justify-center w-full flex-col items-center justify-center gap-1.5">
          <h1 className="font-bold sm:text-3xl text-4xl">Summarize PDFs
            in seconds</h1>
          <p className="text-muted-foreground font-semibold lg:text-lg sm:text-sm">
            Upload your PDF and let AI do the rest
          </p>
        </div>

        {/* Main Component - upload area */}
        <Hero />
      </div>
    </div>
  );
};

export default page;
