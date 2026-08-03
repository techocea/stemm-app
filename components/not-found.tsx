import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        
        {/* Animated Icon Illustration */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-muted text-muted-foreground animate-bounce [animation-duration:2s]">
          <FileQuestion className="h-12 w-12 stroke-[1.5]" />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            404
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button 
            variant="outline" 
            size="default"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            asChild
            variant="default" 
            size="default"
            className="gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
      </div>
    </div>
  );
}
