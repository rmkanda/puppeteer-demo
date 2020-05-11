const puppeteer = require("puppeteer");

describe("Lang tests", () => {
  it("verify language is changed", async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "Accept-Language": "es",
    });
    await page.goto("https://google.com");
  });
});
