import { IMAGE_CSS_SELECTOR, PIXEL_RATIO, VIEWPORT_WIDTH } from "./constants.js";

export default async function (page, resolution, extractionRule) {
  const viewportWidth = resolution[VIEWPORT_WIDTH];
  const pixelRatio = resolution[PIXEL_RATIO];
  const imageCssSelector = extractionRule[IMAGE_CSS_SELECTOR];
  const viewportOptions = {
    width: viewportWidth,
    deviceScaleFactor: pixelRatio,
    height: 666,
  };

  console.log(`Setting viewport width ${viewportWidth} @ ${pixelRatio}`);
  await page.setViewport(viewportOptions);
  await page.waitForSelector(imageCssSelector);
  await page.waitForTimeout(100);
  return await page.$eval(imageCssSelector, (image) => image.width);
}
