export interface SummarySection {
  title: string;
  content: string;
}

export interface DocumentSummary {
  summaryTitle: string;
  sections: SummarySection[];
}

export interface SummaryStore {
  summary: DocumentSummary | null;
  setSummary: (data: DocumentSummary) => void;
}