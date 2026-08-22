/**
 * Captures branded walkthrough screenshots + an animated walkthrough mp4 of the
 * Adaptive Bayesian A/B Testing Dashboard, using the installed Chrome via
 * puppeteer-core, and encodes still frames with ffmpeg.
 *
 * Run: node scripts/capture-walkthrough.js   (next dev/start must be running on PORT)
 * Env: APP_URL (default http://localhost:3000), PORT
 */
const puppeteer = require("puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SHOTS = path.resolve(__dirname, "..", "assets", "screenshots");
const FRAMES = path.resolve(__dirname, "..", "assets", "r_demo", "frames");
const OUT_WEBM = path.resolve(
  __dirname,
  "..",
  "assets",
  "r_demo",
  "dashboard-walkthrough.webm"
);

const VPW = 1440;
const VPH = 900;
const DPR = 2; // retina crispness

function tick(ms) {
  return new Promise((r) => setTimeout(r, ms || 900));
}

// React-controlled <select> and <textarea> require native setter + bubbling event.
async function setScenario(page, value) {
  await page.evaluate((v) => {
    const sel = document.querySelector("select");
    if (!sel) return;
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(
      sel,
      v
    );
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function waitText(page, needle, timeout = 8000) {
  await page.waitForFunction(
    (n) => document.body && document.body.innerText.includes(n),
    { timeout },
    needle
  );
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function launch() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--window-size=${VPW},${VPH}`,
      "--hide-scrollbars",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: VPW, height: VPH, deviceScaleFactor: DPR });
  return { browser, page };
}

async function main() {
  ensureDir(SHOTS);
  ensureDir(FRAMES);

  const { browser, page } = await launch();
  console.log("Goto", APP_URL);
// Auto-dismiss browser dialogs (the override confirmation uses alert()).
  page.on("dialog", (d) => d.accept());
  await page.goto(APP_URL, { waitUntil: "networkidle0", timeout: 30000 });

  // Hydrate + wait for default (Clear Winner) decision to compute client-side.
  await waitText(page, "Deployment Ready", 15000).catch(() => {});
  await waitText(page, "Roll Out Variant B to 100%", 15000).catch(() => {});
  console.log("Default state rendered (Clear Winner).");
  await tick();

  // ---------- 1) Clear Winner (full page) ----------
  await page.evaluate(() => window.scrollTo(0, 0));
  await tick();
  await page.screenshot({ path: path.join(SHOTS, "01-clear-winner.png") });
  console.log("shot 01-clear-winner");

  // ---------- 2) Inconclusive ----------
  await setScenario(page, "inconclusive");
  await waitText(page, "Data Inconclusive", 8000).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await tick();
  await page.screenshot({ path: path.join(SHOTS, "02-inconclusive.png") });
  console.log("shot 02-inconclusive");

  // ---------- 3) High Risk ----------
  await setScenario(page, "high-risk");
  await waitText(page, "Gate Locked", 8000).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await tick();
  await page.screenshot({ path: path.join(SHOTS, "03-high-risk.png") });
  console.log("shot 03-high-risk");

  // ---------- 4) Override modal (reliable open + capture) ----------
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button")).find((x) =>
      x.textContent.includes("Manual Override")
    );
    if (b) {
      b.scrollIntoView({ block: "center" });
      b.click();
    }
  });
  await page.waitForFunction(
    () => document.body.innerText.includes("Bypass Statistical Safety Gate"),
    { timeout: 6000 }
  ).catch(() => {});
  await page.evaluate(() => {
    const ta = document.querySelector("textarea");
    if (ta) {
      Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      ).set.call(ta, "Marketing promo launch deadline — commercial imperative.");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await tick(500);
  await page.screenshot({ path: path.join(SHOTS, "04-override-modal.png") });
  console.log("shot 04-override-modal");
  // Confirm (audit log) then cancel is no longer needed — just close the modal.
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button")).find((x) =>
      x.textContent.includes("Confirm Forced Deployment")
    );
    if (b) b.click();
  });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Bypass Statistical Safety Gate"),
    { timeout: 6000 }
  ).catch(() => {});

  // ---------- 5) Prior sensitivity ----------
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button")).find((x) =>
      x.textContent.includes("Skeptical Prior")
    );
    if (b) b.click();
  });
  await tick();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await tick();
  await page.screenshot({ path: path.join(SHOTS, "05-prior-sensitivity.png") });
  console.log("shot 05-prior-sensitivity");

  // ---------- Animated walkthrough frames ----------
  // Reset to Clear Winner for the recording opening.
  await setScenario(page, "clear-winner");
  await page.evaluate(() => window.scrollTo(0, 0));
  await waitText(page, "Roll Out Variant B to 100%", 8000).catch(() => {});

  // Scenes = [duration in frames, action before capturing frames].
  const scenes = [
    [26, async () => {
      await setScenario(page, "clear-winner");
      await page.evaluate(() => window.scrollTo(0, 0));
    }],
    [20, async () => page.evaluate(() => window.scrollTo(0, 560))],
    [22, async () => {
      await setScenario(page, "inconclusive");
      await page.evaluate(() => window.scrollTo(0, 0));
    }],
    [22, async () => {
      await setScenario(page, "high-risk");
      await page.evaluate(() => window.scrollTo(0, 0));
    }],
    [18, async () => page.evaluate(() => window.scrollTo(0, 300))],
    // Override: open modal, type rationale, confirm -> audit log appears.
    [12, async () => {
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll("button")).find((x) =>
          x.textContent.includes("Manual Override"));
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); }
      });
    }],
    [16, async () => {
      await page.evaluate(() => {
        const ta = document.querySelector("textarea");
        if (ta && !ta.value) {
          Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
            .set.call(ta, "Marketing promo launch deadline - commercial imperative.");
          ta.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }],
    [12, async () => {
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll("button")).find((x) =>
          x.textContent.includes("Confirm Forced Deployment"));
        if (b) b.click();
      });
    }],
    [18, async () => page.evaluate(() => window.scrollTo(0, 220))], // audit log visible
    // Prior sensitivity: switch to skeptical prior.
    [16, async () => {
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll("button")).find((x) =>
          x.textContent.includes("Skeptical Prior"));
        if (b) b.click();
      });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }],
    [14, async () => page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))],
    // Closing: return to Clear Winner.
    [14, async () => {
      await setScenario(page, "clear-winner");
      await page.evaluate(() => window.scrollTo(0, 0));
      await waitText(page, "Roll Out Variant B to 100%", 6000).catch(() => {});
    }],
  ];

  let idx = 0;
  for (const [dur, act] of scenes) {
    await act();
    await tick(240);
    for (let f = 0; f < dur; f++) {
      const name = `frame-${String(idx++).padStart(4, "0")}.png`;
      await page.screenshot({ path: path.join(FRAMES, name) });
      await new Promise((r) => setTimeout(r, 65));
    }
  }
  console.log("captured frames:", idx);

  await browser.close();

  // ---------- Encode the walkthrough as a lightweight WebM ----------
  // VP9 gives best quality-per-byte; fall back to VP8 if the encoder is absent.
  const input = path.join(FRAMES, "frame-%04d.png");
  const vp9 =
    `ffmpeg -y -framerate 15 -i "${input}" ` +
    `-vf "scale=${VPW}:-2,format=yuv420p" ` +
    `-c:v libvpx-vp9 -b:v 900k -crf 34 -row-mt 1 -movflags +faststart "${OUT_WEBM}"`;
  try {
    execSync(vp9, { stdio: "ignore" });
    console.log("encoded (vp9):", OUT_WEBM);
  } catch (e) {
    console.log("VP9 unavailable, trying VP8…");
    try {
      execSync(
        `ffmpeg -y -framerate 15 -i "${input}" -vf "scale=${VPW}:-2,format=yuv420p" ` +
          `-c:v libvpx -b:v 1200k -crf 10 "${OUT_WEBM}"`,
        { stdio: "ignore" }
      );
      console.log("encoded (vp8):", OUT_WEBM);
    } catch (e2) {
      console.error("ffmpeg webm encoding failed (skipping):", e2.message);
    }
  }
}

main().catch((e) => {
  console.error("CAPTURE FAILED:", e);
  process.exit(1);
});