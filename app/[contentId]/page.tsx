"use client"

import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
// import {NotFound} from "@/components/not-found"
import ShortNotesView from "@/components/short-note-viewer"
import ExamPaperView from "@/components/exam-paper-viewer"
import ExamSolverView from "@/components/exam-solution-viewer";

export default function ContentPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const { shortNotesList, examsList } = useAppStore()

  if (contentId.startsWith("sn-")) {
    const notes = shortNotesList.find((sn) => sn.id === contentId)
    // if (!notes) return <NotFound />
    return <ShortNotesView notes={notes} />
  }

  if (contentId.startsWith("model_paper")) {
    const exam = examsList.find((ex) => ex.id === contentId)
    // if (!exam) return <NotFound />
    return <ExamPaperView exam={exam} />
  }

  if (contentId.startsWith("exam-")) {
    const exam = examsList.find((ex) => ex.id === contentId)
    // if (!exam) return <NotFound />
    return <ExamSolverView exam={exam} />
  }

//   return <NotFound />
}
