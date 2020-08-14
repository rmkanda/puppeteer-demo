const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Offline tests", () => {
  it("should load page when offline", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const context = await browser.defaultBrowserContext();
    const page = await context.newPage();
    await page.goto("https://v8.dev/", { waitUntil: "networkidle0" });
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: "networkidle0" });
    const header = await page.$("#main h1");
    const title = await page.evaluate((header) => header.textContent, header);
    expect(title).equals("What is V8?");
    await browser.close();
  });
});
