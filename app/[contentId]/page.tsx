"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useParams } from "next/navigation"
import NotFound from "@/components/not-found"
import ShortNotesView from "@/components/short-note-viewer"
import ExamPaperView from "@/components/exam-paper-viewer"
import ExamSolverView from "@/components/exam-solution-viewer"

export default function ContentPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const { shortNotesList, examsList } = useAppStore()

  const notes = shortNotesList.find((sn) => sn.id === contentId)
  if (notes) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
          <ArrowLeft /> Back to Home
        </Link>
        <ShortNotesView notes={notes} />
      </div>
    )
  }

  const exam = examsList.find((ex) => ex.id === contentId)
  if (exam) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
          <ArrowLeft /> Back to Home
        </Link>
        {exam.paperType === "past_paper_solution" ? (
          <ExamSolverView exam={exam} />
        ) : (
          <ExamPaperView exam={exam} />
        )}
      </div>
    )
  }

  return <NotFound />
}