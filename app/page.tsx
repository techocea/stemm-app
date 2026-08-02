"use client"

import ExamPaperView from "@/components/exam-paper-viewer"
import { ShortNotesView } from "@/components/short-note-viewer"
import Sidebar from "@/components/sidebar"
import { useAppStore } from "@/lib/store"
import { ExamPaper, ShortNotes, STEMDomain } from "@/types"
import {
  FileUp,
  Award,
  Sparkles,
  BarChart2,
  Download,
  GraduationCap,
  BookOpen,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

export default function Page() {
  const {
    targetSubject,
    setTargetSubject,
    activeTab,
    setActiveTab,
    shortNotesList,
    addShortNotes,
    examsList,
    addExam,
    currentNotes,
    currentExam,
  } = useAppStore()

  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF document.")
      return
    }

    setPdfFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      setPdfBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateContent = async (
    targetTabOverride?: "short_notes" | "model_paper" | "past_paper_solution"
  ) => {
    const targetTab = targetTabOverride
    setIsLoading(true)
    setGenerateError(null)

    let contentPayload = ""

    if (!pdfBase64) {
      setGenerateError("Please select a PDF document to process.")
      setIsLoading(false)
      return
    }

    try {
      if (targetTab === "short_notes") {
        const response = await fetch("/api/generate-short-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentPayload,
            pdfBase64,
            subject: targetSubject,
            title: pdfFileName || "Uploaded Document",
          }),
        })

        const data = await response.json()
        if (!response.ok || data.error) {
          throw new Error(
            data.error ||
              "Failed to generate dynamic short notes from uploaded content."
          )
        }

        const newNotes: ShortNotes = {
          id: data.id || `sn-${Date.now()}`,
          title:
            data.title || pdfFileName || `${targetSubject} Dynamic Short Notes`,
          subject: targetSubject,
          createdAt: new Date().toISOString().split("T")[0],
          overview: data.overview || "High-Yield Executive Summary",
          keyDefinitions: data.keyDefinitions || [],
          sections: data.sections || [],
          highYieldTraps: data.highYieldTraps || [],
        }

        addShortNotes(newNotes)
        // console.log("Saved Short Notes to Storage:", newNotes)
        setActiveTab("short_notes")
      } else {
        const isPastPaper = targetTab === "past_paper_solution"
        const response = await fetch("/api/generate-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lectureText: contentPayload,
            pdfBase64: activeTab === "pdf" ? pdfBase64 : undefined,
            targetSubject,
            docType: isPastPaper ? "past_paper" : "lecture_notes",
            generationMode: isPastPaper
              ? "weighted_model_paper"
              : "model_paper",
            showAnswers: true,
            questionCount: 6,
          }),
        })

        const data = await response.json()
        if (!response.ok || data.error) {
          throw new Error(
            data.error || "Failed to generate model examination paper."
          )
        }

        const newExam: ExamPaper = {
          id: data.id || `exam-${Date.now()}`,
          title:
            data.title ||
            `${targetSubject} ${isPastPaper ? "Simulated Past Paper" : "Model Examination"}`,
          subject: targetSubject,
          paperType: isPastPaper ? "past_paper_solution" : "model_paper",
          totalMarks: data.totalMarks || 50,
          durationMinutes: data.durationMinutes || 120,
          instructions: data.instructions || [
            "Answer all questions in full technical detail.",
            "Ensure math expressions use standard LaTeX syntax.",
            "Include full code and step-by-step marking rubrics.",
          ],
          alignmentMatrix: data.alignmentMatrix || [
            {
              topic: "Core Architectural Concepts",
              frequencyPercentage: 40,
              historicalWeight: "High Frequency",
              keyTrap: "Confusing stack frame limits with asymptotic bounds",
              corePrinciple: "Structural & Complexity Trade-Offs",
            },
          ],
          mcqs: data.mcqs || [],
          shortAnswers: data.shortAnswers || [],
          deepDiveQuestions: data.deepDiveQuestions || [],
          questions: data.questions || [],
          createdAt: new Date().toISOString().split("T")[0],
        }

        addExam(newExam)
        setActiveTab(targetTab)
      }
    } catch (err: any) {
      setGenerateError(
        err.message || "An unexpected error occurred during generation."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div>
        {activeTab === "short_notes" && currentNotes ? (
          <ShortNotesView
            notes={currentNotes}
            onAskTutor={(ctx) => openTutorForQuestion("Explain Section", ctx)}
            onExport={() => setIsExportOpen(true)}
          />
        ) : (activeTab === "model_paper" ||
            activeTab === "past_paper_simulation") &&
          currentExam ? (
          <ExamPaperView
            exam={currentExam}
            onAskTutor={(q, ctx) => openTutorForQuestion(q, ctx)}
          />
        ) : (
          <div className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:p-10">
            {/* Hero / Landing Header */}
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                STEM Academic Studio
              </h2>
              <p className="mx-auto max-w-lg text-xs leading-relaxed font-medium text-slate-500 md:text-sm">
                Upload your lecture slides, syllabus, or past papers to generate
                high-yield dynamic short notes and university-standard model
                examination papers.
              </p>
            </div>

            {/* Direct Upload & Generator Box */}
            <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex flex-col items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:flex-row">
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    Academic Domain
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Target subject for AI synthesis
                  </span>
                </div>
                <select
                  value={targetSubject}
                  onChange={(e) =>
                    setTargetSubject(e.target.value as STEMDomain)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-auto"
                >
                  <option value="Computer Science & Software Engineering">
                    💻 Computer Science & Software Eng
                  </option>
                  <option value="Mathematics & Physics">
                    🔬 Mathematics & Physics
                  </option>
                  <option value="Chemistry & Materials Science">
                    🧪 Chemistry & Materials Science
                  </option>
                  <option value="Biology & Medicine">
                    🧬 Biology & Medicine
                  </option>
                </select>
              </div>

              {/* Input Source Selector */}
              <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-[11px]">
                <button
                  onClick={() => setActiveTab("short_notes")}
                  className={`rounded-lg py-1.5 font-bold transition-all ${
                    activeTab === "short_notes"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Short Notes
                </button>
                <button
                  onClick={() => setActiveTab("model_paper")}
                  className={`rounded-lg py-1.5 font-bold transition-all ${
                    activeTab === "model_paper"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Model Paper
                </button>
                <button
                  onClick={() => setActiveTab("past_paper_solution")}
                  className={`rounded-lg py-1.5 font-bold transition-all ${
                    activeTab === "past_paper_solution"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Past Paper
                </button>
              </div>

              {/* PDF Dropzone / Text Area */}
              <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-indigo-200 bg-white p-6 text-center transition-colors hover:border-indigo-500">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <FileUp className="mx-auto mb-2 h-8 w-8 text-indigo-600" />
                {pdfFileName ? (
                  <span className="block truncate text-xs font-bold text-emerald-700">
                    {pdfFileName}
                  </span>
                ) : (
                  <div>
                    <span className="block text-xs font-bold text-slate-800">
                      Click or drag & drop PDF here
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">
                      Supports lecture notes, slides, or past paper PDFs
                    </span>
                  </div>
                )}
              </div>

              {/* Primary CTA Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleGenerateContent(activeTab)}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isLoading && activeTab === "short_notes" ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>
                        Generating{" "}
                        {activeTab === "short_notes"
                          ? "Short Notes"
                          : activeTab === "model_paper"
                            ? "Model Exam Paper"
                            : "Past Paper Solution"}
                      </span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 text-emerald-200" />
                      <span>
                        Generate{" "}
                        {activeTab === "short_notes"
                          ? "Short Notes"
                          : activeTab === "model_paper"
                            ? "Model Exam Paper"
                            : "Past Paper Solution"}
                      </span>
                    </>
                  )}
                </button>

                {generateError && (
                  <p className="mt-2 border-l-2 border-rose-600 bg-rose-200 p-4 text-xs font-medium text-rose-600">
                    {generateError}
                  </p>
                )}
              </div>
            </div>

            {/* High-Yield Features Grid */}
            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
              <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>Bold Key Terms</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Every note item automatically bolds primary keywords at the
                  start for immediate scannability.
                </p>
              </div>

              <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>LaTeX & Code Rendering</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Renders mathematical equations, formulas, and code blocks
                  using native KaTeX formatting.
                </p>
              </div>

              <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>University Model Papers</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Generates complete examination papers with step-by-step
                  solutions and marking rubrics.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
