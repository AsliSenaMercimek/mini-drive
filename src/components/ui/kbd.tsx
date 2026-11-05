import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-medium text-text-secondary bg-bg-subtle border border-border-default rounded-[4px] select-none leading-none shadow-[0_1px_0_1px_rgba(0,0,0,0.03)]",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
