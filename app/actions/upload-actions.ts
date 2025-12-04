"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromGeminiAI } from "@/lib/summarize";

type UploadThingSuccessResponse = {
  url: string;
  name: string;
};

export async function generatePdfSummary(
  uploadResponse: UploadThingSuccessResponse[]
) {
 
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      message: "File upload failed: No response data provided.",
      data: null,
    };
  }

  const firstFile = uploadResponse[0];

  const pdfUrl = firstFile.url;
  const fileName = firstFile.name;

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed: Missing file URL.",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log({ pdfText });

    return {
      success: true,
      message: "Summary generated successfully.",
      data: { pdfText, fileName },
    };
  } catch (error) {
    console.error("Error during PDF processing:", error);
    return {
      success: false,
      message: `File processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      data: null,
    };
  }
}
