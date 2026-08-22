# Statistical Model — Accessible Math, No Black Box

A plain-language explanation of the Bayesian engine in `src/lib/bayesian-engine.ts`.
The goal: any reviewer should understand **what the dashboard tells them** and
**how confident it can honestly be**.

## The Setup: Beta-Binomial Model

Each variant's conversion rate is treated as an unknown probability `θ` (theta). We
start with a **prior** belief about `θ`, observe real traffic, and update to a
**posterior**. Using the Beta distribution (the mathematical conjugate of the
binomial likelihood) makes this update a simple, closed-form arithmetic step:

```
α_post = α_prior + conversions
β_post = β_prior + (impressions − conversions)
```

| Prior | α | β | Assumption embodied |
| --- | :-: | :-: | --- |
| Uninformative | 1 | 1 | Every rate from 0–100% equally likely (flat, no bias) |
| Skeptical | 50 | 950 | Anchors near ~5% — requires strong evidence to move |

## Turning Posterior into Decisions (Monte Carlo, 10,000 draws)

Instead of a single point estimate, we **sample the full distribution**:

1. Draw 10,000 values from the posterior of Variant A and 10,000 from Variant B.
2. Compare each paired draw to estimate:

| Metric | Definition | Why it matters |
| --- | --- | --- |
| **P(B > A)** | fraction of draws where `sample_B > sample_A` | The honest probability B truly converts higher |
| **Expected Loss(B)** | `mean(max(sample_A − sample_B, 0))` | The *real downside cost* of deploying B if it were actually worse |
| **Expected Loss(A)** | `mean(max(sample_B − sample_A, 0))` | The symmetric cost of staying with A when B is actually better |
| **Relative Uplift** | `(sample_B − sample_A) / sample_A` | The distribution of % improvement, not just the mean |

3. The 2.5th / 97.5th percentiles of each sample set become the **95% Highest
Density Interval (HDI)** — the credible band shown on every chart.

## Density Curves (the overlapping charts)

The curves are the analytical **Beta PDF** evaluated across the rate axis, using a
fast Lanczos approximation for the log-Gamma function to avoid underflow. Overlaying
the two curves is the visual truth of uncertainty: **the more they overlap, the less
distinct the variants are**.

## The Decision Boundary (Safety Gate)

The dashboard never guesses. It maps the statistics to a state machine:

```
WINNER_B      P(B>A) ≥ 0.95   and  ExpectedLoss(B) ≤ 0.0008   → gate UNLOCKED
WINNER_A      P(B>A) ≤ 0.05   and  ExpectedLoss(A) ≤ 0.0008  → keep control
HIGH_RISK     P(B>A) ≥ 0.88   but  ExpectedLoss(B) > 0.0012  → gate LOCKED (risk)
INCONCLUSIVE  otherwise (or sample < 5000)                     → keep running
```

The critical design choice: **high confidence alone is not enough to ship**. A variant
is only auto-released when it is both *likely better* **and** the cost of being wrong
is bounded. A "Probable But Risky" result stays behind the override.

## Why This Is the Right Model for the Product

- **Posterior ≠ p-value.** The dashboard answers "how sure are we *and* how wrong
  could we be?" — not just "is there a null-hypothesis difference?"
- **Expected Loss reframes risk as a decision cost.** That is the metric a PM can
  actually act on.
- **Explicit priors** turn an invisible assumption into a visible, strippable control.
- **10k-draw Monte Carlo** is transparent and auditable — no opaque black-box.

---

Next: put the model to work in the live demo — [`visual-walkthrough.md`](./visual-walkthrough.md).