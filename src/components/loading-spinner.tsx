"use client";

import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
