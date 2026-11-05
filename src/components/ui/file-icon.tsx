import * as React from "react";
import {
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode2,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FileType =
  | "folder"
  | "document"
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "archive"
  | "spreadsheet"
  | "generic";

export interface FileIconProps {
  type: FileType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FileIcon({ type, size = "md", className }: FileIconProps) {
  const sizeMap = {
    sm: 16,
    md: 18,
    lg: 24,
  };

  const px = sizeMap[size];

  // Restrained single neutral-slate tone palette (no saturated multi-color rainbow)
  switch (type) {
    case "folder":
      return (
        <Folder
          size={px}
          strokeWidth={1.75}
          className={cn("text-accent fill-accent/15 shrink-0", className)}
        />
      );
    case "image":
      return (
        <FileImage
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "video":
      return (
        <FileVideo
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "audio":
      return (
        <FileAudio
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "code":
      return (
        <FileCode2
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "archive":
      return (
        <FileArchive
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "spreadsheet":
      return (
        <FileSpreadsheet
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "pdf":
    case "document":
      return (
        <FileText
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-secondary shrink-0", className)}
        />
      );
    case "generic":
    default:
      return (
        <File
          size={px}
          strokeWidth={1.75}
          className={cn("text-text-tertiary shrink-0", className)}
        />
      );
  }
}
