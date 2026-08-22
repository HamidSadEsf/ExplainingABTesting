import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  header,
  footer,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-slate-900 border-slate-800 shadow-sm text-slate-100",
        className
      )}
      {...props}
    >
      {header && <div className="p-4 font-semibold text-slate-200">{header}</div>}
      <div className="p-5">{children}</div>
      {footer && <div className="p-4 border-t border-slate-800 text-sm text-slate-300">{footer}</div>}
    </div>
  );
};