"use client";

import React, { useState } from "react";
import { BayesianResults } from "@/lib/types";
import { ChevronDown, ChevronUp, BookOpen, Calculator } from "lucide-react";

interface ReasoningInspectorProps {
  results: BayesianResults;
}

export const ReasoningInspector: React.FC<ReasoningInspectorProps> = ({
  results,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">
            Explain Statistical Reasoning
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-800 text-xs text-slate-300 space-y-3 bg-slate-950/50">
          <div className="mt-3">
            <h4 className="font-semibold text-slate-200 mb-1">
              1. Posterior Distributions
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Instead of relying on standard p-values which only test against a
              null hypothesis, we calculate the entire probability distribution
              of conversion rates given observed user traffic.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-1">
              2. Probability of Superiority
            </h4>
            <p className="text-slate-400 leading-relaxed">
              The likelihood that Variant B is truly better than Control is{" "}
              <span className="text-blue-300 font-mono">
                {(results.probBBeatsA * 100).toFixed(1)}%
              </span>
              . This is calculated by comparing 10,000 Monte Carlo draws from
              both posterior distributions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center space-x-1">
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>3. Decision Rule & Guardrail Logic</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              To automatically trigger a rollout, two conditions must be met
              simultaneously:
            </p>
            <ul className="list-disc list-inside mt-1 text-slate-400 space-y-1 pl-1">
              <li>P(B &gt; A) &ge; 95%</li>
              <li>Expected Loss(B) ≤ 0.08% conversion drop</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};