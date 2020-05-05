const puppeteer = require("puppeteer");
const { expect } = require("chai");

let browser;

before(async () => {
  browser = await puppeteer.launch();
});

after(() => {
  browser.close();
});

describe("Context tests", () => {
  it("should have title", async () => {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto("https://v8.dev/");
    const header = await page.$("#main h1");
    const title = await page.evaluate((header) => header.textContent, header);
    expect(title).equals("What is V8?");
    await context.close();
  });
});
