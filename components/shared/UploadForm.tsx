"use client";

import z from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/app/utils/uploadthing";
import toast from "react-hot-toast";
import { generateSummaryFromGeminiAI } from "@/lib/gemini";
import { generatePdfSummary } from "@/app/actions/upload-actions";
import { useRef } from "react";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 24 * 1024 * 1024, {
      message: "File size must be less than 24MB",
    })
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

const UploadForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Uploaded successfully!");
      toast.success("Upload completed");
    },
    onUploadError: (error) => {
      console.error("Error occured while uploading: ", error);
      toast.error("Upload failed");
    },
    onUploadBegin: (fileUrlOrName) => {
      console.log("upload has begun for: ", fileUrlOrName);
    },
  });

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);

    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      toast.error("Invalid File");
      return;
    }

    
    const res = await startUpload([file]);
    if (!res || res.length ===0) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Processing PDF...");

    
    const result = await generatePdfSummary(res);
    // console.log(result);

    if (!result?.data?.pdfText) {
      toast.error("Failed to extract PDF text");
      return;
    }

    const summary = await generateSummaryFromGeminiAI(result.data.pdfText);
    console.log(summary);
  

    const {data = null ,message = null} = result || {};

    if(data){
      toast.success("Generating Short Note...");
      formRef?.current?.reset();
    }
  };
  return (
    <div className="flex flex-col gap-8 mx-auto w-full">
      <UploadFormInput onSubmit={handleSubmit} ref={formRef}/>
    </div>
  );
};

export default UploadForm;
