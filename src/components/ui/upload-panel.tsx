"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { IconButton } from "@/components/ui/icon-button";
import { FileIcon, FileType } from "@/components/ui/file-icon";

export interface UploadItem {
  id: string;
  name: string;
  type: FileType;
  progress: number;
  status: "uploading" | "completed" | "error";
  size: string;
  errorMessage?: string;
}

export interface UploadPanelProps {
  items: UploadItem[];
  onCancelItem?: (id: string) => void;
  onClose?: () => void;
  className?: string;
}

export function UploadPanel({
  items,
  onCancelItem,
  onClose,
  className,
}: UploadPanelProps) {
  const [minimized, setMinimized] = React.useState(false);

  if (items.length === 0) return null;

  const completedCount = items.filter((i) => i.status === "completed").length;
  const isAllComplete = completedCount === items.length;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-40 w-80 rounded-[8px] border border-border-default bg-bg-surface text-text-primary shadow-dropdown transition-all animate-in slide-in-from-bottom-2",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-text-primary truncate">
            {isAllComplete
              ? `${items.length} dosya yüklendi`
              : `${completedCount} / ${items.length} yükleniyor`}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={minimized ? "Genişlet" : "Küçült"}
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? (
              <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </IconButton>
          {onClose && (
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Kapat"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Body List */}
      {!minimized && (
        <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle p-1">
          {items.map((item) => (
            <div key={item.id} className="p-2 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileIcon type={item.type} size="sm" />
                  <span className="font-medium truncate text-text-primary">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-text-tertiary">
                  {item.status === "uploading" && (
                    <Loader2
                      className="h-3 w-3 animate-spin text-accent"
                      strokeWidth={1.75}
                    />
                  )}
                  {item.status === "completed" && (
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-success"
                      strokeWidth={1.75}
                    />
                  )}
                  {item.status === "error" && (
                    <AlertCircle
                      className="h-3.5 w-3.5 text-danger"
                      strokeWidth={1.75}
                    />
                  )}
                  {onCancelItem && item.status === "uploading" && (
                    <button
                      type="button"
                      onClick={() => onCancelItem(item.id)}
                      className="text-text-tertiary hover:text-text-primary p-0.5 rounded focus-ring"
                    >
                      <X className="h-3 w-3" strokeWidth={1.75} />
                      <span className="sr-only">İptal et</span>
                    </button>
                  )}
                </div>
              </div>

              {item.status === "uploading" && (
                <div className="space-y-1">
                  <Progress value={item.progress} className="h-1" />
                  <div className="flex justify-between text-[10px] text-text-tertiary font-mono">
                    <span>{item.size}</span>
                    <span>%{item.progress}</span>
                  </div>
                </div>
              )}

              {item.status === "error" && item.errorMessage && (
                <p className="text-[11px] text-danger leading-tight">
                  {item.errorMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
