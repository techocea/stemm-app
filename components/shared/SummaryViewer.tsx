"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useMemo } from "react";
import { DocumentSummary } from "@/types";
import { Button } from "../ui/button";

// Configure marked once
marked.use({
  gfm: true,
  breaks: true,
});

// Markdown → Safe HTML
const parseMarkdown = (markdown: string) => {
  const raw = marked.parse(markdown);
  return DOMPurify.sanitize(raw as string);
};

const SummaryViewer = ({ summary }: { summary: DocumentSummary }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeContent = useMemo(() => {
    return parseMarkdown(summary.sections[activeIndex].content);
  }, [activeIndex, summary.sections]);

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">{summary.summaryTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT PANEL — Show Active Content */}
        <div className="h-fit lg:col-span-2 border rounded-sm bg-white p-4">
          <div
            dangerouslySetInnerHTML={{ __html: activeContent }}
            className="prose prose-sm max-w-none text-[#374151]"
          />
        </div>

        {/* RIGHT PANEL — Section Titles */}
        <div className="space-y-2">
          {summary.sections.map((section, index) => {
            const isActive = activeIndex === index;

            return (
              <Button
                variant={"outline"}
                size="lg"
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`truncate w-full flex flex-col items-start text-left p-4 rounded-sm border
                  transition
                  ${
                    isActive
                      ? "bg-white/80 border-gray-400"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <span className="uppercase text-xs text-[#374151] font-medium tracking-widest">
                  section {index + 1}
                </span>
                <span className="font-medium text-sm text-[#374151]">{section.title}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
