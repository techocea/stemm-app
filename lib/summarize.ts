"use server";

import { GoogleGenAI, Type } from "@google/genai";
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
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze and summarize this content: ${pdfText}` }],
        },
      ],
      config: {
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryTitle: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["id", "title", "content", "highlights"],
              },
            },
          },
          required: ["summaryTitle", "sections"],
        },
      },
    });
    const summaryData: DocumentSummary = JSON.parse(response?.text || "");
    return summaryData;
  } catch (error: any) {
    console.error("Gemini Summary Error:", error);
    throw new Error(
      `Failed to generate summary: ${error.message || error.toString()}`
    );
  }
}
