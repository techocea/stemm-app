'use client';

import React, { useState } from 'react';
import { ExamPaper } from '@/types/exam';
import { MathText } from './math-text';
import { CodeBlock } from './code-block';
import { DiagramBlock } from './diagram-block';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Clock,
  FileCheck,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart2,
  AlertTriangle,
} from 'lucide-react';

interface ExamPaperViewProps {
  exam: ExamPaper;
  onAskTutor?: (questionText: string, context: string) => void;
}

export default function ExamPaperView({ exam, onAskTutor }: ExamPaperViewProps) {
  const [showAllSolutions, setShowAllSolutions] = useState(true);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});
  const [expandedRubrics, setExpandedRubrics] = useState<Record<string, boolean>>({});
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});

  const toggleReveal = (qId: string) => {
    setRevealedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const toggleRubric = (qId: string) => {
    setExpandedRubrics((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleSelectMCQ = (mcqId: string, optionIdx: number) => {
    setMcqAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
  };

  const isRevealed = (qId: string) => showAllSolutions || !!revealedQuestions[qId];

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exam, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${exam.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  // Consolidate questions if they come from mcqs, shortAnswers, deepDiveQuestions, or questions array
  const allStructuredQuestions = [
    ...(exam.shortAnswers || []),
    ...(exam.deepDiveQuestions || []),
    ...(exam.questions || []),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Official Exam Paper Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {exam.paperType === 'past_paper_simulation' ? 'Simulated Past Paper' : 'University Model Paper'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Ref: {exam.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{exam.title}</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-1">
              Subject: {exam.subject} • Date: {exam.createdAt}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Marks</span>
              <span className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                {exam.totalMarks}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Duration</span>
              <span className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-indigo-600" />
                {exam.durationMinutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Candidate Instructions */}
        {exam.instructions && exam.instructions.length > 0 && (
          <div className="mt-4 pt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Candidate Examination Directives:
            </h4>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
              {exam.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAllSolutions(!showAllSolutions)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                showAllSolutions
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showAllSolutions ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Candidate Test Mode (Hide Solutions)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal All Solutions & Step Rubrics</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Exam Paper</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Paper JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Alignment Matrix (Feature C) */}
      {exam.alignmentMatrix && exam.alignmentMatrix.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Historical Curriculum Alignment Matrix</h2>
              <p className="text-xs text-slate-500">
                Frequency analysis and historical exam weightings synthesized from past paper archives.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">Curriculum Topic</th>
                  <th className="p-3 border-r border-slate-200 w-28 text-center">Historical Frequency</th>
                  <th className="p-3 border-r border-slate-200 w-36">Exam Weighting</th>
                  <th className="p-3 border-r border-slate-200">High-Yield Core Principle</th>
                  <th className="p-3">Common Candidate Trap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exam.alignmentMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800 border-r border-slate-100">
                      {item.topic}
                    </td>
                    <td className="p-3 text-center border-r border-slate-100">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold font-mono">
                        {item.frequencyPercentage}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-100 font-medium">
                      {item.historicalWeight}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-100">
                      <MathText text={item.corePrinciple} />
                    </td>
                    <td className="p-3 text-amber-900 bg-amber-50/40">
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <MathText text={item.keyTrap} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section A: Multiple Choice Questions */}
      {exam.mcqs && exam.mcqs.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Section A: Multiple Choice Questions (MCQs)
              </h3>
              <p className="text-xs text-slate-500">Select option for instant candidate self-testing feedback.</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-lg border border-amber-200">
              {exam.mcqs.length * 2} MARKS
            </span>
          </div>

          <div className="space-y-6">
            {exam.mcqs.map((mcq, mIdx) => {
              const selectedOpt = mcqAnswers[mcq.id];
              const isCorrect = selectedOpt === mcq.correctAnswerIndex;
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div key={mcq.id || mIdx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-indigo-900 bg-indigo-50 px-2 py-1 rounded">
                      MCQ {mcq.questionNumber || mIdx + 1} [{mcq.marks || 2} Marks]
                    </span>
                  </div>

                  <div className="text-xs md:text-sm font-semibold text-slate-800">
                    <MathText text={mcq.questionText} />
                  </div>

                  {mcq.diagramCode && (
                    <div className="my-2">
                      <DiagramBlock code={mcq.diagramCode} title="MCQ System Diagram" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    {mcq.options.map((opt, oIdx) => {
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';
                      if (hasAnswered) {
                        if (oIdx === mcq.correctAnswerIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (selectedOpt === oIdx) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectMCQ(mcq.id, oIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>
                            <strong className="mr-1.5">{String.fromCharCode(65 + oIdx)}.</strong>
                            <MathText text={opt} />
                          </span>
                          {hasAnswered && oIdx === mcq.correctAnswerIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {hasAnswered && selectedOpt === oIdx && oIdx !== mcq.correctAnswerIndex && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {(hasAnswered || showAllSolutions) && (
                    <div className="mt-2 p-3 rounded-lg bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 space-y-1">
                      <span className="font-bold text-indigo-900 block">
                        Correct Answer: Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}
                      </span>
                      <MathText text={mcq.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Structured Questions (Section B & C) */}
      <div className="space-y-6">
        {allStructuredQuestions.map((q, idx) => {
          const revealed = isRevealed(q.id);
          const showRubric = !!expandedRubrics[q.id];

          return (
            <div
              key={q.id || idx}
              className="bg-white border-l-4 border-l-indigo-600 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      QUESTION {q.questionNumber || idx + 1}
                    </span>
                    {q.section && (
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {q.section}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md">
                    [{q.marks} MARKS]
                  </span>

                  {!showAllSolutions && (
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-1"
                    >
                      {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{revealed ? 'Hide Solution' : 'View Solution'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                <MathText text={q.questionText} />
              </div>

              {/* Optional Math Formula or Code snippet */}
              {q.latexFormula && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-indigo-900">
                  <MathText text={q.latexFormula} />
                </div>
              )}

              {q.codeSnippet && (
                <div className="my-2">
                  <CodeBlock code={q.codeSnippet} />
                </div>
              )}

              {/* Optional Drawn Diagram */}
              {q.diagramCode && (
                <div className="my-3">
                  <DiagramBlock code={q.diagramCode} title="Question Diagram / UML Architecture" />
                </div>
              )}

              {/* Solution & Marking Scheme (If Revealed) */}
              {revealed && (
                <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                  {/* Full-Credit Model Answer */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Full-Credit Model Answer (100% Marks)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700">Exam Board Verified</span>
                    </div>

                    <div className="text-xs text-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed">
                      <MathText text={q.solution} />
                    </div>
                  </div>

                  {/* Marking Scheme / Step-by-step Explanation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Step-By-Step Mark Allocation & Reasoning
                      </span>

                      {q.rubricSteps && q.rubricSteps.length > 0 && (
                        <button
                          onClick={() => toggleRubric(q.id)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <span>{showRubric ? 'Collapse Marking Rubric' : 'View Detailed Marking Rubric'}</span>
                          {showRubric ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      <MathText text={q.explanation} />
                    </div>

                    {/* Step-by-Step Marking Rubric Table */}
                    {showRubric && q.rubricSteps && q.rubricSteps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 animate-in fade-in duration-150">
                        <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Official Examiner Rubric Breakdown:
                        </h5>
                        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-2 border-r border-slate-200">Step / Marking Criteria</th>
                                <th className="p-2 w-24 text-center">Marks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {q.rubricSteps.map((rub, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50">
                                  <td className="p-2 text-slate-700 border-r border-slate-200">
                                    <MathText text={rub.step} />
                                  </td>
                                  <td className="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50">
                                    +{rub.marks}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ask Senior Professor AI button */}
                  {onAskTutor && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onAskTutor(q.questionText, `Solution: ${q.solution}\nRubric: ${q.explanation}`)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Ask Professor AI to explain this step further</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
