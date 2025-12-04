"use client";

import z from "zod";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/app/utils/uploadthing";
import { generateSummaryFromGeminiAI } from "@/lib/summarize";
import { generatePdfSummary } from "@/app/actions/upload-actions";
import { summaryStore } from "@/store/store";

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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSummary } = summaryStore() as {
    setSummary: (summary: any) => void;
  };

  const { startUpload } = useUploadThing("pdfUploader", {
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

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = schema.safeParse({ file });
      // console.log(validatedFields);

      if (!validatedFields.success) {
        console.log(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid File"
        );
        toast.error("Invalid File");
        setIsLoading(false);
        return;
      }

      const res = await startUpload([file]);
      if (!res || res.length === 0) {
        toast.error("Something went wrong");
        return;
      } else {
        toast.success("Processing PDF...");
      }

      const pdfResult = await generatePdfSummary(res);
      // console.log(result);

      if (!pdfResult?.data?.pdfText) {
        toast.error("Failed to extract PDF text");
        return;
      }

      const summarizedText = await generateSummaryFromGeminiAI(
        pdfResult?.data?.pdfText
      );
      console.log(summarizedText);

      if (summarizedText) {
        setSummary(summarizedText);
        router.push("/summary");
      } else {
        return;
      }

      const { data = null } = pdfResult || {};

      if (data) {
        toast.success("Generating Short Note...");
        formRef?.current?.reset();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occured: ", error);
      formRef?.current?.reset();
    }
  };
  return (
    <div className="flex flex-col gap-8 mx-auto w-full">
      <UploadFormInput
        ref={formRef}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UploadForm;
