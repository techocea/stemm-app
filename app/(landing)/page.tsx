"use client";

import { useState } from "react";
import { FEATURES } from "../utils/constants";
import { Button } from "@/components/ui/button";
import WaitingListModal from "@/components/shared/WaitingListModal";

const Landing = () => {
    const [activeTab, setActiveTab] = useState<"summary" | "questions">(
        "summary"
    );

    return (
        <main className="w-full">
            <section className="relative pt-16 pb-20 border-b border-slate-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full lg:max-w-7xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                </div>

                <div className="lg:max-w-5xl xl:max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4 lg:mb-8 animate-bounce">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                        Revolutionizing how students study
                    </div>

                    <h1 className="text-4xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Turn Messy Notes into <br />
                        <span className="bg-linear-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Exam Success
                        </span>
                    </h1>

                    <p className="text-sm lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Upload your lecture PDFs and let SmpleyLearnIt's AI create precise
                        summaries and custom practice questions. Spend less time formatting,
                        more time learning.
                    </p>

                    <WaitingListModal text="get early access" icon={true} />

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://picsum.photos/seed/${i + 20}/64/64`}
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                    alt="user"
                                />
                            ))}
                        </div>
                        <p>Join the Waiting list for early access</p>
                    </div>
                </div>
            </section>

            <section id="preview" className="py-20 bg-slate-50">
                <div className="lg:max-w-5xl xl:max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            See the Magic in Action
                        </h2>
                        <p className="text-slate-600 text-sm lg:text-xl">
                            We turn your 50-page PDF into a 5-page masterclass.
                        </p>
                    </div>

                    <div className="lg:max-w-3xl mx-auto w-full flex justify-center">
                        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("summary")}
                                    className={`flex-1 py-4 rounded-bl-none rounded-br-none hover:bg-transparent text-xs lg:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "summary"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    Clear Summary
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("questions")}
                                    className={`flex-1 py-4 rounded-bl-none rounded-br-none hover:bg-transparent text-xs lg:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "questions"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    Exam Questions
                                </Button>
                            </div>

                            <div className="p-8 min-h-[400px]">
                                {activeTab === "summary" ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h3 className="text-2xl font-bold text-indigo-600 mb-4 italic">
                                            The Summary: Cell Division
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">
                                                    1. Key Concepts
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                                                    Mitosis consists of four stages: Prophase, Metaphase,
                                                    Anaphase, and Telophase. Focus on the chromosomal
                                                    alignment during Metaphase as it's a frequent exam
                                                    topic.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">
                                                    2. Crucial Definitions
                                                </h4>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm lg:text-base">
                                                    <li>
                                                        <span className="font-semibold text-slate-700">
                                                            Cytokinesis:
                                                        </span>{" "}
                                                        The final split of the cytoplasm.
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold text-slate-700">
                                                            Chromatid:
                                                        </span>{" "}
                                                        One half of a duplicated chromosome.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h3 className="text-2xl font-bold text-indigo-600 mb-4 italic">
                                            Mock Quiz: Biology 101
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="font-semibold text-slate-800 mb-3">
                                                    Q1: Describe what happens to sister chromatids during
                                                    Anaphase.
                                                </p>
                                                <div className="p-3 bg-white rounded border border-indigo-200 text-sm text-slate-700 leading-relaxed">
                                                    <span className="font-bold text-indigo-600">
                                                        Answer:
                                                    </span>{" "}
                                                    During anaphase, the sister chromatids are pulled
                                                    apart by the spindle fibers and move toward opposite
                                                    poles of the cell. This ensures that each new daughter
                                                    cell will receive an identical set of chromosomes.
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="font-semibold text-slate-800 mb-3">
                                                    Q2: What is the primary function of the Mitochondria
                                                    in eukaryotic cells?
                                                </p>
                                                <div className="p-3 bg-white rounded border border-indigo-200 text-sm text-slate-700 leading-relaxed">
                                                    <span className="font-bold text-indigo-600">
                                                        Answer:
                                                    </span>{" "}
                                                    Often called the "powerhouse" of the cell,
                                                    mitochondria perform cellular respiration to convert
                                                    biochemical energy from nutrients into adenosine
                                                    triphosphate (ATP), which powers the cell's metabolic
                                                    activities.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                                <span className="text-xs text-slate-500 italic">
                                    "This would have taken me 4 hours to write by hand."
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-20 bg-white">
                <div className="mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            Focus on Understanding
                        </h2>
                        <p className="text-slate-600 text-sm lg:text-xl max-w-2xl mx-auto">
                            We handle the organization so you can focus on mastering the
                            material.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 lg:max-w-5xl mx-auto w-full">
                        {FEATURES.map((f, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl hover:bg-indigo-50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">
                                    {f.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-xs">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="cta" className="py-20 bg-indigo-600">
                <div className="max-container px-6 text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Ace Your Next Exam?
                    </h2>
                    <p className="text-indigo-100 text-sm lg:text-xl max-w-2xl mx-auto">
                        Join 2,000+ students who are already on the waitlist for
                        SmpleyLearnIt. No more cramming, just smart learning.
                    </p>
                    <WaitingListModal text="get early access now" icon={true} />
                </div>
            </section>
        </main>
    );
};

export default Landing;
