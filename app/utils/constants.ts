import {
  Bolt,
  CircleQuestionMark,
  ListOrdered,
  NotebookPen,
  ShieldHalf,
  Smartphone,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "AI Library", path: "/", icon: "📂" },
  { label: "Notes", path: "/summary", icon: "📝" },
  { label: "Questions", path: "/questions", icon: "💡" },
  { label: "Credits", path: "/credits", icon: "💎" },
];

export const FEATURES = [
  {
    icon: Bolt,
    title: "Instant Summaries",
    description:
      "Our AI reads your complex PDFs and outputs structured, bulleted notes in seconds.",
  },
  {
    icon: CircleQuestionMark,
    title: "Smart Questions",
    description:
      "Get tailored practice questions that actually mirror what you need to know for the exam.",
  },
  {
    icon: Smartphone,
    title: "Study Anywhere",
    description:
      "Your summarized notes are responsive and available on any device, perfect for last-minute review.",
  },
  {
    icon: ShieldHalf,
    title: "Exam-Ready Format",
    description:
      "Notes are formatted using proven pedagogical techniques (Cornell style, Active Recall).",
  },
];

export const MOCK_USER = {
  id: "u1",
  name: "Alex Rivera",
  email: "alex.rivera@lumina.ai",
  credits: 20,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

export const SERVICE_COSTS = {
  summary: 3,
  questions: 2,
};

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
    description: "Generate practice questions to test your knowledge",
    credits: 3,
  },
];
