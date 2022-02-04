const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/details/";

let browser;

describe("Testing PDP images", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each`
    viewportWidth | pixelRatio | intrinsicWidth
    ${320}        | ${2}       | ${364}
    ${360}        | ${2}       | ${364}
    ${375}        | ${2}       | ${364}
    ${414}        | ${2}       | ${364}
    ${360}        | ${3}       | ${492}
    ${393}        | ${2.75}    | ${492}
    ${412}        | ${2.63}    | ${492}
    ${375}        | ${3}       | ${492}
    ${390}        | ${3}       | ${492}
    ${1366}       | ${1}       | ${567}
    ${414}        | ${3}       | ${567}
    ${428}        | ${3}       | ${567}
    ${768}        | ${2}       | ${773}
    ${1536}       | ${1.25}    | ${773}
    ${1920}       | ${1}       | ${773}
    ${1440}       | ${2}       | ${1088}
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
      //await page.screenshot({ path: `pdp-${viewportWidth}@${pixelRatio}.png` });
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
