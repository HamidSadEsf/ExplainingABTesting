import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ id: string; label: string }>;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  items,
  className,
}) => {
  return (
    <div className={cn("inline-flex bg-slate-800 p-1 rounded-lg", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onValueChange(item.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            value === item.id
              ? "bg-blue-600/30 text-blue-300"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};