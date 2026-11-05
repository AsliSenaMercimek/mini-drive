"use client";

import * as React from "react";
import { Download, MoreHorizontal, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, FileType } from "@/components/ui/file-icon";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  updatedAt: string;
  size?: string;
  isFolder?: boolean;
}

export interface FileRowProps {
  file: FileItem;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onOpen?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  className?: string;
}

export function FileRow({
  file,
  selected = false,
  onSelect,
  onOpen,
  onDownload,
  onShare,
  onDelete,
  className,
}: FileRowProps) {
  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen?.(file);
      }}
      onDoubleClick={() => onOpen?.(file)}
      className={cn(
        "group relative flex items-center h-[38px] px-3 gap-3 text-xs select-none border-b border-border-subtle transition-colors focus-ring",
        selected
          ? "bg-accent-subtle/70 text-text-primary"
          : "hover:bg-bg-subtle/70 bg-bg-surface text-text-primary",
        className
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "flex items-center shrink-0 transition-opacity",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect?.(Boolean(checked))}
          aria-label={`${file.name} seç`}
        />
      </div>

      {/* File / Folder Icon */}
      <div className="shrink-0 flex items-center">
        <FileIcon type={file.type} size="sm" />
      </div>

      {/* File Name */}
      <div className="flex-1 min-w-0 pr-2">
        <button
          type="button"
          onClick={() => onOpen?.(file)}
          className="text-left font-medium text-text-primary truncate block w-full hover:underline decoration-border-default underline-offset-2"
        >
          {file.name}
        </button>
      </div>

      {/* Modified date */}
      <div className="w-28 shrink-0 text-text-tertiary text-[11px] hidden sm:block truncate">
        {file.updatedAt}
      </div>

      {/* Size */}
      <div className="w-20 shrink-0 text-text-tertiary text-[11px] text-right font-mono hidden md:block">
        {file.size || "—"}
      </div>

      {/* Actions (hover & focus visible) */}
      <div
        className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          size="sm"
          variant="ghost"
          aria-label="Paylaş"
          onClick={() => onShare?.(file)}
        >
          <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </IconButton>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label="İndir"
          onClick={() => onDownload?.(file)}
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
        </IconButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton size="sm" variant="ghost" aria-label="Diğer işlemler">
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
  );
}
