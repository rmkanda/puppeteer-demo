const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://v8.dev/");
  const header = await page.$("#main h1");
  const text = await page.evaluate((header) => header.textContent, header);
  console.log(text);
  await browser.close();
})();
