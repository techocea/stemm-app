export interface SummarySection {
  id: string;
  title: string;
  content: string;
  highlights: string[];
}

export interface DocumentSummary {
  summaryTitle: string;
  sections: SummarySection[];
}

export interface QuestionSection {
  id: string;
  question: string;
  answer: string;
}
export interface QuestionSet {
  title: string;
  questions: QuestionSection[];
}

export interface SummaryStore {
  summary: DocumentSummary | null;
  questions: QuestionSet | null;
  setSummary: (data: DocumentSummary) => void;
  setQuestions: (data: QuestionSet) => void;
}

export type StudyMode = "summary" | "questions";
