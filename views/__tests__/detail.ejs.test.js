const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/page/detail";

let browser;

describe("Testing detail page image", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each`
    viewportWidth | pixelRatio | intrinsicWidth
    ${320}        | ${2}       | ${380}
    ${360}        | ${2}       | ${380}
    ${375}        | ${2}       | ${380}
    ${414}        | ${2}       | ${380}
    ${360}        | ${3}       | ${570}
    ${393}        | ${2.75}    | ${570}
    ${412}        | ${2.63}    | ${570}
    ${375}        | ${3}       | ${570}
    ${390}        | ${3}       | ${570}
    ${1366}       | ${1}       | ${570}
    ${414}        | ${3}       | ${570}
    ${428}        | ${3}       | ${570}
    ${768}        | ${2}       | ${780}
    ${1536}       | ${1.25}    | ${780}
    ${1920}       | ${1}       | ${780}
    ${1440}       | ${2}       | ${1102}
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
      //await page.screenshot({ path: `detail-${viewportWidth}@${pixelRatio}.png` });
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
