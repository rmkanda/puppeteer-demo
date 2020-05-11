const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Flaky tests", () => {
  it("should have title", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://v8.dev", { waitUntil: "networkidle0" });
    await page.waitForSelector("#main h1");
    const header = await page.$("#main h1");
    const title = await page.evaluate((header) => header.textContent, header);
    expect(title).equals("What is V8?");
    await browser.close();
  });
});
