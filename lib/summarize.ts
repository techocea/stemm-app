"use server";

import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/app/utils/prompt";
import { DocumentSummary } from "@/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function generateSummaryFromAI(
  pdfText: string
): Promise<DocumentSummary> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: pdfText }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summaryTitle: {
              type: "string",
              description: "The main title for the document summary.",
            },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "The title of the section.",
                  },
                  content: {
                    type: "string",
                    description: "The summarized content of the section.",
                  },
                },
                required: ["title", "content"],
              },
            },
          },
          required: ["summaryTitle", "sections"],
        },
        thinkingConfig: {
          thinkingBudget: 1024,
        },
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
      },
    });
    const summaryData: DocumentSummary = JSON.parse(response?.text || "");
    return summaryData;
  } catch (error: any) {
    console.error("AI call failed:", error);
    throw new Error(
      `Failed to generate summary: ${error.message || error.toString()}`
    );
  }
}
