import { SummaryStore, DocumentSummary, QuestionSet } from "@/types";
import { create } from "zustand";

export const summaryStore = create<SummaryStore>((set) => ({
  summary: null,
  questions: null,
  setSummary: (data: DocumentSummary) => set({ summary: data }),
  setQuestions: (data: QuestionSet) => set({ questions: data }),
}));
