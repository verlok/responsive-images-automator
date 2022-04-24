const Mustache = require("mustache");
const defaultTemplate = `https://via.placeholder.com/{{width}}`;

const testFnFactory = (pageUrl, imageTemplate) => {
  return async ({ viewportWidth, pixelRatio, expectedIntrinsicWidth }) => {
    await page.setCacheEnabled(false);
    await page.setViewport({
      deviceScaleFactor: pixelRatio,
      width: viewportWidth,
      height: 667,
    });
    await page.goto(pageUrl);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(`document.querySelector("img").currentSrc`);
    const body = await page.$("body");
    const templateToUse = imageTemplate || defaultTemplate;
    const expectedUrl = Mustache.render(templateToUse, {
      width: expectedIntrinsicWidth,
    });
    expect(await body.$eval("img", (img) => img.currentSrc)).toBe(expectedUrl);
  };
};

module.exports = testFnFactory;
