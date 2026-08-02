import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  targetSubject: STEMDomain
  activeTab: "short_notes" | "model_paper" | "past_paper_solution"
  shortNotesList: ShortNotes[]
  currentNotes: ShortNotes | null
  examsList: ExamPaper[]
  currentExam: ExamPaper | null

  setActiveTab: (tab: AppState["activeTab"]) => void
  setTargetSubject: (s: STEMDomain) => void
  selectNotes: (sn: ShortNotes) => void
  selectExam: (ex: ExamPaper) => void
  addShortNotes: (sn: ShortNotes) => void
  addExam: (ex: ExamPaper) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      targetSubject: "Computer Science & Software Engineering",
      activeTab: "short_notes",
      shortNotesList: [],
      currentNotes: null,
      examsList: [],
      currentExam: null,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setTargetSubject: (s) => set({ targetSubject: s }),

      selectNotes: (sn) => set({ currentNotes: sn, activeTab: "short_notes" }),

      selectExam: (ex) =>
        set({
          currentExam: ex,
          activeTab:
            ex.paperType === "past_paper_simulation"
              ? "past_paper_simulation"
              : "model_paper",
        }),

      addShortNotes: (sn) =>
        set((state) => ({
          shortNotesList: [sn, ...state.shortNotesList],
          currentNotes: sn,
          activeTab: "short_notes",
        })),

      addExam: (ex) =>
        set((state) => ({
          examsList: [ex, ...state.examsList],
          currentExam: ex,
        })),
    }),
    { name: "stem-app-storage" } // localStorage key, handled automatically
  )
)
