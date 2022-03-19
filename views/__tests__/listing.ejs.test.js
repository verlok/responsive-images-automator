const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/page/listing";

let browser;

describe("Testing listing page images", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each([
    { viewportWidth: 375, pixelRatio: 3, expectedIntrinsicWidth: 380 },
    { viewportWidth: 414, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 390, pixelRatio: 3, expectedIntrinsicWidth: 380 },
    { viewportWidth: 375, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 414, pixelRatio: 3, expectedIntrinsicWidth: 380 },
    { viewportWidth: 360, pixelRatio: 3, expectedIntrinsicWidth: 380 },
    { viewportWidth: 428, pixelRatio: 3, expectedIntrinsicWidth: 380 },
    { viewportWidth: 1920, pixelRatio: 1, expectedIntrinsicWidth: 450 },
    { viewportWidth: 412, pixelRatio: 2.63, expectedIntrinsicWidth: 380 },
    { viewportWidth: 1440, pixelRatio: 2, expectedIntrinsicWidth: 678 },
    { viewportWidth: 1366, pixelRatio: 1, expectedIntrinsicWidth: 380 },
    { viewportWidth: 360, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 768, pixelRatio: 2, expectedIntrinsicWidth: 678 },
    { viewportWidth: 393, pixelRatio: 2.75, expectedIntrinsicWidth: 380 },
    { viewportWidth: 1536, pixelRatio: 1.25, expectedIntrinsicWidth: 450 },
    { viewportWidth: 320, pixelRatio: 2, expectedIntrinsicWidth: 380 },
  ])(
    "When viewport width is $viewportWidth and pixel ratio is $pixelRatio, image intrinsic width should be $intrinsicWidth",
    async ({ viewportWidth, pixelRatio, expectedIntrinsicWidth }) => {
      const page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.setViewport({
        deviceScaleFactor: pixelRatio,
        width: viewportWidth,
        height: 667,
      });
      await page.goto(pageUrl);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(`document.querySelector("img").currentSrc`);
      //await page.screenshot({ path: `listing-${viewportWidth}@${pixelRatio}.png` });
      const body = await page.$("body");
      expect(await body.$eval("img", (img) => img.currentSrc)).toBe(
        `https://via.placeholder.com/${expectedIntrinsicWidth}`
      );
    }
  );

  afterAll(async () => {
    await browser.close();
  });
});
