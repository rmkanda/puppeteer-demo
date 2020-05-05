const puppeteer = require("puppeteer");

describe("accessibility tests", () => {
  it("should display accessibility snapshot", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://v8.dev/");
    const snapshpt = await page.accessibility.snapshot();
    console.log(snapshpt);
    await browser.close();
  });
});
