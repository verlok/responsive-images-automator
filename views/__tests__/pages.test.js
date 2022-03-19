const puppeteer = require("puppeteer");
let browser;

const pageNames = ["detail", "listing"];

const testTables = {
  detail: [
    { viewportWidth: 320, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 360, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 375, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 414, pixelRatio: 2, expectedIntrinsicWidth: 380 },
    { viewportWidth: 360, pixelRatio: 3, expectedIntrinsicWidth: 570 },
    { viewportWidth: 393, pixelRatio: 2.75, expectedIntrinsicWidth: 570 },
    { viewportWidth: 412, pixelRatio: 2.63, expectedIntrinsicWidth: 570 },
    { viewportWidth: 375, pixelRatio: 3, expectedIntrinsicWidth: 570 },
    { viewportWidth: 390, pixelRatio: 3, expectedIntrinsicWidth: 570 },
    { viewportWidth: 1366, pixelRatio: 1, expectedIntrinsicWidth: 570 },
    { viewportWidth: 414, pixelRatio: 3, expectedIntrinsicWidth: 570 },
    { viewportWidth: 428, pixelRatio: 3, expectedIntrinsicWidth: 570 },
    { viewportWidth: 768, pixelRatio: 2, expectedIntrinsicWidth: 780 },
    { viewportWidth: 1536, pixelRatio: 1.25, expectedIntrinsicWidth: 780 },
    { viewportWidth: 1920, pixelRatio: 1, expectedIntrinsicWidth: 780 },
    { viewportWidth: 1440, pixelRatio: 2, expectedIntrinsicWidth: 1102 },
  ],
  listing: [
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
  ],
};

for (const pageName of pageNames) {
  const pageUrl = `http://localhost:8080/page/${pageName}`;
  describe(`Testing ${pageName} page image`, () => {
    beforeAll(async () => {
      browser = await puppeteer.launch({
        //headless: false
      });
    });

    test.each(testTables[pageName])(
      "When viewport width is $viewportWidth and pixel ratio is $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth",
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

    afterAll(async () => {
      await browser.close();
    });
  });
}
