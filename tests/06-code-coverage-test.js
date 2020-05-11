const puppeteer = require("puppeteer");

describe("Code coverage", () => {
  it("should display js coverage", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.coverage.startJSCoverage();
    await page.goto("https://v8.dev/");
    const jsCoverage = await page.coverage.stopJSCoverage();
    console.log(jsCoverage);
    jsCoverage.map(({ url, ranges, text }) => {
      let usedBytes = 0;
      ranges.forEach((range) => (usedBytes += range.end - range.start - 1));
      console.log({
        url,
        usedBytes,
        totalBytes: text.length,
        percentUsed: `${((usedBytes / text.length) * 100).toFixed(2)}%`,
      });
    });
    await browser.close();
  });
});
