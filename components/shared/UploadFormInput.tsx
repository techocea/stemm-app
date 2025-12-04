"use client";

import React, { forwardRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form className="flex flex-col gap-6 mt-4" ref={ref} onSubmit={onSubmit}>
        <div className="flex justify-end items-center">
          <Input
            id="file"
            type="file"
            name="file"
            accept="application/pdf"
            required
            disabled={isLoading}
            className={cn(
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "rounded-tr-none rounded-br-none"
            )}
          />
          <Button
            disabled={isLoading}
            className="rounded-tl-none rounded-bl-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin transition-all" />
              </>
            ) : (
              "Upload Your PDF"
            )}
          </Button>
        </div>
      </form>
    );
  }
);

UploadFormInput.displayName = "UploadFormInput";
export default UploadFormInput;
