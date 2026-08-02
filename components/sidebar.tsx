"use client"

import { FileUp, BookOpen, ChevronRight } from "lucide-react"
import React, { useState } from "react"

const Sidebar = () => {
  const [targetSubject, setTargetSubject] = useState<STEMDomain>(
    "Computer Science & Software Engineering"
  );
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

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

  return (
    <aside className="hidden w-80 min-h-screen shrink-0 flex-col justify-between space-y-6 overflow-y-auto border-r border-slate-200 bg-white p-5 md:flex lg:flex">
      <div className="space-y-6 mt-4">
        {/* Domain Selector */}
        <div>
          <label className="mb-2 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            1. Select Academic Domain
          </label>
          <select
            value={targetSubject}
            onChange={(e) => setTargetSubject(e.target.value as STEMDomain)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Computer Science & Software Engineering">
              💻 Computer Science & Software Eng
            </option>
            <option value="Mathematics & Physics">
              🔬 Mathematics & Physics
            </option>
            <option value="Chemistry & Biology">🧪 Chemistry & Biology</option>
            <option value="Management & Finances">
              💼 Management & Finances
            </option>
          </select>
        </div>

        {/* Document Source Configurator */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            2. Input PDF
          </label>

          <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors hover:border-indigo-500">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <FileUp className="mx-auto mb-1.5 h-6 w-6 text-indigo-600" />
            {pdfFileName ? (
              <span className="block truncate text-xs font-bold text-emerald-700">
                {pdfFileName}
              </span>
            ) : (
              <span className="block text-xs font-medium text-slate-600">
                Click or drop PDF here
              </span>
            )}
          </div>
        </div>

        {/* Processing Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => handleGenerateContent("short_notes")}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {isLoading && activeTab === "short_notes" ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Synthesizing Short Notes...</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 text-emerald-200" />
                <span>Synthesize Dynamic Short Notes</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleGenerateContent("model_paper")}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {isLoading && activeTab !== "short_notes" ? (
              <>
                {/* <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> */}
                <span>Synthesizing Exam...</span>
              </>
            ) : (
              <>
                {/* <Sparkles className="h-4 w-4 text-amber-300" /> */}
                <span>Synthesize Model Exam Paper</span>
              </>
            )}
          </button>

          {generateError && (
            <p className="mt-2 text-[11px] font-medium text-rose-600">
              {generateError}
            </p>
          )}
        </div>

        {/* Generated Short Notes History */}
        {/* {shortNotesList.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Generated Short Notes ({shortNotesList.length})
            </span>

            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {shortNotesList.map((sn) => (
                <button
                  key={sn.id}
                  onClick={() => {
                    setCurrentNotes(sn)
                    setActiveTab("short_notes")
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-[11px] transition-all ${
                    currentNotes?.id === sn.id && activeTab === "short_notes"
                      ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-950"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate pr-2">{sn.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Saved Exam Library History */}
        {/* <div className="space-y-2 border-t border-slate-100 pt-3">
          <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Saved Examination Papers
          </span>

          <div className="max-h-40 space-y-1.5 overflow-y-auto">
            {examsList.length > 0 ? (
              examsList.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setCurrentExam(ex)
                    setActiveTab(
                      ex.paperType === "past_paper_simulation"
                        ? "past_paper_simulation"
                        : "model_paper"
                    )
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-[11px] transition-all ${
                    currentExam?.id === ex.id && activeTab !== "short_notes"
                      ? "border-amber-300 bg-amber-50 font-bold text-amber-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate pr-2">{ex.title}</span>
                  <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                    {ex.paperType === "past_paper_simulation"
                      ? "Simulated"
                      : "Model"}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-1 text-[11px] font-normal text-slate-400">
                No exam papers generated yet.
              </p>
            )}
          </div>
        </div> */}
      </div>
    </aside>
  )
}

export default Sidebar
