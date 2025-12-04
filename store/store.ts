import { SummaryStore, DocumentSummary } from "@/types";
import { create } from "zustand";

export const summaryStore = create<SummaryStore>((set) => ({
  summary: null,
  setSummary: (data:DocumentSummary) => set({ summary: data }),
}));
