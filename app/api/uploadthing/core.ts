import { fetchAndExtractPdfText } from "@/lib/langchain";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
    //add authentication later
    
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file);
      console.log("Text available:", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
