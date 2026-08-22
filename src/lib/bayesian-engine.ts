import { VariantData, PriorConfig, BayesianResults } from "./types";

// Fast Lanczos approximation for log Gamma function
function logGamma(z: number): number {
  const c = [
    676.5203681218851, -1259.139216722289, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019571e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(
      Math.PI / (Math.sin(Math.PI * z) * Math.exp(logGamma(1 - z)))
    );
  }
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < c.length; i++) x += c[i] / (z + i + 1);
  const t = z + c.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

// Beta distribution probability density function
export function betaPdf(x: number, alpha: number, betaVal: number): number {
  if (x <= 0 || x >= 1) return 0;
  const logNumerator = (alpha - 1) * Math.log(x) + (betaVal - 1) * Math.log(1 - x);
  const logBetaFunc = logGamma(alpha) + logGamma(betaVal) - logGamma(alpha + betaVal);
  return Math.exp(logNumerator - logBetaFunc);
}

// Box-Muller transform to generate standard normal randoms
function randomNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Approximate Gamma sampler (Marsaglia-Tsang) using Normal draws
function randomGamma(shape: number, scale: number): number {
  if (shape < 1) return randomGamma(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    const z = randomNormal();
    const v = 1 + c * z;
    if (v <= 0) continue;
    const u = Math.random();
    const v3 = v * v * v;
    if (u < 1 - 0.0331 * z * z * z * z) return d * v3 * scale;
    if (Math.log(u) < 0.5 * z * z + d * (1 - v3 + Math.log(v3))) return d * v3 * scale;
  }
}

// Sample a Beta(alpha, beta) draw via normalized Gammas
export function sampleBeta(alpha: number, betaVal: number): number {
  const gA = randomGamma(alpha, 1);
  const gB = randomGamma(betaVal, 1);
  return gA / (gA + gB);
}
// 2.5/97.5 percentile helper on a (sorted) sample array
function percentile(sorted: number[], p: number): number {
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

export function calculateBayesianResults(
  varA: VariantData,
  varB: VariantData,
  prior: PriorConfig
): BayesianResults {
  const alphaA = prior.alpha + varA.conversions;
  const betaA = prior.beta + (varA.impressions - varA.conversions);

  const alphaB = prior.alpha + varB.conversions;
  const betaB = prior.beta + (varB.impressions - varB.conversions);

  const numSamples = 10000;
  const samplesA: number[] = new Array(numSamples);
  const samplesB: number[] = new Array(numSamples);
  const uplifts: number[] = new Array(numSamples);

  let bWins = 0;
  let lossASum = 0;
  let lossBSum = 0;

  for (let i = 0; i < numSamples; i++) {
    const sA = sampleBeta(alphaA, betaA);
    const sB = sampleBeta(alphaB, betaB);
    samplesA[i] = sA;
    samplesB[i] = sB;

    if (sB > sA) bWins++;
    lossASum += Math.max(sB - sA, 0);
    lossBSum += Math.max(sA - sB, 0);
    if (sA > 0) {
      uplifts[i] = (sB - sA) / sA;
    } else {
      uplifts[i] = sB > 0 ? 1e6 : 0; // Guard against division by zero
    }
  }

  samplesA.sort((a, b) => a - b);
  samplesB.sort((a, b) => a - b);
  uplifts.sort((a, b) => a - b);

  const probBBeatsA = bWins / numSamples;
  const expectedLossA = lossASum / numSamples;
  const expectedLossB = lossBSum / numSamples;

  const hdiA: [number, number] = [percentile(samplesA, 0.025), percentile(samplesA, 0.975)];
  const hdiB: [number, number] = [percentile(samplesB, 0.025), percentile(samplesB, 0.975)];
  const upliftHdi: [number, number] = [percentile(uplifts, 0.025), percentile(uplifts, 0.975)];

  const convA = varA.conversions / varA.impressions;
  const convB = varB.conversions / varB.impressions;
  const relUpliftMean = (convB - convA) / convA;
// ---- Decision boundary (safety gate) rules ----
  let status: BayesianResults["status"] = "INCONCLUSIVE";
  let recommendationText =
    "Continue gathering data. The credible intervals heavily overlap and no statistically reliable winner has emerged yet.";

  if (probBBeatsA >= 0.95 && expectedLossB <= 0.0008) {
    status = "WINNER_B";
    recommendationText = `Variant B shows a clear statistically superior conversion rate (+${(relUpliftMean * 100).toFixed(1)}% uplift) with acceptable expected risk. Safe to roll out to 100%.`;
  } else if (probBBeatsA <= 0.05 && expectedLossA <= 0.0008) {
    status = "WINNER_A";
    recommendationText = "Variant B underperformed control (Variant A). Terminate experiment and keep Variant A.";
  } else if (probBBeatsA >= 0.88 && expectedLossB > 0.0012) {
    status = "HIGH_RISK";
    recommendationText =
      "Variant B trends positive, but expected loss exceeds the safety threshold. High variance detected. Keep running to minimize downside risk.";
  }

  // ---- Posterior density curves (for charting) ----
  const minX = Math.min(hdiA[0], hdiB[0]) * 0.85;
  const maxX = Math.max(hdiA[1], hdiB[1]) * 1.15;
  const steps = 60;
  const stepSize = (maxX - minX) / steps;

  const densityCurves: BayesianResults["densityCurves"] = [];
  for (let i = 0; i <= steps; i++) {
    const x = minX + i * stepSize;
    densityCurves.push({
      x: Number(x.toFixed(4)),
      densityA: Number(betaPdf(x, alphaA, betaA).toFixed(2)),
      densityB: Number(betaPdf(x, alphaB, betaB).toFixed(2)),
    });
  }

  // ---- Relative uplift histogram ----
  const minUplift = percentile(uplifts, 0.005);
  const maxUplift = percentile(uplifts, 0.995);
  const upliftSteps = 40;
  const upliftStepSize = (maxUplift - minUplift) / upliftSteps;

  const upliftDistribution: BayesianResults["upliftDistribution"] = [];
  for (let i = 0; i < upliftSteps; i++) {
    const binStart = minUplift + i * upliftStepSize;
    const binEnd = binStart + upliftStepSize;
    const count = uplifts.filter((u) => u >= binStart && u < binEnd).length;
    const mid = (binStart + binEnd) / 2;
    upliftDistribution.push({
      uplift: Number((mid * 100).toFixed(1)),
      density: count / numSamples,
      region: binEnd <= 0 ? "negative" : binStart >= 0 ? "positive" : "zero",
    });
  }

  // Probability of positive uplift (mass of histogram above zero)
  const probPositive = uplifts.filter((u) => u > 0).length / numSamples;

  return {
    variantA: {
      conversionRate: convA,
      alphaPosterior: alphaA,
      betaPosterior: betaA,
      hdi95: hdiA,
    },
    variantB: {
      conversionRate: convB,
      alphaPosterior: alphaB,
      betaPosterior: betaB,
      hdi95: hdiB,
    },
    probBBeatsA,
    expectedLossA,
    expectedLossB,
    relativeUpliftMean: relUpliftMean,
    relativeUpliftHdi95: upliftHdi,
    status,
    recommendationText,
    densityCurves,
    upliftDistribution,
    probabilityUpliftPositive: probPositive,
  };
}