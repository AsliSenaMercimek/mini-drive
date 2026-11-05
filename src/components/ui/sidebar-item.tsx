import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  active?: boolean;
}

export function SidebarItem({
  icon,
  label,
  badge,
  active = false,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex items-center w-full h-[32px] px-2.5 rounded-[6px] text-xs font-normal transition-colors select-none focus-ring",
        active
          ? "bg-bg-active text-text-primary font-medium"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "mr-2.5 shrink-0 flex items-center justify-center transition-colors",
          active ? "text-accent" : "text-text-tertiary group-hover:text-text-secondary"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "ml-2 text-[11px] px-1.5 py-0.2 rounded font-mono",
            active
              ? "bg-bg-surface text-text-primary border border-border-subtle"
              : "text-text-tertiary group-hover:text-text-secondary"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
