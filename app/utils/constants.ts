import { ListOrdered, NotebookPen } from "lucide-react";

export const CONTENT_MODES = [
  {
    id: 1,
    icon: NotebookPen,
    title: "Smart Notes",
    description: "Convert into precise summarized notes",
    credits: 2,
  },
  {
    id: 2,
    icon: ListOrdered,
    title: "Practice Questions",
    description:
      "Generate practice questions to test your knowledge",
    credits: 3,
  },
];

export const MODES = {
  SUMMARIZE: 1,
  QUESTIONS: 2,
};
