import * as React from "react";
import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-[8px] border border-dashed border-border-default bg-bg-surface/50",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-bg-subtle text-text-tertiary mb-3">
        {icon || <Folder className="h-5 w-5" strokeWidth={1.75} />}
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-text-secondary max-w-sm mb-4 leading-normal">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
