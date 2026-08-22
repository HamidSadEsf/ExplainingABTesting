import React from "react";
import { cn } from "@/lib/utils";

interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  valueLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  valueLabel,
  className,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {(label || valueLabel) && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {valueLabel && <span className="font-mono text-slate-200">{valueLabel}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600",
          className
        )}
        {...props}
      />
    </div>
  );
};