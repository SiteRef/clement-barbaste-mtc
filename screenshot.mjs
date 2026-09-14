import puppeteer from "puppeteer";
import { mkdirSync, readdirSync } from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3001";
const label = process.argv[3] || "";
const outDir = path.resolve("temporary screenshots");
mkdirSync(outDir, { recursive: true });

const existing = readdirSync(outDir).filter((f) => /^screenshot-(\d+)/.test(f));
const nextNum =
  existing.reduce((max, f) => {
    const m = f.match(/^screenshot-(\d+)/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0) + 1;

const fileName = `screenshot-${nextNum}${label ? `-${label}` : ""}.png`;
const outPath = path.join(outDir, fileName);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const width = Number(process.env.SCREENSHOT_WIDTH) || 1440;
const height = Number(process.env.SCREENSHOT_HEIGHT) || 900;
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

// force all lazy images to load, then wait for them
await page.evaluate(() => {
  document.querySelectorAll("img[loading=lazy]").forEach((i) => { i.loading = "eager"; });
});
await page.evaluate(async () => {
  await Promise.all(
    [...document.images].map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
    )
  );
});

// scroll through the page to trigger scroll-reveal animations, then return to top
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = () => {
      window.scrollTo(0, y);
      y += window.innerHeight * 0.8;
      if (y < document.body.scrollHeight) {
        setTimeout(step, 60);
      } else {
        document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
        window.scrollTo(0, 0);
        setTimeout(resolve, 500);
      }
    };
    step();
  });
});

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
