"use client";

import SummaryViewer from "@/components/shared/SummaryViewer";
import { summaryStore } from "@/store/store";

const SummaryPage = () => {
  const { summary } = summaryStore();

  if (!summary) {
    return <p>No summary available</p>;
  }

  return <SummaryViewer summary={summary} />;
};

export default SummaryPage;
