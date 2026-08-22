"use client";

import React from "react";
import { BayesianResults } from "@/lib/types";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface DecisionBannerProps {
  results: BayesianResults;
  onOpenOverrideModal: () => void;
}

export const DecisionBanner: React.FC<DecisionBannerProps> = ({
  results,
  onOpenOverrideModal,
}) => {
  const isRolloutAllowed = results.status === "WINNER_B";

  const getStatusBadge = () => {
    switch (results.status) {
      case "WINNER_B":
        return {
          bg: "bg-emerald-950/60 border-emerald-500/50 text-emerald-300",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          title: "Deployment Ready: Variant B Wins",
        };
      case "WINNER_A":
        return {
          bg: "bg-rose-950/60 border-rose-500/50 text-rose-300",
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
          title: "Action Required: Keep Control (Variant A)",
        };
      case "HIGH_RISK":
        return {
          bg: "bg-amber-950/60 border-amber-500/50 text-amber-300",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: "Gate Locked: High Variance / Potential Downside Risk",
        };
      default:
        return {
          bg: "bg-slate-800 border-slate-700 text-slate-300",
          icon: <AlertTriangle className="w-5 h-5 text-slate-400" />,
          title: "Data Inconclusive: Continue Experiment",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div
      className={`border rounded-xl p-5 mb-6 ${badge.bg} transition-all duration-300`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-slate-900/50 mt-0.5">
            {badge.icon}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {badge.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/80 border border-current font-mono">
                P(B &gt; A): {(results.probBBeatsA * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {results.recommendationText}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end lg:self-center shrink-0">
          {!isRolloutAllowed && (
            <button
              onClick={onOpenOverrideModal}
              className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 transition-colors"
            >
              Manual Override...
            </button>
          )}

          <button
            disabled={!isRolloutAllowed}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md ${
              isRolloutAllowed
                ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75"
            }`}
          >
            {isRolloutAllowed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Roll Out Variant B to 100%</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Rollout Gated</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};