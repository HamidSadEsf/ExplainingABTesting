# Architecture — How the System Is Purpose-Built

A technical tour that connects each directory and component to the product outcome
it enables. This is the file a hiring engineer will read to judge implementation quality.

## High-Level Design

```
                 ┌───────────────────────────────┐
                 │       app/page.tsx             │  ← Product canvas
                 │  (state, scenario, prior)      │
                 └──────────────┬────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
   ┌────────────────┐  ┌───────────────┐  ┌─────────────────┐
   │ Decision        │  │ Visual 2/3    │  │ Controls        │
   │ Banner          │  │ Posterior     │  │ Expected Loss   │
   │ (Gate)          │  │ Uplift        │  │ Reasoning       │
   └────────────────┘  └───────────────┘  │ Inspector       │
                       ◄─ data from  ──►  │ Sensitivity     │
                       └───────────────── │ Panel           │
                                          └────────┬────────┘
                                                   ▼
                                     ┌─────────────────────────┐
                                     │  lib/bayesian-engine.ts  │
                                     │  Beta PDF → Monte Carlo │
                                     │  P(B>A) · Expected Loss │
                                     └─────────────────────────┘
```

## Directory Map

| Path | Role | Product rationale |
| --- | --- | --- |
| `src/app/` | Next.js App Router entrypoint (`layout`, `page`, `globals.css`) | Single source of truth for page-level state and composition |
| `src/components/dashboard/` | Feature widgets: decision banner, charts, risk, inspector, override | Each widget owns one **decision moment** — easy to unit-test and reuse |
| `src/components/ui/` | Stateless primitives: `badge`, `button`, `card`, `dialog`, `slider`, `switch`, `tabs` | Consistent, accessible building blocks keep the UI predictable as scope grows |
| `src/lib/` | Pure-statistics layer (`bayesian-engine`, `types`, `mock-data`) + `utils` | The math is **decoupled from the UI**, so it can be tested and reused independently |
| `docs/` | This narrative + the demo "recording script" | The repo documents *decisions*, not just code |
| `assets/` | Demo imagery + rDOM recording target | Visual proof-of-concept materials reviewers can inspect |

## Key Product → Code Mappings

**The Safety Gate** — `DecisionBanner.isRolloutAllowed`
```ts
const isRolloutAllowed = results.status === "WINNER_B";
```
The rollout button is *disabled by default*. The only path to enabled is the
`WINNER_B` state — which the engine only reaches when **both** `P(B>A) ≥ 0.95`
**and** `ExpectedLoss(B) ≤ 0.0008` hold. The gate **is** the decision rule.

**The Override (accountability)** — `OverrideModal`
A forced deployment is possible, but never silent:
`[OVERRIDE LOG <ISO time>] Scenario: … | Rationale: …`
The rationale is *required* (the confirm button disables until text is entered),
enforcing a written audit trail as a UX constraint.

**Progressive Disclosure** — `ReasoningInspector`
Default closed → recommendation first. One click reveals the full derivation:
posterior mechanics, the `P(B>A)` Monte Carlo comparison, and the two guardrail
conditions. The same data powers both the executive summary and the deep dive.

**Scenario presets** — `mock-data.ts`
Three calibrated worlds that each exercise a distinct UI state. Notably, the
"High Risk" preset was **verified and re-tuned** so it genuinely triggers `HIGH_RISK`
(gated) rather than appearing benignly inconclusive.

## Why This Architecture Scales

- **Pure math in `src/lib`** means the statistical engine is a standalone, testable
  module — the first thing to harden as this becomes production data.
- **Stateless primitives** (`components/ui`) keep visual language consistent as new
  dashboards are added.
- **Page-level composition** in `src/app/page.tsx` treats the dashboard as a
  configurable assembly — swapping a widget (e.g., adding a "Revenue-weighted Loss"
  card) is additive, not invasive.
- **Documentation roadmaps** the next increment clearly, from mock data to live
  connectors.

*Model details in [`statistical-model.md`](./statistical-model.md).*
*Live demo narrative in [`visual-walkthrough.md`](./visual-walkthrough.md).*