import { VariantData, PriorConfig } from "./types";

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  variantA: VariantData;
  variantB: VariantData;
  defaultPrior: PriorConfig;
}

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "clear-winner",
    name: "Clear Winner (High Confidence)",
    description: "Variant B clearly outperforms A with low expected risk.",
    variantA: {
      id: "a",
      name: "Control (Standard Referral)",
      impressions: 45000,
      conversions: 2250,
      color: "#64748b",
    },
    variantB: {
      id: "b",
      name: "Variant B ($10 Cash Reward)",
      impressions: 45200,
      conversions: 2712,
      color: "#2563eb",
    },
    defaultPrior: { alpha: 1, beta: 1, type: "uninformative" },
  },
  {
    id: "inconclusive",
    name: "Early Stages / High Uncertainty",
    description: "Low sample size. Curves overlap significantly.",
    variantA: {
      id: "a",
      name: "Control (Standard Referral)",
      impressions: 1200,
      conversions: 60,
      color: "#64748b",
    },
    variantB: {
      id: "b",
      name: "Variant B ($10 Cash Reward)",
      impressions: 1180,
      conversions: 68,
      color: "#2563eb",
    },
    defaultPrior: { alpha: 1, beta: 1, type: "uninformative" },
  },
  {
    id: "high-risk",
    name: "High Variance / Downside Risk",
    description: "B beats A on average, but tail loss exceeds threshold.",
    variantA: {
      id: "a",
      name: "Control (Standard Referral)",
      impressions: 550,
      conversions: 121,
      color: "#64748b",
    },
    variantB: {
      id: "b",
      name: "Variant B ($10 Cash Reward)",
      impressions: 550,
      conversions: 138,
      color: "#2563eb",
    },
    defaultPrior: { alpha: 1, beta: 1, type: "uninformative" },
  },
];