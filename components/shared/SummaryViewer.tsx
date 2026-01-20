"use client";

import { marked } from "marked";
import { useState } from "react";
import DOMPurify from "dompurify";
import { DocumentSummary } from "@/types";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

// Configure marked once
marked.use({
  gfm: true,
  breaks: true,
});

const SummaryViewer = ({ summary }: { summary: DocumentSummary }) => {
  const [openSections, setOpenSections] = useState<string[]>([
    summary.sections[0]?.id,
  ]);
  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl p-6 bg-white min-h-screen">
      {/* SaaS Header */}
      <div className="mb-12 flex justify-between items-center border-b border-black/10 pb-6">
        <h1 className="text-2xl font-black tracking-tight">
          {summary.summaryTitle}
        </h1>
      </div>

      {/* The Collapsible Stream */}
      <div className="space-y-8">
        {summary.sections.map((section: any) => {
          const isOpen = openSections.includes(section.id);

          return (
            <div key={section.id} className="group">
              {/* Trigger Header */}
              <Button
                variant="ghost"
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-start gap-3 w-full text-left mb-4 hover:opacity-80 transition-opacity"
              >
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                />
                <h2 className="text-xl font-black tracking-tight">
                  {section.title}
                </h2>
              </Button>

              {/* Collapsible Content */}
              <div
                className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
              `}
              >
                <div
                  className="pl-8 pr-4 py-2 prose prose-invert max-w-none
                  /* Text Styles */
                  prose-p:text-white prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-white prose-strong:font-black
                  
                  /* FIX: List Styles */
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-white
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:text-white"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked.parse(section.content) as string,
                    ),
                  }}
                />
              </div>

              {/* The Bottom Line Separator */}
              <div className="h-px w-full bg-black/10 mt-8" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryViewer;
