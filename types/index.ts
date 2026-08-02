export type STEMDomain =
  | "Computer Science & Software Engineering"
  | "Mathematics & Physics"
  | "Chemistry & Biology"
  | "Management & Finances"

export interface KeyDefinition {
  term: string
  definition: string
}

export interface NoteComparisonTable {
  headers: string[]
  rows: string[][]
}

export interface NoteSection {
  heading: string
  bullets: string[]
  latexFormula?: string
  codeSnippet?: string
  diagramCode?: string
  comparisonTable?: NoteComparisonTable
}

export interface ShortNotes {
  id: string
  title: string
  subject: STEMDomain
  createdAt: string
  overview: string
  keyDefinitions: KeyDefinition[]
  sections: NoteSection[]
  highYieldTraps: string[]
}

export interface AlignmentMatrixItem {
  topic: string
  frequencyPercentage: number
  historicalWeight: string
  keyTrap: string
  corePrinciple: string
}

export interface MultipleChoiceQuestion {
  id: string
  questionNumber: number
  questionText: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  marks: number
  diagramCode?: string
}

export interface RubricStep {
  step: string
  marks: number
}

export interface StructuredQuestion {
  id: string
  questionNumber: number
  section?: string
  questionText: string
  latexFormula?: string
  codeSnippet?: string
  diagramCode?: string
  solution: string
  explanation: string
  rubricSteps?: RubricStep[]
  marks: number
}

export interface SampleLecture {
  id: string
  title: string
  subject: string
  description: string
  content: string
}

export interface ExamPaper {
  id: string
  title: string
  subject: STEMDomain
  paperType: "model_paper" | "past_paper_simulation"
  totalMarks: number
  durationMinutes: number
  instructions: string[]
  alignmentMatrix?: AlignmentMatrixItem[]
  mcqs?: MultipleChoiceQuestion[]
  shortAnswers?: StructuredQuestion[]
  deepDiveQuestions?: StructuredQuestion[]
  questions?: StructuredQuestion[]
  createdAt: string
}
