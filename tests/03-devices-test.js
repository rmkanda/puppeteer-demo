const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("Devices tests", () => {
  it("should have title", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    const slow3G = {
      // Network connectivity is absent
      offline: false,
      // Download speed (bytes/s)
      downloadThroughput: ((500 * 1024) / 8) * 0.8,
      // Upload speed (bytes/s)
      uploadThroughput: ((500 * 1024) / 8) * 0.8,
      // Latency (ms)
      latency: 400 * 5,
    };
    await client.send("Network.enable");
    // Simulated network throttling (Slow 3G)
    await client.send("Network.emulateNetworkConditions", slow3G);
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.emulate(puppeteer.devices["iPhone 8"]);

    await page.goto("https://v8.dev/");
    const header = await page.$("#main h1");
    const title = await page.evaluate((header) => header.textContent, header);
    expect(title).equals("What is V8?");
    await browser.close();
  });
});
