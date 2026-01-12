"use client";

import { useRef, useState } from "react";
import { DocumentSummary, QuestionSet, ServiceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { summaryStore } from "@/store/store";
import { useUploadThing } from "../utils/uploadthing";
import toast from "react-hot-toast";
import z from "zod";
import { generatePdfSummary } from "../actions/upload-actions";
import { generateSummaryFromAI } from "@/services/summarize";
import { generateQuestionsFromAI } from "@/services/questions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { handleCreditDeduction } from "@/services/creditDeduction";

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

const page = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ServiceType>("summary");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(
    "Analyzing document structure..."
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileSelected(!e.target.files || e.target.files.length > 0);
  };

  const { setSummary, setQuestions } = summaryStore() as {
    setSummary: (summary: DocumentSummary) => void;
    setQuestions: (questions: QuestionSet) => void;
  };

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Uploaded successfully!");
      // toast.success("Upload completed");
    },
    onUploadError: (error) => {
      console.error("Error occurred while uploading: ", error);
      toast.error("Upload failed");
    },
    onUploadBegin: (fileUrlOrName) => {
      console.log("upload has begun for: ", fileUrlOrName);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setLoadingStep("Analyzing document structure...");

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = schema.safeParse({ file });

      //validation of the fields
      if (!validatedFields.success) {
        console.log(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid File"
        );
        toast.error("Please upload a valid file");
        setIsProcessing(false);
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

      if (selectedMode === "summary") {
        await handleCreditDeduction({
          userId: "696289e26f1a6fb0e55144f3",
          serviceType: "summary",
        });
        result = await generateSummaryFromAI(pdfText);
        setSummary(result);
        setIsProcessing(false);
        router.push("/summary");
      } else {
        result = await generateQuestionsFromAI(pdfText);
        setQuestions(result);
        setIsProcessing(false);
        router.push("/questions");
      }

      const { data = null } = pdfResult || {};

      if (data) {
        toast.success("Generating Content...");
        formRef?.current?.reset();
        setIsFileSelected(false);
      }
    } catch (error) {
      console.error("Error occurred: ", error);
      toast.error("Processing failed. Please check your API key.");
      formRef?.current?.reset();
      setIsFileSelected(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      {isProcessing && (
        <div className="fixed inset-0 z-100 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>
          <h2 className="text-2xl font-black mb-2 animate-pulse tracking-tight">
            Lumina is thinking...
          </h2>
          <p className="text-indigo-200 font-medium tracking-wide text-sm">
            {loadingStep}
          </p>
        </div>
      )}

      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
            Academic Mastery,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Simplified.
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-normal">
            Upload your lecture notes or research papers. Our AI builds
            exhaustive study guides so you can stop reading and start learning.
          </p>

          <form
            className="flex flex-col gap-8 mx-auto w-full"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-10 mt-12">
              <div className="space-y-8">
                <div
                  className={`relative h-96 rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center group ${dragActive
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-2xl"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm"
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    // handleProcess("Uploaded_Doc.pdf");
                  }}
                >
                  <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                    📄
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Drop your lecture PDF here
                  </h3>
                  <p className="text-slate-500 text-sm max-w-xs font-medium">
                    Supports PDF up to 32MB.
                  </p>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute opacity-0 inset-0 h-full cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5 sticky top-10">
                  <h3 className="font-black text-xl mb-8 text-slate-900 dark:text-white">
                    Select Content Mode
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                      onClick={() => setSelectedMode("summary")}
                      className={`cursor-pointer w-full p-4 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${selectedMode === "summary"
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 ring-4 ring-indigo-500/10"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                        }`}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-3xl">📝</span>
                        <h4 className="font-black text-slate-900 dark:text-white">
                          Mastery Notes
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Exhaustive thematic summaries with structured tables
                          and context.
                        </p>
                      </div>
                    </Card>

                    <Card
                      onClick={() => setSelectedMode("questions")}
                      className={`cursor-pointer w-full p-4 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${selectedMode === "questions"
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 ring-4 ring-indigo-500/10"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                        }`}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-3xl">🧩</span>
                        <h4 className="font-black text-slate-900 dark:text-white">
                          Deep Q&A
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Analytical synthesis questions designed for complex
                          exam prep.
                        </p>
                      </div>
                    </Card>
                  </div>

                  <div className="mt-10 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Protocol Cost:
                    </span>
                    <div className="flex items-center gap-1.5 font-black text-indigo-600 dark:text-indigo-400">
                      <span className="text-xl">
                        {selectedMode === "summary" ? 3 : 2}
                      </span>
                      <span className="text-[9px] tracking-tighter">
                        CREDITS
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    type="submit"
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-indigo-600/30"
                  >
                    Start Synthesis
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
