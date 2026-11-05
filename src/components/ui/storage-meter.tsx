import * as React from "react";
import { HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface StorageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  usedBytes: number;
  totalBytes: number;
  planName?: string;
  onUpgrade?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function StorageMeter({
  usedBytes,
  totalBytes,
  planName = "Ücretsiz Plan",
  onUpgrade,
  className,
  ...props
}: StorageMeterProps) {
  const percentage = Math.min(100, Math.round((usedBytes / totalBytes) * 100));

  return (
    <div
      className={cn(
        "rounded-[8px] border border-border-default bg-bg-surface p-3 text-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-text-secondary mb-2">
        <div className="flex items-center gap-1.5 font-medium text-text-primary">
          <HardDrive className="h-3.5 w-3.5 text-text-tertiary" strokeWidth={1.75} />
          <span>Depolama</span>
        </div>
        <span className="text-[11px] text-text-tertiary">{planName}</span>
      </div>

      <Progress value={percentage} className="h-1.5 mb-2" />

      <div className="flex items-center justify-between text-[11px] text-text-tertiary">
        <span>
          {formatBytes(usedBytes)} / {formatBytes(totalBytes)} ({percentage}%)
        </span>
        {onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="text-accent hover:underline font-medium focus-ring rounded"
          >
            Yükselt
          </button>
        )}
      </div>
    </div>
  );
}
