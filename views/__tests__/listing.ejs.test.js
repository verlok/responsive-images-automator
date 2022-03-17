const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/page/listing";

let browser;

describe("Testing listing page images", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each`
    viewportWidth | pixelRatio | intrinsicWidth
    ${375}        | ${3}       | ${380}
    ${414}        | ${2}       | ${380}
    ${390}        | ${3}       | ${380}
    ${375}        | ${2}       | ${380}
    ${414}        | ${3}       | ${380}
    ${360}        | ${3}       | ${380}
    ${428}        | ${3}       | ${380}
    ${1920}       | ${1}       | ${450}
    ${412}        | ${2.63}    | ${380}
    ${1440}       | ${2}       | ${678}
    ${1366}       | ${1}       | ${380}
    ${360}        | ${2}       | ${380}
    ${768}        | ${2}       | ${678}
    ${393}        | ${2.75}    | ${380}
    ${1536}       | ${1.25}    | ${450}
    ${320}        | ${2}       | ${380}
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
      await page.waitForFunction(`document.querySelector("img").currentSrc`);
      //await page.screenshot({ path: `listing-${viewportWidth}@${pixelRatio}.png` });
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
