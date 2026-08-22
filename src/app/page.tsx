"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SCENARIOS, ScenarioPreset } from "@/lib/mock-data";
import { PriorConfig, BayesianResults } from "@/lib/types";
import { calculateBayesianResults } from "@/lib/bayesian-engine";
import { Header } from "@/components/dashboard/header";
import { DecisionBanner } from "@/components/dashboard/decision-banner";
import { PosteriorChart } from "@/components/dashboard/posterior-chart";
import { UpliftDistribution } from "@/components/dashboard/uplift-distribution";
import { ExpectedLossCard } from "@/components/dashboard/expected-loss-card";
import { ReasoningInspector } from "@/components/dashboard/reasoning-inspector";
import { SensitivityPanel } from "@/components/dashboard/sensitivity-panel";
import { OverrideModal } from "@/components/dashboard/override-modal";

export default function BayesianDashboard() {
  const [scenario, setScenario] = useState<ScenarioPreset>(SCENARIOS[0]);
  const [prior, setPrior] = useState<PriorConfig>(SCENARIOS[0].defaultPrior);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideLogs, setOverrideLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // The Monte Carlo engine is random (Math.random). To keep server-rendered HTML
  // identical to the first client render (avoiding React hydration mismatches),
  // we only compute the posterior on the client after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  const results: BayesianResults | null = useMemo(() => {
    if (!mounted) return null;
    return calculateBayesianResults(scenario.variantA, scenario.variantB, prior);
  }, [mounted, scenario, prior]);

  const totalImpressions = scenario.variantA.impressions + scenario.variantB.impressions;

  const handleOverride = (reason: string) => {
    setOverrideLogs((prev) => [
      `[OVERRIDE LOG ${new Date().toISOString()}] Scenario: ${scenario.name} | Rationale: ${reason}`,
      ...prev,
    ]);
    alert("Forced override recorded. Deployment pipeline triggered.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Header
        selectedScenario={scenario}
        onSelectScenario={(newScenario) => {
          setScenario(newScenario);
          setPrior(newScenario.defaultPrior);
        }}
        totalImpressions={totalImpressions}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {!results ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div
              className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"
              aria-hidden
            />
            <p className="text-sm text-slate-400">
              Computing posterior distributions via 10,000 Monte Carlo draws…
            </p>
          </div>
        ) : (
          <>
            <DecisionBanner
              results={results}
              onOpenOverrideModal={() => setIsOverrideOpen(true)}
            />

            {overrideLogs.length > 0 && (
              <div className="mb-6 p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs font-mono text-amber-300">
                <span className="font-bold">Latest Audit Entry:</span>{" "}
                {overrideLogs[0]}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <PosteriorChart results={results} />
                <UpliftDistribution results={results} />
              </div>

              <div className="lg:col-span-5">
                <ExpectedLossCard results={results} />
                <ReasoningInspector results={results} />
                <SensitivityPanel currentPrior={prior} onChangePrior={setPrior} />
              </div>
            </div>
          </>
        )}
      </main>

      <OverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onConfirmOverride={handleOverride}
      />
    </div>
  );
}