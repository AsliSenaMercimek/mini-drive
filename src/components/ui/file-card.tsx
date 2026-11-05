"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "@/components/ui/file-icon";
import { FileItem } from "@/components/ui/file-row";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FileCardProps {
  file: FileItem;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onOpen?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  className?: string;
}

export function FileCard({
  file,
  selected = false,
  onSelect,
  onOpen,
  onDownload,
  onShare,
  onDelete,
  className,
}: FileCardProps) {
  return (
    <div
      role="gridcell"
      aria-selected={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen?.(file);
      }}
      onDoubleClick={() => onOpen?.(file)}
      className={cn(
        "group relative flex flex-col rounded-[8px] border bg-bg-surface p-2.5 transition-all select-none focus-ring",
        selected
          ? "border-accent bg-accent-subtle/30"
          : "border-border-default hover:border-border-strong hover:bg-bg-subtle/40",
        className
      )}
    >
      {/* Top Header: Checkbox & More Menu */}
      <div className="flex items-center justify-between h-5 mb-2">
        <div
          className={cn(
            "transition-opacity",
            selected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelect?.(Boolean(checked))}
            aria-label={`${file.name} seç`}
          />
        </div>

        <div
          className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton size="sm" variant="ghost" aria-label="İşlemler">
                <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen?.(file)}>
                Aç
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(file)}>
                Paylaş
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload?.(file)}>
                İndir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                danger
                onClick={() => onDelete?.(file)}
              >
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Preview / Center Icon Area */}
      <div
        onClick={() => onOpen?.(file)}
        className="flex items-center justify-center h-20 rounded-[6px] bg-bg-subtle/50 mb-2.5 cursor-pointer"
      >
        <FileIcon type={file.type} size="lg" />
      </div>

      {/* Bottom Info: Name & Metadata */}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onOpen?.(file)}
          className="text-left text-xs font-medium text-text-primary truncate block w-full hover:underline decoration-border-default"
          title={file.name}
        >
          {file.name}
        </button>
        <div className="flex items-center justify-between text-[11px] text-text-tertiary mt-1">
          <span>{file.size || "Klasör"}</span>
          <span>{file.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}
