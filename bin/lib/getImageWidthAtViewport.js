import probe from "probe-image-size";

import { PIXEL_RATIO, VIEWPORT_WIDTH } from "./constants.js";

export default async function (
  page,
  resolution,
  imageCssSelector,
  forceReload = false
) {
  const viewportWidth = resolution[VIEWPORT_WIDTH];
  const pixelRatio = resolution[PIXEL_RATIO];
  const viewportOptions = {
    width: viewportWidth,
    deviceScaleFactor: pixelRatio,
    height: 666,
  };

  console.log(`Setting viewport width ${viewportWidth} @ ${pixelRatio}`);
  await page.setCacheEnabled(false);
  await page.setViewport(viewportOptions);
  if (forceReload) {
    await page.reload({ waitUntil: "domcontentloaded" });
  }
  await page.waitForFunction(
    `document.querySelector("${imageCssSelector}").currentSrc`
  );
  const imgWidth = await page.$eval(imageCssSelector, (image) => image.width);
  const currentSrc = await page.$eval(
    imageCssSelector,
    (image) => image.currentSrc
  );
  const probeResult = await probe(currentSrc);
  const imgIntrinsicWidth = probeResult.width;
  return { imgWidth, imgIntrinsicWidth };
}
