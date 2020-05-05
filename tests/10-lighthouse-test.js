const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const { expect } = require("chai");

describe("Lighthouse tests", () => {
  it("should run lightouse", async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: [`--remote-debugging-port=${8042}`],
    });
    const lighthouseResult = await lighthouse("https://v8.dev/", {
      port: 8042,
      disableStorageReset: true,
      onlyCategories: ["seo"],
    });
    console.log(lighthouseResult);
    expect(lighthouseResult.lhr.categories["seo"].score).equals(0.92);
    await browser.close();
  });
});
