# Assets — Visual Evidence

This folder holds the visual proof-of-concept materials reviewers can inspect.

| Path | Expected content |
| --- | --- |
| `assets/screenshots/` | Full-resolution stills of each UI state (`01-clear-winner` … `05-prior-sensitivity`) |
| `assets/r_demo/` | The recorded walkthrough (`dashboard-walkthrough.webm`, ~480 KB) and the raw frame sequence in `frames/` |

## Present

- **Screenshots (5):** clear winner, inconclusive, high risk, override modal, prior sensitivity.
- **Walkthrough:** `r_demo/dashboard-walkthrough.webm` — a ~14-second VP9 video embedded
  in the README's Visual Walkthrough section.

## Regenerating assets

Both are produced automatically by:

```bash
node scripts/capture-walkthrough.js
```

Prerequisites: the app running locally and Google Chrome installed. The script drives
the real browser through all five states, saves stills, captures ~210 frames, and
encodes them into a lightweight WebM with ffmpeg.