"use client";

import { QuestionSet } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useState } from "react";

const QuestionsViewer = ({ questions }: { questions: QuestionSet }) => {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(
        questions.questions.length > 0 ? questions.questions[0].id : null
    );

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="p-4 md:p-10 h-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] block mb-2">
                        Comprehension Mastery
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {questions.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        5 high-level synthesis questions to test your deep understanding.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button
                        onClick={() => router.push("/summary")}
                        className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        <ChevronLeft /> Study Notes
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {questions?.questions.map((qa, index) => {
                    const isExpanded = expandedId === qa.id;
                    return (
                        <div
                            key={qa.id}
                            className={`group border transition-all duration-500 rounded-3xl overflow-hidden ${isExpanded
                                ? "border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10"
                                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-400 dark:hover:border-slate-600"
                                }`}
                        >
                            <button
                                onClick={() => toggleExpand(qa.id)}
                                className="w-full p-8 md:p-12 text-left flex items-start gap-8 focus:outline-none"
                            >
                                <span
                                    className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-xl shrink-0 transition-all duration-500 ${isExpanded
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40"
                                        }`}
                                >
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <h3
                                        className={`text-lg md:text-[18px] leading-snug transition-colors duration-300 ${isExpanded
                                            ? "text-indigo-600 font-black dark:text-indigo-400"
                                            : "text-slate-700 font-medium  dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                                            }`}
                                    >
                                        {qa.question}
                                    </h3>
                                    {!isExpanded && (
                                        <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Show Mastery Explanation
                                        </p>
                                    )}
                                </div>
                                <div
                                    className={`mt-3 text-3xl transition-transform duration-700 ${isExpanded
                                        ? "rotate-180 text-indigo-500"
                                        : "text-slate-300 dark:text-slate-700"
                                        }`}
                                >
                                    <ChevronDown />
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-700 ease-in-out ${isExpanded
                                    ? "max-h-[1500px] opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-8 md:px-12 pb-12 pl-8 md:pl-[120px]">
                                    {/* <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-10"></div> */}
                                    <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none">
                                        <div
                                            className="text-slate-600 dark:text-slate-300 leading-[1.8] space-y-6 font-medium bg-slate-50/50 dark:bg-slate-800/30 p-10 rounded-4xl border border-slate-100 dark:border-slate-800"
                                            dangerouslySetInnerHTML={{
                                                __html: qa.answer
                                                    .replace(/\n/g, "<br/>")
                                                    .replace(
                                                        /\*\*(.*?)\*\*/g,
                                                        '<b class="text-indigo-600 dark:text-indigo-400 font-black">$1</b>'
                                                    ),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionsViewer;
