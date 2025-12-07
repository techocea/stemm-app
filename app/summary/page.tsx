"use client";

import SummaryViewer from "@/components/shared/SummaryViewer";
import { summaryStore } from "@/store/store";
import { redirect } from "next/navigation";

const SummaryPage = () => {
  const { summary } = summaryStore();

  if (!summary) {
    return redirect("/");
  }

  return <SummaryViewer summary={summary} />;
};

export default SummaryPage;
