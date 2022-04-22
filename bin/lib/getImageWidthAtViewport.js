import probe from "probe-image-size";

import { PIXEL_RATIO, VIEWPORT_WIDTH } from "./constants.js";

const domainFinder =
  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim;

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
    //console.log("Reloading the page");
    await page.reload({ waitUntil: "domcontentloaded" });
  }
  await page.waitForSelector(imageCssSelector);
  await page.waitForFunction(
    `document.querySelector("${imageCssSelector}").currentSrc`
  );
  const imgWidth = await page.$eval(imageCssSelector, (image) => image.width);
  const currentSrc = await page.$eval(
    imageCssSelector,
    (image) => image.currentSrc
  );
  domainFinder.lastIndex = 0;
  const domainResults = domainFinder.exec(currentSrc);
  const referer = domainResults[0];
  const imgIntrinsicWidth = await probe(currentSrc, {
    response_timeout: 2000,
    headers: {
      accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-encoding": "gzip, deflate, br",
      referer: referer,
      "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,it;q=0.7",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
    },
  })
    .then((res) => res.width)
    .catch((err) => {
      console.log(
        `Probe failed for ${currentSrc}, getting 0 as currently downloaded intrinsic image width`
      );
      return 0;
    });
  return { imgWidth, imgIntrinsicWidth };
}
