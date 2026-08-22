"use client";

import React from "react";
import { BayesianResults } from "@/lib/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

interface PosteriorChartProps {
  results: BayesianResults;
}

export const PosteriorChart: React.FC<PosteriorChartProps> = ({ results }) => {
  const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Conversion Rate Posterior Distributions
          </h3>
          <p className="text-xs text-slate-400">
            Probability density of true conversion rates (θ_A vs θ_B)
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-500"></span>
            <span className="text-slate-300">
              Control (A): {(results.variantA.conversionRate * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-300">
              Variant B: {(results.variantB.conversionRate * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={results.densityCurves}
            margin={{ left: 30, right: 20, top: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              stroke="#475569"
              tickFormatter={(v: number) => formatPercent(v)}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={10} stroke="#475569" tickLine={false} axisLine={false} />
            <Tooltip
              active
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow-lg text-xs">
                      <p className="font-mono text-slate-300 mb-1">
                        Conv. Rate: {formatPercent(data.x)}
                      </p>
                      <p className="text-slate-400">
                        Density A: <span className="text-slate-200">{data.densityA}</span>
                      </p>
                      <p className="text-blue-400">
                        Density B: <span className="text-blue-200">{data.densityB}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceArea
              x1={results.variantA.hdi95[0]}
              x2={results.variantA.hdi95[1]}
              stroke="#64748b"
              strokeOpacity={0.25}
              fill="#64748b"
              fillOpacity={0.06}
            />
            <ReferenceArea
              x1={results.variantB.hdi95[0]}
              x2={results.variantB.hdi95[1]}
              stroke="#2563eb"
              strokeOpacity={0.25}
              fill="#2563eb"
              fillOpacity={0.06}
            />

            <Area
              dataKey="densityA"
              type="monotone"
              stroke="#94a3b8"
              fill="url(#colorA)"
              strokeWidth={2}
            />
            <Area
              dataKey="densityB"
              type="monotone"
              stroke="#3b82f6"
              fill="url(#colorB)"
              strokeWidth={2}
            />

            <ReferenceLine
              stroke="#94a3b8"
              strokeDasharray="4 4"
              x={results.variantA.conversionRate}
            />
            <ReferenceLine
              stroke="#3b82f6"
              strokeDasharray="4 4"
              x={results.variantB.conversionRate}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-0.5">
            Control (A) 95% HDI:
          </span>
          <span className="font-mono text-slate-400">
            [{formatPercent(results.variantA.hdi95[0])} ...{" "}
            {formatPercent(results.variantA.hdi95[1])}]
          </span>
        </div>
        <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">
          <span className="font-semibold text-blue-400 block mb-0.5">
            Variant B 95% HDI:
          </span>
          <span className="font-mono text-blue-300">
            [{formatPercent(results.variantB.hdi95[0])} ...{" "}
            {formatPercent(results.variantB.hdi95[1])}]
          </span>
        </div>
      </div>
    </div>
  );
};