import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none rounded-[6px] focus-ring disabled:pointer-events-none disabled:opacity-45";

    const variantStyles = {
      primary:
        "bg-accent text-accent-text hover:bg-accent-hover active:brightness-95 border border-transparent shadow-none",
      secondary:
        "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-subtle active:bg-bg-active",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle active:bg-bg-active border border-transparent",
      danger:
        "bg-danger text-danger-text hover:bg-danger-hover active:brightness-95 border border-transparent",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5",
      md: "h-8 px-3 text-[13px] gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin text-current shrink-0"
            size={size === "sm" ? 13 : 14}
            strokeWidth={1.75}
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
