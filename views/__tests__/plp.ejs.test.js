const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/";

let browser;

describe("Testing PLP images", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each`
    viewportWidth | pixelRatio | intrinsicWidth
    ${375}        | ${3}       | ${364}
    ${414}        | ${2}       | ${364}
    ${390}        | ${3}       | ${364}
    ${375}        | ${2}       | ${364}
    ${414}        | ${3}       | ${364}
    ${360}        | ${3}       | ${364}
    ${428}        | ${3}       | ${364}
    ${1920}       | ${1}       | ${446}
    ${412}        | ${2.63}    | ${364}
    ${1440}       | ${2}       | ${688}
    ${1366}       | ${1}       | ${364}
    ${360}        | ${2}       | ${364}
    ${768}        | ${2}       | ${688}
    ${393}        | ${2.75}    | ${364}
    ${1536}       | ${1.25}    | ${446}
    ${320}        | ${2}       | ${364}
  `(
    `When viewport width is $viewportWidth and pixel ratio is $pixelRatio, image intrinsic width should be $intrinsicWidth`,
    async ({ viewportWidth, pixelRatio, intrinsicWidth }) => {
      const page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.setViewport({
        deviceScaleFactor: pixelRatio,
        width: viewportWidth,
        height: 667,
      });
      await page.goto(pageUrl);
      await page.reload({ waitUntil: "domcontentloaded" });
      /* await page.waitForTimeout(500);
      await page.waitForSelector("img"); */
      await page.waitForFunction(`document.querySelector("img").currentSrc`);
      //await page.screenshot({ path: `plp-${viewportWidth}@${pixelRatio}.png` });
      const body = await page.$("body");
      expect(await body.$eval("img", (img) => img.currentSrc)).toBe(
        `https://via.placeholder.com/${intrinsicWidth}`
      );
    }
  );

  afterAll(async () => {
    await browser.close();
  });
});
