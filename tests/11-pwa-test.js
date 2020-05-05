const puppeteer = require("puppeteer");
const chalk = require("chalk");

const displayRequests = (allRequests) => {
  Array.from(allRequests.values()).forEach((req) => {
    const NUM_CHARS = 80;
    const url =
      req.url().length > NUM_CHARS
        ? req.url().slice(0, NUM_CHARS) + "..."
        : req.url();
    console.log(
      url,
      req.response() && req.response().fromServiceWorker()
        ? chalk.green("✔")
        : chalk.red("✕")
    );
  });
};

describe("PWA tests", () => {
  it("should register service worker", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://v8.dev");
    await page.evaluate("navigator.serviceWorker.ready");
    const allRequests = new Map();
    page.on("request", (req) => {
      allRequests.set(req.url(), req);
    });
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: "networkidle0" });
    console.assert(
      await page.evaluate("navigator.serviceWorker.controller"),
      "page has active service worker"
    );
    displayRequests(allRequests);
    await browser.close();
  });
});
