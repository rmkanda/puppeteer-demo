const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Intercepting network requests", () => {
  it("should replace logo", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (
        request.url() === "https://v8.dev/_img/v8-outline.svg" ||
        request.url() === "https://v8.dev/_img/v8.svg"
      ) {
        request.abort();
        // request.respond();
      } else request.continue();
    });
    await page.goto("https://v8.dev/");
    const header = await page.$("#main h1");
    const title = await page.evaluate((header) => header.textContent, header);
    expect(title).equals("What is V8?");
    await browser.close();
  });
});
