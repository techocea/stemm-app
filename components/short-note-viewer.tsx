'use client';

import React from 'react';
import { ShortNotes } from '@/types/exam';
import { MathText } from './math-text';
import { CodeBlock } from './code-block';
import { DiagramBlock } from './diagram-block';
import {
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Download,
  Calendar,
  Layers,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';

interface ShortNotesViewProps {
  notes: ShortNotes;
  onAskTutor?: (context: string) => void;
  onExport?: () => void;
}

export default function ShortNotesView({ notes, onAskTutor, onExport }: ShortNotesViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Short Notes Executive Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                DYNAMIC SHORT NOTES
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {notes.createdAt}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{notes.title}</h1>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
              Domain: {notes.subject}
            </p>
          </div>

          {/* {onExport && (
            <button
              onClick={onExport}
              className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Notes</span>
            </button>
          )} */}
        </div>

        {/* Executive Overview */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>High-Yield Executive Summary:</span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
            <MathText text={notes.overview} />
          </p>
        </div>
      </div>

      {/* Key Definitions Matrix */}
      {notes.keyDefinitions && notes.keyDefinitions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Essential Technical Definitions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.keyDefinitions.map((def, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-colors space-y-1.5"
              >
                <span className="text-xs font-bold text-indigo-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {def.term}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <MathText text={def.definition} />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Technical Sections */}
      {notes.sections && notes.sections.length > 0 && (
        <div className="space-y-6">
          {notes.sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200/60">
                    {sIdx + 1}
                  </span>
                  {section.heading}
                </h3>

                {onAskTutor && (
                  <button
                    onClick={() => onAskTutor(`Topic: ${section.heading}\nSummary: ${section.bullets.join(' ')}`)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Explain Section</span>
                  </button>
                )}
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    <span>
                      <MathText text={bullet} />
                    </span>
                  </li>
                ))}
              </ul>

              {/* LaTeX Formula */}
              {section.latexFormula && (
                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl font-mono text-xs text-indigo-950">
                  <MathText text={section.latexFormula} />
                </div>
              )}

              {/* Code Snippet */}
              {section.codeSnippet && (
                <div className="my-2">
                  <CodeBlock code={section.codeSnippet} />
                </div>
              )}

              {/* Diagram */}
              {section.diagramCode && (
                <div className="my-3">
                  <DiagramBlock code={section.diagramCode} title="System Diagram" />
                </div>
              )}

              {/* Comparison Table */}
              {section.comparisonTable && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <TableIcon className="w-4 h-4 text-indigo-600" />
                    <span>Comparative Analysis</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                        <tr>
                          {section.comparisonTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2.5 border-r border-slate-200 last:border-r-0">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {section.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 border-r border-slate-100 last:border-r-0 text-slate-700 font-medium">
                                <MathText text={cell} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* High Yield Traps & Pitfalls */}
      {notes.highYieldTraps && notes.highYieldTraps.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-amber-200/80 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-amber-950">High-Yield Candidate Traps & Common Exam Errors</h3>
          </div>

          <ul className="space-y-2 text-xs md:text-sm text-amber-900">
            {notes.highYieldTraps.map((trap, tIdx) => (
              <li key={tIdx} className="flex items-start gap-2 leading-relaxed font-medium">
                <span className="text-amber-600 font-bold">⚠️</span>
                <span>
                  <MathText text={trap} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
