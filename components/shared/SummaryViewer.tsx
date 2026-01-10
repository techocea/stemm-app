"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useMemo } from "react";
import { DocumentSummary } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Configure marked once
marked.use({
  gfm: true,
  breaks: true,
});

const SummaryViewer = ({ summary }: { summary: DocumentSummary }) => {
  const router = useRouter();

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    summary?.sections?.[0]?.id || null
  );

  const parsedContent = useMemo(() => {
    const section =
      summary?.sections?.find((s) => s.id === activeSectionId) ||
      summary?.sections?.[0];
    if (!section) return "";

    const rawHtml = marked.parse(section.content) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [summary, activeSectionId]);

  const activeSection =
    summary.sections.find((s) => s.id === activeSectionId) ||
    summary.sections[0];

  return (
    <div className="px-4 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white max-w-xl">
            {summary.summaryTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Definitive University Notes
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            onClick={() => router.push("/questions")}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
          >
            SWITCH TO Q&A
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Module Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-10">
          {summary.sections.map((section, idx) => (
            <div
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`text-left px-4 md:p-4 rounded-3xl border-2 transition-all relative overflow-hidden group ${activeSectionId === section.id
                ? "border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-indigo-500 hover:bg-white dark:hover:border-slate-700"
                }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center ${activeSectionId === section.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}
                >
                  {idx + 1}
                </span>
                <h4
                  className={`font-black text-sm transition-colors ${activeSectionId === section.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                    }`}
                >
                  {section.title}
                </h4>
              </div>
              {/* <div
                className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-medium 
             prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    marked.parse(
                      section.content.substring(0, 150) + "..."
                    ) as string
                  ),
                }}
              /> */}
            </div>
          ))}

          <div className="mt-6 p-8 bg-slate-900 dark:bg-indigo-950 rounded-3xl text-white shadow-xl shadow-slate-900/20">
            <h4 className="font-black text-lg mb-2 flex items-center gap-2">
              <span>🚀</span> Exam Mode
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed opacity-80 mb-6">
              Convert these summary into a customized practice exam instantly.
            </p>
            <Button size="icon-lg" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black text-xs transition-all">
              Generate Exam ✨
            </Button>
          </div>
        </div>

        {/* Dynamic notes Content */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="mb-12">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] block mb-4">
                Mastery Module{" "}
                {(summary.sections.indexOf(activeSection) ?? -1) + 1}
              </span>
              <h1 className="text-lg md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {activeSection?.title}
              </h1>
            </div>

            <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none mb-16">
              <div
                className="text-slate-700 dark:text-slate-300 font-medium"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-slate-900 dark:text-slate-100 font-black text-xl mb-8 flex items-center gap-3">
                <span className="text-2xl">🧠</span> Essential Vocabulary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeSection.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black shrink-0">
                      {i + 1}
                    </span>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
