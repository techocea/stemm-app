"use server";

import { GoogleGenAI } from "@google/genai";

import { SUMMARY_SYSTEM_PROMPT } from "@/app/utils/prompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function generateSummaryFromGeminiAI(pdfText: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: pdfText }] }],
      config: {
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
      },
    });
    return response.text;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
