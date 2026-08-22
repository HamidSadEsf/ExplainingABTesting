import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-500",
  secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700",
  destructive: "bg-rose-600 text-white hover:bg-rose-500",
  outline: "border border-slate-700 text-slate-300 hover:bg-slate-800",
  success: "bg-emerald-600 text-white hover:bg-emerald-500",
  ghost: "text-slate-300 hover:bg-slate-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
};