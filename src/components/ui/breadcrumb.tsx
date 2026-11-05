import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
}

export function Breadcrumb({
  items,
  onItemClick,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-text-secondary", className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight
                  className="h-3 w-3 text-text-tertiary shrink-0"
                  strokeWidth={1.75}
                />
              )}
              <li className="flex items-center">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-text-primary truncate max-w-[180px]"
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onItemClick?.(item)}
                    className="hover:text-text-primary transition-colors truncate max-w-[150px] focus-ring rounded-[4px] px-1 py-0.5 -mx-1"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
