'use client';

import React, { useState } from 'react';
import { ExamPaper, StructuredQuestion, MultipleChoiceQuestion } from '@/types/exam';
import { MathText } from './math-text';
import { CodeBlock } from './code-block';
import { DiagramBlock } from './diagram-block';
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Clock,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  FileText,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Filter,
  PenTool,
} from 'lucide-react';

interface ExamSolverViewProps {
  exam: ExamPaper;
  onAskTutor?: (questionText: string, context: string) => void;
}

export default function ExamSolverView({ exam, onAskTutor }: ExamSolverViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mcq' | 'structured'>('all');
  const [showAllSolutions, setShowAllSolutions] = useState(true);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});
  const [expandedRubrics, setExpandedRubrics] = useState<Record<string, boolean>>({});
  const [userAttempts, setUserAttempts] = useState<Record<string, string>>({});
  const [checkedAttempts, setCheckedAttempts] = useState<Record<string, boolean>>({});
  const [mcqSelections, setMcqSelections] = useState<Record<string, number>>({});
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

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

  const isRevealed = (qId: string) => showAllSolutions || !!revealedQuestions[qId];

  const handleSelectMCQ = (mcqId: string, optionIdx: number) => {
    setMcqSelections((prev) => ({ ...prev, [mcqId]: optionIdx }));
  };

  const handleCheckAttempt = (qId: string) => {
    setCheckedAttempts((prev) => ({ ...prev, [qId]: true }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# SOLVED EXAM PAPER: ${exam.title}\n`;
    md += `Subject: ${exam.subject} | Total Marks: ${exam.totalMarks}\n\n`;

    if (exam.mcqs && exam.mcqs.length > 0) {
      md += `## Section A: Multiple Choice Questions\n\n`;
      exam.mcqs.forEach((mcq, idx) => {
        md += `### Q${mcq.questionNumber || idx + 1}. ${mcq.questionText}\n`;
        mcq.options.forEach((opt, oIdx) => {
          const isCorrect = oIdx === mcq.correctAnswerIndex;
          md += `- ${String.fromCharCode(65 + oIdx)}. ${opt} ${isCorrect ? '✅ (Correct)' : ''}\n`;
        });
        md += `\n**Explanation:** ${mcq.explanation}\n\n`;
      });
    }

    const structuredQuestions = [
      ...(exam.shortAnswers || []),
      ...(exam.deepDiveQuestions || []),
      ...(exam.questions || []),
    ];

    if (structuredQuestions.length > 0) {
      md += `## Section B: Structured & Model Solutions\n\n`;
      structuredQuestions.forEach((q, idx) => {
        md += `### Question ${q.questionNumber || idx + 1} [${q.marks} Marks]\n`;
        md += `**Question:** ${q.questionText}\n\n`;
        md += `**Model Solution:**\n${q.solution}\n\n`;
        md += `**Marking Scheme & Explanation:**\n${q.explanation}\n\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  const allStructuredQuestions = [
    ...(exam.shortAnswers || []),
    ...(exam.deepDiveQuestions || []),
    ...(exam.questions || []),
  ];

  const totalQuestionsCount = (exam.mcqs?.length || 0) + allStructuredQuestions.length;

  const filteredMCQs = (exam.mcqs || []).filter((mcq) => {
    if (filterType === 'structured') return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      mcq.questionText.toLowerCase().includes(term) ||
      `q${mcq.questionNumber}`.includes(term) ||
      mcq.explanation.toLowerCase().includes(term)
    );
  });

  const filteredStructured = allStructuredQuestions.filter((q) => {
    if (filterType === 'mcq') return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.questionText.toLowerCase().includes(term) ||
      `q${q.questionNumber}`.includes(term) ||
      q.solution.toLowerCase().includes(term) ||
      q.explanation.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Solved Exam Main Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                EXTRACTED & SOLVED PDF EXAM
              </span>
              <span className="text-xs text-slate-400 font-mono">Ref: {exam.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{exam.title}</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-1">
              Domain: {exam.subject} • Created: {exam.createdAt}
            </p>
          </div>

          {/* Quick Metrics Badge Container */}
          <div className="flex items-center gap-3 bg-purple-50/60 border border-purple-100 rounded-xl p-3">
            <div className="text-center px-3 border-r border-purple-200/80">
              <span className="text-[10px] uppercase text-purple-700 font-bold block">Total Questions</span>
              <span className="text-lg font-bold text-purple-950 flex items-center justify-center gap-1">
                <FileText className="w-4 h-4 text-purple-600" />
                {totalQuestionsCount}
              </span>
            </div>
            <div className="text-center px-3 border-r border-purple-200/80">
              <span className="text-[10px] uppercase text-purple-700 font-bold block">Total Marks</span>
              <span className="text-lg font-bold text-purple-950 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                {exam.totalMarks}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-purple-700 font-bold block">Duration</span>
              <span className="text-lg font-bold text-purple-950 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-purple-600" />
                {exam.durationMinutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowAllSolutions(!showAllSolutions)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                showAllSolutions
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showAllSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAllSolutions ? 'Hide All Solutions' : 'Reveal All Solutions'}</span>
            </button>

            {/* <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMarkdown ? 'Copied Markdown!' : 'Copy Answers'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Paper</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Section A: Multiple Choice Questions (if present) */}
      {filteredMCQs.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Multiple Choice Questions & Answers
              </h3>
              <p className="text-xs text-slate-500">Click any option to test your understanding before checking official answer.</p>
            </div>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 font-bold text-xs rounded-lg border border-purple-200">
              {filteredMCQs.length * 2} MARKS
            </span>
          </div>

          <div className="space-y-6">
            {filteredMCQs.map((mcq, mIdx) => {
              const selectedOpt = mcqSelections[mcq.id];
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div key={mcq.id || mIdx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-100">
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
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-purple-300';
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
                    <div className="mt-2 p-3 rounded-lg bg-purple-50/80 border border-purple-100 text-xs text-purple-950 space-y-1">
                      <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Official Answer: Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}
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

      {/* Section B: Extracted Questions & Model Solutions */}
      <div className="space-y-6">
        {filteredStructured.map((q, idx) => {
          const revealed = isRevealed(q.id);
          const showRubric = !!expandedRubrics[q.id];
          const hasCheckedAttempt = !!checkedAttempts[q.id];

          return (
            <div
              key={q.id || idx}
              className="bg-white border-l-4 border-l-purple-600 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              {/* Question Header Bar */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      QUESTION {q.questionNumber || idx + 1}
                    </span>
                    {q.section && (
                      <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
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
                      className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100 flex items-center gap-1"
                    >
                      {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{revealed ? 'Hide Solution' : 'View Model Answer'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                <MathText text={q.questionText} />
              </div>

              {/* Formula or Code if present */}
              {q.latexFormula && (
                <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl font-mono text-xs text-purple-950">
                  <MathText text={q.latexFormula} />
                </div>
              )}

              {q.codeSnippet && (
                <div className="my-2">
                  <CodeBlock code={q.codeSnippet} />
                </div>
              )}

              {/* Diagram if present */}
              {q.diagramCode && (
                <div className="my-3">
                  <DiagramBlock code={q.diagramCode} title="Question Architecture / Diagram" />
                </div>
              )}

              {/* Practice Answer Draft Box for Candidate */}
              {/* {!showAllSolutions && !revealed && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-purple-600" />
                      Candidate Practice Draft (Optional)
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Self-Test Before Checking Answer</span>
                  </div>
                  <textarea
                    value={userAttempts[q.id] || ''}
                    onChange={(e) => setUserAttempts({ ...userAttempts, [q.id]: e.target.value })}
                    placeholder="Type your attempt or steps here..."
                    rows={2}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCheckAttempt(q.id)}
                      className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors shadow-2xs"
                    >
                      Compare with Official Answer
                    </button>
                  </div>
                </div>
              )} */}

              {/* Generated Solution & Marking Scheme */}
              {revealed && (
                <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                  {/* Model Answer Box */}
                  <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        100% Full-Credit Generated Model Answer
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Grounded in PDF
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed">
                      <MathText text={q.solution} />
                    </div>
                  </div>

                  {/* Examiner Marking Scheme / Explanation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        Step-By-Step Mark Allocation & Examiner Notes
                      </span>

                      {q.rubricSteps && q.rubricSteps.length > 0 && (
                        <button
                          onClick={() => toggleRubric(q.id)}
                          className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                        >
                          <span>{showRubric ? 'Hide Rubric Table' : 'Show Rubric Breakdown'}</span>
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
                          Examiner Mark Allocation Rubric:
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
                        onClick={() => onAskTutor(q.questionText, `Question: ${q.questionText}\nSolution: ${q.solution}\nRubric: ${q.explanation}`)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Ask AI Professor to clarify or break down this solution step-by-step</span>
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
