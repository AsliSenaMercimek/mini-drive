"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "default" }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed top-16 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3 rounded-[8px] border bg-bg-surface text-text-primary shadow-dropdown transition-all animate-in slide-in-from-top-2",
              item.variant === "success" && "border-success-border",
              item.variant === "error" && "border-danger-border",
              item.variant === "warning" && "border-warning-border",
              item.variant === "default" && "border-border-default"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {item.variant === "success" && (
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} />
              )}
              {item.variant === "error" && (
                <AlertCircle className="h-4 w-4 text-danger" strokeWidth={1.75} />
              )}
              {item.variant === "warning" && (
                <AlertTriangle className="h-4 w-4 text-warning" strokeWidth={1.75} />
              )}
              {item.variant === "default" && (
                <Info className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary leading-tight">
                {item.title}
              </p>
              {item.description && (
                <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(item.id)}
              className="text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors focus-ring"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="sr-only">Kapat</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
