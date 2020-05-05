const puppeteer = require("puppeteer");

describe("Code coverage", () => {
  it("should display js coverage", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.coverage.startJSCoverage();
    await page.goto("https://v8.dev/");
    const jsCoverage = await page.coverage.stopJSCoverage();
    console.log(jsCoverage);
    await browser.close();
  });
});
