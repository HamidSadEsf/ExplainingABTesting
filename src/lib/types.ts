export interface VariantData {
  id: string;
  name: string;
  impressions: number;
  conversions: number;
  color: string;
}

export interface PriorConfig {
  alpha: number; // Prior successes
  beta: number; // Prior failures
  type: "uninformative" | "skeptical" | "optimistic";
}

export interface BayesianResults {
  variantA: {
    conversionRate: number;
    alphaPosterior: number;
    betaPosterior: number;
    hdi95: [number, number];
  };
  variantB: {
    conversionRate: number;
    alphaPosterior: number;
    betaPosterior: number;
    hdi95: [number, number];
  };
  probBBeatsA: number; // e.g. 0.965 (96.5%)
  expectedLossA: number; // Risk of choosing A if B is better
  expectedLossB: number; // Risk of choosing B if A is better
  relativeUpliftMean: number; // e.g. +0.082 (8.2%)
  relativeUpliftHdi95: [number, number];
  status: "WINNER_B" | "WINNER_A" | "INCONCLUSIVE" | "HIGH_RISK";
  recommendationText: string;
  probabilityUpliftPositive: number;
  densityCurves: Array<{
    x: number; // Conversion rate value (e.g. 0.052)
    densityA: number;
    densityB: number;
  }>;
  upliftDistribution: Array<{
    uplift: number; // e.g. -5 to +20 (percent)
    density: number;
    // Probability mass for drawing the positive-region highlight
    region: "negative" | "positive" | "zero";
  }>;
}