const pageName = "home";
const testTable = [
  { viewportWidth: 375, pixelRatio: 3, expectedIntrinsicWidth: 708 },
  { viewportWidth: 414, pixelRatio: 2, expectedIntrinsicWidth: 708 },
  { viewportWidth: 390, pixelRatio: 3, expectedIntrinsicWidth: 708 },
  { viewportWidth: 375, pixelRatio: 2, expectedIntrinsicWidth: 708 },
  { viewportWidth: 414, pixelRatio: 3, expectedIntrinsicWidth: 708 },
  { viewportWidth: 360, pixelRatio: 3, expectedIntrinsicWidth: 708 },
  { viewportWidth: 428, pixelRatio: 3, expectedIntrinsicWidth: 708 },
  { viewportWidth: 1920, pixelRatio: 1, expectedIntrinsicWidth: 560 },
  { viewportWidth: 412, pixelRatio: 2.63, expectedIntrinsicWidth: 708 },
  { viewportWidth: 1440, pixelRatio: 2, expectedIntrinsicWidth: 1076 },
  { viewportWidth: 1366, pixelRatio: 1, expectedIntrinsicWidth: 560 },
  { viewportWidth: 360, pixelRatio: 2, expectedIntrinsicWidth: 708 },
  { viewportWidth: 768, pixelRatio: 2, expectedIntrinsicWidth: 560 },
  { viewportWidth: 393, pixelRatio: 2.75, expectedIntrinsicWidth: 708 },
  { viewportWidth: 1536, pixelRatio: 1.25, expectedIntrinsicWidth: 708 },
  { viewportWidth: 320, pixelRatio: 2, expectedIntrinsicWidth: 560 },
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
