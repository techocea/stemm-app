"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { WandSparkles } from "lucide-react";
import ContentModes from "./ContentModes";
import UploadFormInput from "./UploadFormInput";

const Hero = () => {
  return (
    <Card className="w-full mt-6">
      <CardContent className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            1. Upload your document
          </h2>
          <UploadFormInput onSubmit={() => null} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            2. select your required content mode
          </h2>
          <ContentModes />
        </div>
        <div className="w-full">
          <Button
            size="lg"
            disabled
            className="w-full text-2xl capitalize flex items-center gap-4"
          >
            <WandSparkles size={32} />
            generate content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Hero;
