import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  className,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {title && <div className="mb-3">{title}</div>}
        {children}
      </div>
    </div>
  );
};