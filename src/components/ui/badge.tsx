import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-bg-subtle text-text-secondary border-border-default",
    accent:
      "bg-accent-subtle text-accent border-accent/20",
    success:
      "bg-success-subtle text-success border-success-border",
    warning:
      "bg-warning-subtle text-warning border-warning-border",
    danger:
      "bg-danger-subtle text-danger border-danger-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[11px] font-medium border leading-none tracking-tight",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
