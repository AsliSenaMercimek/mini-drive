import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, prefixIcon, suffixIcon, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center w-full transition-colors rounded-[6px] border bg-bg-surface text-text-primary",
          error
            ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
            : "border-border-default focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15",
          disabled && "opacity-50 pointer-events-none bg-bg-subtle",
          className
        )}
      >
        {prefixIcon && (
          <div className="pl-2.5 pr-1 text-text-tertiary flex items-center shrink-0">
            {prefixIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent h-8 px-2.5 text-[13px] placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed",
            prefixIcon && "pl-1.5",
            suffixIcon && "pr-1.5"
          )}
          {...props}
        />
        {suffixIcon && (
          <div className="pr-2.5 pl-1 text-text-tertiary flex items-center shrink-0">
            {suffixIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
