const fs = require("fs");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator");
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
    });
    console.log(lighthouseResult);

    expect(lighthouseResult.lhr.categories["seo"].score).equals(0.93);

    const first_contentful_paint =
      lighthouseResult.lhr.audits["first-contentful-paint"].displayValue;
    const total_blocking_time =
      lighthouseResult.lhr.audits["total-blocking-time"].displayValue;
    const time_to_interactive =
      lighthouseResult.lhr.audits["interactive"].displayValue;

    console.log(`Lighthouse metrics: 
       First Contentful Paint: ${first_contentful_paint}, 
       Total Blocking Time: ${total_blocking_time},
       Time To Interactive: ${time_to_interactive}`);

    const html = reportGenerator.generateReport(lighthouseResult.lhr, "html");
    fs.writeFile("report.html", html, function (err) {
      if (err) throw err;
    });
    await browser.close();
  });
});
