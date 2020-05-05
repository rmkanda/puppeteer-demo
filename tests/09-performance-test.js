const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Performance metrics", () => {
  it("should not exceed 10 MB of heap size", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://v8.dev/");
    const metrics = await page.metrics();
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
});
