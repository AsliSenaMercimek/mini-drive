import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center shrink-0 font-medium transition-colors select-none rounded-[6px] focus-ring disabled:pointer-events-none disabled:opacity-45";

    const variantStyles = {
      primary:
        "bg-accent text-accent-text hover:bg-accent-hover active:brightness-95 border border-transparent",
      secondary:
        "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default hover:bg-bg-subtle active:bg-bg-active",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle active:bg-bg-active border border-transparent",
      danger:
        "bg-transparent text-danger hover:bg-danger-subtle active:bg-danger-subtle border border-transparent",
    };

    const sizeStyles = {
      sm: "h-7 w-7 text-xs",
      md: "h-8 w-8 text-sm",
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
        {loading ? (
          <Loader2
            className="animate-spin text-current shrink-0"
            size={size === "sm" ? 13 : 14}
            strokeWidth={1.75}
          />
        ) : (
          children
        )}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
