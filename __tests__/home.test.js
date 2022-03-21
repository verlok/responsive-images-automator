const puppeteer = require("puppeteer");
const pageUrl = "http://127.0.0.1:8080/page/home";

let browser;

describe("Testing home page images", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //headless: false
    });
  });

  test.each`
    viewportWidth | pixelRatio | intrinsicWidth
    ${375}        | ${3}       | ${708}
    ${414}        | ${2}       | ${708}
    ${390}        | ${3}       | ${708}
    ${375}        | ${2}       | ${708}
    ${414}        | ${3}       | ${708}
    ${360}        | ${3}       | ${708}
    ${428}        | ${3}       | ${708}
    ${1920}       | ${1}       | ${560}
    ${412}        | ${2.63}    | ${708}
    ${1440}       | ${2}       | ${1076}
    ${1366}       | ${1}       | ${560}
    ${360}        | ${2}       | ${708}
    ${768}        | ${2}       | ${560}
    ${393}        | ${2.75}    | ${708}
    ${1536}       | ${1.25}    | ${708}
    ${320}        | ${2}       | ${560}
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
