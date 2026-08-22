# Product Requirements — Adaptive Bayesian A/B Testing Dashboard (PRD Summary)

A condensed product requirements document. Written to demonstrate how I frame
a spec before any implementation begins.

## 1. Problem Statement

Teams cannot translate experimentation statistics into **safe, defensible, auditable
rollout decisions**. Current tooling optimizes for *significance reporting*, not
*decision intelligence*, leaving uncertainty and downside risk invisible.

## 2. Goals / Non-Goals

**Goals**
- Expose uncertainty (posterior distributions, HDIs, Expected Loss) as first-class UI.
- Gate risky auto-rollouts behind statistical thresholds + an accountable override.
- Let users stress-test prior assumptions in the decision surface.

**Non-Goals (v1)**
- Production feature-flag deployment (replaced by an explicit override + audit trail).
- Multi-variant / sequential tests (roadmapped, not built).
- Live data ingestion (mock scenarios demonstrate the decision states).

## 3. Users & Jobs-To-Be-Done

| Persona | JTBD |
| --- | --- |
| Product Manager | "Decide *safely* whether to roll out, fast, with uncovered confidence in the reasoning." |
| Data Scientist | "Verify the statistical decision is sound and the math is transparent." |
| Executive / Reviewer | "Understand the bottom line and the degree of risk without reading tables." |

## 4. Functional Requirements

- **F1 — Decision Status:** System computes and displays `WINNER_B | WINNER_A |
  INCONCLUSIVE | HIGH_RISK` from the Monte Carlo engine.
- **F2 — Safety Gate:** Rollout control surfaces **disabled** except in `WINNER_B`.
- **F3 — Override & Audit:** Manual override requires a written rationale and emits a
  timestamped audit-log entry.
- **F4 — Uncertainty UI:** Overlapping posterior curves, 95% HDI bands, Expected Loss
  meters, and an uplift distribution that is color-coded by sign.
- **F5 — Prior Sensitivity:** Switch between uninformative and skeptical priors with
  live recomputation.

## 5. Acceptance Criteria (excerpts)

1. Given "Clear Winner" data, the app must render `WINNER_B` and an *enabled* rollout
   button.
2. Given "High Risk" data, the app must render `HIGH_RISK` and a *disabled* rollout
   button while `P(B>A) ≈ 90%`.
3. The override modal must require non-empty rationale before confirming.
4. After override, a visible audit-log line appears with timestamp + scenario + rationale.
5. Switching prior must recompute status/posterior without reload.

## 6. Current Implementation Status

All acceptance criteria above are **verified passing** against the built app.

## 7. Iteration & Recalibration

An engineering-level discovery: the original "High Risk" mock parameters did **not**
actually trigger `HIGH_RISK` (they read as inconclusive). The data was recalibrated so
the product genuinely demonstrates the gated, downside-risk state — highlighting why
requirement-to-observation traceability matters.

---

Related: [Product Impact narrative](./product-case-study.md) · [Build architecture](./architecture.md)