"use client";

import React from "react";
import { SCENARIOS, ScenarioPreset } from "@/lib/mock-data";
import { FlaskConical, Layers } from "lucide-react";

interface HeaderProps {
  selectedScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  totalImpressions: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedScenario,
  onSelectScenario,
  totalImpressions,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 p-4 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight">
                Refer-a-Friend Incentive Experiment
              </h1>
              <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded font-mono border border-slate-700">
                EXP-2026-B2C
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Metric: Conversion Rate (Sign-up to First Deposit) • Total Traffic:{" "}
              {totalImpressions.toLocaleString("en-US")} users
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <Layers className="w-4 h-4 text-slate-400 ml-1" />
            <span className="text-xs font-medium text-slate-300">
              Preset Scenario:
            </span>
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const found = SCENARIOS.find((s) => s.id === e.target.value);
                if (found) onSelectScenario(found);
              }}
              className="bg-slate-900 text-xs text-white border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};