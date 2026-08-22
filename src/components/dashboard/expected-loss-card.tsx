"use client";

import React from "react";
import { BayesianResults } from "@/lib/types";
import { HelpCircle } from "lucide-react";

interface ExpectedLossCardProps {
  results: BayesianResults;
}

export const ExpectedLossCard: React.FC<ExpectedLossCardProps> = ({
  results,
}) => {
  const lossBPercent = (results.expectedLossB * 100).toFixed(3);
  const lossAPercent = (results.expectedLossA * 100).toFixed(3);

  // Safety threshold is 0.08% expected loss on conversion rate
  const threshold = 0.08;
  const isLossBSafe = Number(lossBPercent) <= threshold;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-white flex items-center space-x-2">
          <span>Expected Downside Loss</span>
          <HelpCircle className="w-4 h-4 text-slate-500" />
        </h3>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
          Loss Function
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Measures the expected percentage point conversion rate lost if you
        deploy a variant that is actually worse.
      </p>

      <div className="space-y-4">
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-slate-300">
              Risk of Deploying Variant B:
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                isLossBSafe ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {lossBPercent}% conv. rate
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isLossBSafe ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(Number(lossBPercent) * 500, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% Risk</span>
            <span>Safety Threshold: {threshold}%</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-slate-400">
              Risk of Staying with Control (A):
            </span>
            <span className="text-xs font-mono text-slate-300">
              {lossAPercent}% conv. rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};