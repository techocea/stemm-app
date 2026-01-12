"use client";

import SummaryViewer from "@/components/shared/SummaryViewer";
import { Button } from "@/components/ui/button";
import { summaryStore } from "@/store/store";
import { useRouter } from "next/navigation";

const SummaryPage = () => {
  const router = useRouter();
  const { summary } = summaryStore();

  if (!summary || !summary.sections || summary.sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-6 animate-in fade-in duration-700">
        <div className="text-7xl">📂</div>
        <h2 className="text-3xl font-black dark:text-white">
          No Notes Available
        </h2>
        <p className="text-slate-500 max-w-sm">
          Please return to the library and select a document to process.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          Go to Library
        </Button>
      </div>
    );
  }

  return <SummaryViewer summary={summary} />;
};

export default SummaryPage;
