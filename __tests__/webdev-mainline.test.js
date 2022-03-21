const pageName = "webdev-mainline";
const testTable = [
  { viewportWidth: 375, pixelRatio: 3, expectedIntrinsicWidth: 1125 },
  { viewportWidth: 414, pixelRatio: 2, expectedIntrinsicWidth: 828 },
  { viewportWidth: 390, pixelRatio: 3, expectedIntrinsicWidth: 1125 },
  { viewportWidth: 375, pixelRatio: 2, expectedIntrinsicWidth: 750 },
  { viewportWidth: 414, pixelRatio: 3, expectedIntrinsicWidth: 1366 },
  { viewportWidth: 360, pixelRatio: 3, expectedIntrinsicWidth: 1125 },
  { viewportWidth: 428, pixelRatio: 3, expectedIntrinsicWidth: 1366 },
  { viewportWidth: 1920, pixelRatio: 1, expectedIntrinsicWidth: 1600 },
  { viewportWidth: 412, pixelRatio: 2.63, expectedIntrinsicWidth: 1125 },
  { viewportWidth: 1440, pixelRatio: 2, expectedIntrinsicWidth: 1920 },
  { viewportWidth: 1366, pixelRatio: 1, expectedIntrinsicWidth: 1366 },
  { viewportWidth: 360, pixelRatio: 2, expectedIntrinsicWidth: 750 },
  { viewportWidth: 768, pixelRatio: 2, expectedIntrinsicWidth: 1600 },
  { viewportWidth: 393, pixelRatio: 2.75, expectedIntrinsicWidth: 1125 },
  { viewportWidth: 1536, pixelRatio: 1.25, expectedIntrinsicWidth: 1920 },
  { viewportWidth: 320, pixelRatio: 2, expectedIntrinsicWidth: 750 },
];

// -------------
// -------------
// -------------

const puppeteer = require("puppeteer");
const pageUrl = `http://localhost:8080/page/${pageName}`;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    //headless: false
  });
});

describe(`Testing ${pageName} page image`, () => {
  test.each(testTable)(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
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
      //await page.screenshot({ path: `detail-${viewportWidth}@${pixelRatio}.png` });
      const body = await page.$("body");
      expect(await body.$eval("img", (img) => img.currentSrc)).toBe(
        `https://via.placeholder.com/${expectedIntrinsicWidth}`
      );
    }
  );
});

afterAll(async () => {
  await browser.close();
});
