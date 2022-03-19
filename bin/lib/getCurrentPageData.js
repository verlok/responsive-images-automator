import { getResolutions } from "./readConfig.js";
import getImageWidthAt from "./getImageWidthAtViewport.js";
import takeScreenshot from "./takeScreenshot.js";
import { calcImgVW, calcIdealIntrinsicWidth } from "./calcImgColumns.js";

import {
  IMG_WIDTH,
  IMG_VW,
  IDEAL_INTRINSIC_WIDTH,
  USAGE,
  IMAGE_CSS_SELECTOR,
} from "./constants.js";

export default async function (resolutions, page, extraction, fidelityCap) {
  const currentPageData = [];
  for (const resolution of resolutions) {
    const imageCssSelector = extraction[IMAGE_CSS_SELECTOR];
    const imgWidth = await getImageWidthAt(page, resolution, imageCssSelector);
    //await takeScreenshot(page, resolution, extraction);
    currentPageData.push({
      ...resolution,
      [USAGE]: resolution[USAGE] / 100,
      [IMG_WIDTH]: imgWidth,
      [IMG_VW]: calcImgVW(imgWidth, resolution),
      [IDEAL_INTRINSIC_WIDTH]: calcIdealIntrinsicWidth(
        imgWidth,
        resolution,
        fidelityCap
      ),
    });
  }
  return currentPageData;
}
