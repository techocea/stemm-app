"use client";

import QuestionsViewer from "@/components/shared/QuestionsViewer";
import { Button } from "@/components/ui/button";
import { summaryStore } from "@/store/store";
import { useRouter } from "next/navigation";

const QuestionsPage = () => {
  const router = useRouter();
  const { questions } = summaryStore();

  if (!questions || !questions.questions || questions.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-6 animate-in fade-in duration-700">
        <div className="text-7xl">🤔</div>
        <h2 className="text-3xl font-black dark:text-white">No Questions Generated</h2>
        <p className="text-slate-500 max-w-sm">Process a document with "Deep Q&A" mode to see questions here.</p>
        <Button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          Go to Library
        </Button>
      </div>
    );
  }

  return <QuestionsViewer questions={questions} />;
};

export default QuestionsPage;
