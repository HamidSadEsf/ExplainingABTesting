# Product Case Study — Adaptive Bayesian A/B Testing Dashboard

> A product-manager-centric narrative explaining **why** this prototype exists,
> the problem it solves, and the product decisions behind the implementation.

---

## 1. The Strategic Problem

A/B testing is the backbone of conversion-rate optimization, but the way teams
**consume** experiment results is broken. Most BI and experimentation platforms
surface a single, misleading metric — *"Variant B has a p < 0.05, so B wins"* —
and expect a human to interpret what that actually means for the business.

The real-world consequences of this pattern:

- **False confidence under uncertainty.** A point estimate says nothing about how
  *unsure* the data genuinely is. Teams ship "winners" that were never statistically
  distinct, or stall waiting for a significance level that never arrives.
- **Unquantified downside risk.** Deciding to roll out a variant is a real business bet.
  Deploying a variant that is actually worse has a cost — but almost no product or data
  team estimates *how much* they could lose before committing to the rollout.
- **Silent black-box decisions.** Even when a result exists, the "why" behind a rollout
  is locked in a data scientist's notebook — not in the decision itself. There is no
  audit trail, and no accountability for risky calls.
- **Fragile prior assumptions.** Statistical conclusions depend on baseline beliefs,
  but most tooling never asks teams to examine *how much their assumptions matter*.

This is fundamentally a **product / decision-intelligence problem**, not a statistics
problem. Teams do not lack p-values — they lack **decision context and guardrails**.

## 2. The Product Thesis

> **Uncertainty is a feature, not a bug. The role of an experimentation dashboard is
> not to return a winner — it is to return a *safe, defensible decision*.**

Standard Bayesian experimentation translated into a product experience around four
principles:

### 2.1 Uncertainty First
Show **posterior distributions** (not single-point estimates), 95% **Highest-Density
Intervals (HDIs)**, and **Expected Loss** — the decision inputs that matter. Confidence
is communicated as a range, not a false precision.

### 2.2 Progressive Disclosure
A business-facing recommendation is rendered up front ("Variant B wins — safe to roll
out"), and the underlying statistical reasoning is one click away in an expandable
**"Explain Statistical Reasoning"** panel. This respects both the executive who needs
the bottom line and the practitioner who needs the proof.

### 2.3 Human-in-the-Loop Guardrails
Safety gates are engineered into the UI: the **"Roll Out to 100%"** control is
programmatically **locked** unless strict statistical thresholds are met. Early rollout
is still possible — but only through an explicit **override flow** that records an
**audit-log entry** with the business rationale. Accountability is the UX.
### 2.4 Prior Sensitivity & Debiasing
The dashboard lets a user reassign their **prior belief** (an uninformative flat prior
vs. a skeptical prior anchored around 5% conversion) and immediately recompute the
entire decision surface. This makes the influence of assumptions *visible and testable*
— a lightweight countermeasure to confirmation bias.

## 3. How an Agentic Builder Accelerated Delivery

This prototype was built using **agentic coding** — an AI pair-programming workflow
where the system received a detailed implementation brief and produced a complete,
runnable Next.js application end-to-end, verified at each step:

| Stage | Activity | PM implication |
| --- | --- | --- |
| **Requirements intake** | Translated a statistical + UX spec into a file-by-file build plan | Structured requirements are the fastest path to a working prototype |
| **Core math engine** | Implemented Beta-Binomial Bayes via Monte Carlo (10k draws), PDFs, HDI, Expected Loss | The domain model is the priority — the dashboard is only as credible as its engine |
| **Component assembly** | Wired 8 dashboard widgets + 7 UI primitives into a responsive layout | Component isolation keeps the feedback loop tight and the UI testable |
| **Validation loop** | Repeated compile → run → verify cycles, fixed type errors, verified scenario thresholds | Continuous execution verification stops small bugs from becoming bad demos |
| **Scenario calibration** | Discovered the "High Risk" preset did not actually trigger `HIGH_RISK` under the original parameters, then re-tuned the data to genuinely unlock the gated state | **Demonstrated value:** I did not just trust the demo data — I verified the product actually showed the state it advertised |

## 4. Product Impact

The prototype's job is to **evidence a repeatable, defensible rollout decision process**.
Measured against that brief:

| Capability | How the product delivers |
| --- | --- |
| **Decision clarity** | A single banner communicates status: `WINNER_B`, `WINNER_A`, `INCONCLUSIVE`, or `HIGH_RISK` — plus the probability of B beating A. |
| **Downside quantification** | Expected Loss for deploying B *and* for staying with A — the two-sided real cost of every choice. |
| **Risk gating** | Rollout button physically locked unless `P(B>A) ≥ 95%` **and** Expected Loss ≤ safety threshold. |
| **Accountable overrides** | Forced deployment still possible, but logged with timestamp, scenario, and rationale. |
| **Assumption stress-testing** | Live prior-switching lets any reviewer see sensitivity to beliefs in seconds. |
| **Statistical integrity** | Transparent 10k-draw Monte Carlo engine with exposed formulas — no black box. |

**Recruiter / stakeholder takeaways:**
- This is a **decisioning product** — the artifact proves *clarity of outcome*, not
  just a chart.
- It shows **crossover expertise** between statistics and product UX: knowing *what to
  show* (Expected Loss, HDIs) matters as much as the math.
- The delivery approach demonstrates **agentic coding** as a force multiplier: it
  preserved a working, verifiable build while keeping iteration speed high.

## 5. What I'd Build Next (Product Roadmap)

| Priority | Direction |
| --- | --- |
| P0 | Live data connectors (eventstream → impressions/conversions) replacing mock presets |
| P0 | Multi-variant (A/B/C/N) support + sequential tests |
| P1 | Simulated rollout impact ("what happens if we ship at 50%?") |
| P1 | Goal-based loss functions (revenue / LTV-weighted, not just conversion rate) |
| P2 | Statistical-significance pedagogy mode for stakeholder education |
| P2 | Exportable audit trail + compliance surfaces for regulated rollout decisions |

---

*Continue in [`visual-walkthrough.md`](./visual-walkthrough.md) (demo script) and
[`architecture.md`](./architecture.md) (how the system is purpose-built).*