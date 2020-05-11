const fs = require("fs");
const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Performance metrics", () => {
  it("should not exceed 10 MB of heap size", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://v8.dev/");
    const metrics = await page.metrics();
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    console.log(metrics, performanceTiming);
    expect(metrics.JSHeapTotalSize).lessThan(10 * 1024 * 1024);
    await browser.close();
  });

  it("performance tracing", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.tracing.start({ path: "./tacing.json" });
    await page.goto("https://v8.dev/");
    await page.tracing.stop();
    await browser.close();
  });

  it("extract filmstrip screenshots", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0 });

    await page.tracing.start({ screenshots: true, path: "netflix-trace.json" });
    await page.goto("https://www.netflix.com/", { timeout: 60000 });
    await page.tracing.stop();

    // Extract data from the trace
    const tracing = JSON.parse(fs.readFileSync("./netflix-trace.json", "utf8"));
    const traceScreenshots = tracing.traceEvents.filter(
      (x) =>
        x.cat === "disabled-by-default-devtools.screenshot" &&
        x.name === "Screenshot" &&
        typeof x.args !== "undefined" &&
        typeof x.args.snapshot !== "undefined"
    );

    traceScreenshots.forEach(function (snap, index) {
      fs.writeFile(
        `trace-screenshot-${index}.png`,
        snap.args.snapshot,
        "base64",
        function (err) {
          if (err) {
            console.log("writeFile error", err);
          }
        }
      );
    });

    await browser.close();
  });
});
