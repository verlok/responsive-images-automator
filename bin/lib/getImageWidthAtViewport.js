import probe from "probe-image-size";

import { PIXEL_RATIO, VIEWPORT_WIDTH } from "./constants.js";

export default async function (page, resolution, imageCssSelector) {
  const viewportWidth = resolution[VIEWPORT_WIDTH];
  const pixelRatio = resolution[PIXEL_RATIO];
  const viewportOptions = {
    width: viewportWidth,
    deviceScaleFactor: pixelRatio,
    height: 666,
  };

  console.log(`Setting viewport width ${viewportWidth} @ ${pixelRatio}`);
  await page.setViewport(viewportOptions);
  await page.waitForSelector(imageCssSelector);
  await page.waitForTimeout(100);
  const imgWidth = await page.$eval(imageCssSelector, (image) => image.width);
  const currentSrc = await page.$eval(
    imageCssSelector,
    (image) => image.currentSrc
  );
  const probeResult = await probe(currentSrc);
  const imgIntrinsicWidth = probeResult.width;
  return { imgWidth, imgIntrinsicWidth };
}
