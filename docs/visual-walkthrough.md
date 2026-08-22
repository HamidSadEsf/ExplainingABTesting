# Visual Walkthrough — The Demo Script

This document is the **recording script** for the visual walkthrough of the dashboard.
It tells a viewer exactly what to look for at each second of the rDOM recording, and
it tells you exactly how to reproduce the recording yourself.

> **Where the recording lives:** the finished walkthrough is already recorded at
> `assets/r_demo/dashboard-walkthrough.webm` (lightweight VP9, ~480 KB) and is embedded
> in the `README.md` Visual Walkthrough section. A full-resolution still is kept at
> `assets/screenshots/`.
>
> Regenerate everything (stills + webm) automatically with:
> `node scripts/capture-walkthrough.js`
> (requires the app running and Google Chrome installed).

---

## How to Capture the Recording (30–45 seconds)

Recommended: browser's built-in screen recorder (Chrome "Record tab" / Loom / OBS).

1. `npm install && npm run dev`, then open http://localhost:3000.
2. Scroll to top. From the **Preset Scenario** dropdown, select **"Clear Winner"**.
3. Press record. Perform the steps below in order, narrating option ① or ④ as you go.

## 1 / 5 — Clear Winner (the unlocked gate)

- **Observe:** Read the top banner — `Deployment Ready: Variant B Wins` with
  `P(B > A): ≈100%`, and a **green, enabled** button: *"Roll Out Variant B to 100%"*.
- **Narrator cue:** *"This is what a safe decision looks like — both probability and
  downside cost clear the bar, so the gate is open."*
- **Interact (optional):** Expand **"Explain Statistical Reasoning"** and point to the
  two guardrail conditions.

## 2 / 5 — Inconclusive (honest uncertainty)

- **Setup:** Switch preset to **"Early Stages / High Uncertainty"** (≈2,400 users).
- **Observe:** Banner flips to **Data Inconclusive: Continue Experiment**, the button
  is **gated/locked**, and the posterior curves **heavily overlap**.
- **Narrator cue:** *"Low sample size, overlapping intervals — the honest UI says 'keep
  gathering data', not 'pretend there's a winner'."*

## 3 / 5 — High Risk (the locked gate — the money shot)

- **Setup:** Switch to **"High Variance / Downside Risk"**.
- **Observe:** Banner reads **Gate Locked: High Variance / Potential Downside Risk**,
  and the **Expected Loss** meter in the right column exceeds the safety threshold
  (amber), while the rollout button stays **locked**. The **Relative Uplift** chart is
  mostly positive (P(uplift>0) ≈ 90%) yet the deployment is refused.
- **Narrator cue:** *"This is the guardrail's thesis: 'probably better' is not enough —
  * if the cost of being wrong is too high, we keep it behind an override."*

## 4 / 5 — The Override & Audit Trail (accountability)

- **Setup:** While in High Risk, click **"Manual Override..."**.
- **Observe:** A modal requires a **written business rationale** (confirm button is
  disabled until text is entered). Submit a reason like *"Marketing promo launch
  deadline"*.
- **Observe:** An **audit-log entry** appears in amber atop the dashboard:
  `[OVERRIDE LOG <timestamp>] Scenario: … | Rationale: …`
- **Narrator cue:** *"We never fully block a business decision — we make the risky
  ones *accountable* and visible."*

## 5 / 5 — Prior Sensitivity (assumption stress-test)

- **Setup:** (optional frame) Switch **Prior** from *Uninformative (Beta(1,1))* to
  *Skeptical (Beta(50,950))* and watch the posterior curves and the status recompute
  live.
- **Narrator cue:** *"Same data, different priors — the dashboard makes the influence
  of assumptions visible before anyone commits."*

---

## Critical Observations for the Reviewer

| Watch for | What it proves |
| --- | --- |
| Button state changes with scenario | The gate is wired to the decision engine, not hard-coded |
| Expected Loss meter vs. threshold | Risk is quantified and visible, not buried |
| Overlap of posterior curves | Uncertainty is shown, not hidden |
| Override requires typed rationale | Accountability is a UX constraint |
| Prior switch recalculates | Assumptions are strippable and testable |

---

## Reproducing as a Loom / YouTube

1. Record at 1080p, ~40–60 seconds, minimal pauses.
2. Add light captions for the two guardrail conditions.
3. Keep the console/browser tab crop to the dashboard only (no hidden toolbars).
4. Paste the link into the `README.md` *Visual Walkthrough* block and replace the
   placeholder image with a frame from the recording.

> **Production engineers:** a full technical tour of the model math and architecture is
> in [`statistical-model.md`](./statistical-model.md) and [`architecture.md`](./architecture.md).