import getImageWidthAtViewport from "./getImageWidthAtViewport.js";
import takeScreenshot from "./takeScreenshot.js";
import { calcImgVW, calcIdealIntrinsicWidth } from "./calcImgColumns.js";

import {
  IMG_WIDTH,
  IMG_VW,
  IDEAL_INTRINSIC_WIDTH,
  USAGE,
  IMAGE_CSS_SELECTOR,
  CURRENT_INTRINSIC_WIDTH,
} from "./constants.js";

export default async function (resolutions, page, extraction, fidelityCap) {
  const currentPageData = [];
  for (const resolution of resolutions) {
    const imageCssSelector = extraction[IMAGE_CSS_SELECTOR];
    const { imgWidth, imgIntrinsicWidth } = await getImageWidthAtViewport(
      page,
      resolution,
      imageCssSelector
    );
    //await takeScreenshot(page, resolution, extraction[PAGE_NAME]);
    currentPageData.push({
      ...resolution,
      [USAGE]: resolution[USAGE] / 100,
      [IMG_WIDTH]: imgWidth,
      [IMG_VW]: calcImgVW(imgWidth, resolution),
      [CURRENT_INTRINSIC_WIDTH]: imgIntrinsicWidth,
      [IDEAL_INTRINSIC_WIDTH]: calcIdealIntrinsicWidth(
        imgWidth,
        resolution,
        fidelityCap
      ),
    });
  }
  return currentPageData;
}
