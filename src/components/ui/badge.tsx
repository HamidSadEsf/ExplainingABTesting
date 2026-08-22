import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-blue-600/20 text-blue-300 border-blue-500/40",
  secondary: "bg-slate-800 text-slate-300 border-slate-700",
  destructive: "bg-rose-600/20 text-rose-300 border-rose-500/40",
  outline: "bg-transparent text-slate-300 border-slate-600",
  success: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40",
  warning: "bg-amber-600/20 text-amber-300 border-amber-500/40",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};