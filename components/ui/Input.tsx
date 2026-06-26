"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border border-card-border bg-foreground/[0.03] px-4 py-3",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "transition-all duration-200 focus-ring",
            "focus:border-brand-500/50 focus:bg-background focus:ring-4 focus:ring-brand-500/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-error/50 focus:border-error focus:ring-error/10",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-error font-medium">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
