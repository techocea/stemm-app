"use client";

import React, { forwardRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit }, ref) => {
    return (
      <form className="flex flex-col gap-6 mt-4" ref={ref} onSubmit={onSubmit}>
        <div className="flex justify-end items-center">
          <Input
            id="file"
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="rounded-tr-none rounded-br-none"
          />
          <Button className="rounded-tl-none rounded-bl-none">
            Upload Your PDF
          </Button>
        </div>
      </form>
    );
  }
);

export default UploadFormInput;
