"use server";

import { GoogleGenAI } from "@google/genai";
import { QuestionSet } from "@/types";
import { QUESTIONS_SYSTEM_PROMPT } from "@/app/utils/prompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function generateQuestionsFromAI(
  pdfText: string
): Promise<QuestionSet> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: pdfText }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description:
                "A short, descriptive title for the set of questions.",
            },
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  question: { type: "STRING" },
                },
                required: ["id", "question"],
              },
            },
          },
          required: ["title", "questions"],
        },
        systemInstruction: QUESTIONS_SYSTEM_PROMPT,
      },
    });
    const questionData: QuestionSet = JSON.parse(response?.text || "");
    return questionData;
  } catch (error: any) {
    console.error("AI call failed:", error);
    throw new Error(
      `Failed to generate valid questions: ${error.message || error.toString()}`
    );
  }
}
