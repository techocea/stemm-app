"use client";

import z from "zod";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ContentModes from "./ContentModes";
import { useRef, useState } from "react";
import { summaryStore } from "@/store/store";
import { MODES } from "@/app/utils/constants";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Loader2, WandSparkles } from "lucide-react";
import { DocumentSummary, QuestionSet } from "@/types";
import { generateSummaryFromAI } from "@/lib/summarize";
import { useUploadThing } from "@/app/utils/uploadthing";
import { generateQuestionsFromAI } from "@/lib/questions";
import { generatePdfSummary } from "@/app/actions/upload-actions";

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

const Hero = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectMode, setSelectMode] = useState<number | null>(null);

  const handleSelectMode = (selectedId: number) => {
    setSelectMode((prev) => (prev === selectedId ? null : selectedId));
  };

  const { setSummary, setQuestions } = summaryStore() as {
    setSummary: (summary: DocumentSummary) => void;
    setQuestions: (questions: QuestionSet) => void;
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

      //validation of the fields
      if (!validatedFields.success) {
        console.log(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid File"
        );
        toast.error("Please upload a file");
        setIsLoading(false);
        return;
      }

      //checking whether a mode is selected
      if (selectMode === null) {
        toast.error("Please select a mode");
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
      const pdfText = pdfResult?.data?.pdfText;

      if (!pdfText) {
        toast.error("Failed to extract PDF text");
        return;
      }

      //deciding what to do based on the selected mode
      let result;

      if (selectMode === MODES.SUMMARIZE) {
        result = await generateSummaryFromAI(pdfText);
        setSummary(result);
        setIsLoading(false);
        router.push("/summary");
      } else {
        result = await generateQuestionsFromAI(pdfText);
        setQuestions(result);
        setIsLoading(false);
        router.push("/questions");
      }

      const { data = null } = pdfResult || {};

      if (data) {
        toast.success("Generating Content...");
        formRef?.current?.reset();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occured: ", error);
      formRef?.current?.reset();
    }
  };

  return (
    <Card className="w-full mt-6 lg:max-w-3xl">
      <CardContent className="space-y-8">
        <form
          className="flex flex-col gap-8 mx-auto w-full"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              1. Upload your document
            </h2>
            <div className="flex justify-end items-center">
              <Input
                id="file"
                type="file"
                name="file"
                accept="application/pdf"
                disabled={isLoading}
                className={cn(
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "rounded-tr-none rounded-br-none"
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              2. select your required content mode
            </h2>
            <ContentModes
              selectMode={selectMode}
              handleSelectMode={handleSelectMode}
            />
          </div>
          <div className="w-full">
            <Button
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full text-xl capitalize flex items-center gap-4"
            >
              {!isLoading ? (
                <div className="flex items-center justify-center gap-4">
                  <WandSparkles size={32} />
                  <span>generate content</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="animate-spin" size={32} />
                  <span>please wait</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Hero;
