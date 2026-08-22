"use client";

import React from "react";
import { BayesianResults } from "@/lib/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface UpliftDistributionProps {
  results: BayesianResults;
}

export const UpliftDistribution: React.FC<UpliftDistributionProps> = ({
  results,
}) => {
  // Split each bin into positive and negative contributions so the bars can
  // be color-coded (emerald = wins, rose = losses, slate = straddles zero).
  const chartData = results.upliftDistribution.map((bin) => ({
    uplift: bin.uplift,
    densityPositive: bin.region === "positive" ? bin.density : 0,
    densityNegative: bin.region === "negative" ? bin.density : 0,
    density: bin.density,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Relative Uplift Distribution (% Improvement)
          </h3>
          <p className="text-xs text-slate-400">
            Probability distribution of relative change ((θ_B - θ_A) / θ_A)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Expected Mean Uplift</span>
          <span
            className={`text-base font-bold font-mono ${
              results.relativeUpliftMean >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {results.relativeUpliftMean >= 0 ? "+" : ""}
            {(results.relativeUpliftMean * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 30, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="uplift"
              tickFormatter={(v: number) => `${v}%`}
              stroke="#475569"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis stroke="#475569" tickLine={false} axisLine={false} fontSize={10} />
            <Tooltip
              active
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300">
                      Uplift:{" "}
                      <span className="font-mono font-bold text-white">
                        {data.uplift}%
                      </span>{" "}
                      <br />
                      Prob Density:{" "}
                      <span className="font-mono text-blue-400">
                        {((data.density ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="densityPositive"
              fill="#10b981"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="densityNegative"
              fill="#f43f5e"
              radius={[2, 2, 0, 0]}
            />
            <ReferenceLine
              stroke="#f43f5e"
              strokeDasharray="4 4"
              x={0}
              // Label the zero boundary (`omega` renders on the axis)
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1">
            <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
            <span>Positive uplift</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
            <span>Negative uplift</span>
          </span>
        </div>
        <span className="text-xs flex items-center space-x-1">
          <span className="font-mono text-emerald-300 font-semibold">
            P(uplift &gt; 0): {(results.probabilityUpliftPositive * 100).toFixed(1)}%
          </span>
        </span>
      </div>

      <div className="mt-3 text-xs text-slate-400 flex justify-between items-center bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
        <span>95% Credible Interval for Uplift:</span>
        <span className="font-mono text-slate-200">
          [{(results.relativeUpliftHdi95[0] * 100).toFixed(1)}% ... +{
            (results.relativeUpliftHdi95[1] * 100).toFixed(1)
          }%]
        </span>
      </div>
    </div>
  );
};