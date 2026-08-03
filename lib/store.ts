import { ExamPaper, ShortNotes, STEMDomain } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

const MAX_CACHE_ENTRIES = 20

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

  generationCache: Record<string, ShortNotes | ExamPaper>
  cacheOrder: string[]
  addToCache: (key: string, data: ShortNotes | ExamPaper) => void
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

      generationCache: {},
      cacheOrder: [],

      setActiveTab: (tab) => set({ activeTab: tab }),
      setTargetSubject: (s) => set({ targetSubject: s }),

      selectNotes: (sn) => set({ currentNotes: sn, activeTab: "short_notes" }),

      selectExam: (ex) =>
        set({
          currentExam: ex,
          activeTab:
            ex.paperType === "past_paper_solution"
              ? "past_paper_solution"
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

      addToCache: (key, data) =>
        set((state) => {
          // already cached? just refresh position, no-op on data
          if (state.generationCache[key]) return state

          const newOrder = [...state.cacheOrder, key]
          const newCache = { ...state.generationCache, [key]: data }

          // evict oldest entries once we exceed the cap
          while (newOrder.length > MAX_CACHE_ENTRIES) {
            const oldestKey = newOrder.shift()!
            delete newCache[oldestKey]
          }

          return { generationCache: newCache, cacheOrder: newOrder }
        }),
    }),
    { name: "stem-app-storage" }
  )
)
