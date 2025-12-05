export interface SummarySection {
  title: string;
  content: string;
}

export interface DocumentSummary {
  summaryTitle: string;
  sections: SummarySection[];
}

export interface QuestionSection {
  id: string;
  question: string;
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
