"use client";

import React from "react";
import { PriorConfig } from "@/lib/types";
import { Sliders } from "lucide-react";

interface SensitivityPanelProps {
  currentPrior: PriorConfig;
  onChangePrior: (prior: PriorConfig) => void;
}

export const SensitivityPanel: React.FC<SensitivityPanelProps> = ({
  currentPrior,
  onChangePrior,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center space-x-2 mb-3">
        <Sliders className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">
          Prior Belief Sensitivity (Debiasing)
        </h3>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Test how different baseline assumptions impact decision outputs before
        committing.
      </p>

      <div className="space-y-2">
        <button
          onClick={() => onChangePrior({ alpha: 1, beta: 1, type: "uninformative" })}
          className={`w-full text-left p-2.5 rounded border text-xs transition-all ${
            currentPrior.type === "uninformative"
              ? "bg-blue-950/60 border-blue-500/60 text-blue-200"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="font-medium">Uninformative Prior (Beta(1, 1))</div>
          <div className="text-[11px] opacity-80 mt-0.5">
            Assumes any conversion rate from 0% to 100% is equally likely.
          </div>
        </button>

        <button
          onClick={() => onChangePrior({ alpha: 50, beta: 950, type: "skeptical" })}
          className={`w-full text-left p-2.5 rounded border text-xs transition-all ${
            currentPrior.type === "skeptical"
              ? "bg-blue-950/60 border-blue-500/60 text-blue-200"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="font-medium">Skeptical Prior (Beta(50, 950))</div>
          <div className="text-[11px] opacity-80 mt-0.5">
            Anchors expected conversion rate around ~5%. Requires stronger
            evidence to shift.
          </div>
        </button>
      </div>
    </div>
  );
};