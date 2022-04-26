import getImageWidthAtViewport from "./getImageWidthAtViewport.js";
import takeScreenshot from "./takeScreenshot.js";
import { calcImgVW, calcIdealIntrinsicWidth } from "./calcImgColumns.js";

import {
  IMG_WIDTH,
  IMG_VW,
  IDEAL_INTRINSIC_WIDTH,
  IMAGE_CSS_SELECTOR,
  CURRENT_INTRINSIC_WIDTH,
} from "./constants.js";

export default async function (resolutions, page, imageConfig, fidelityCap) {
  const currentPageData = [];
  const forceReload = true; 
  for (const resolution of resolutions) {
    const imageCssSelector = imageConfig[IMAGE_CSS_SELECTOR];
    const { imgWidth, imgIntrinsicWidth } = await getImageWidthAtViewport(
      page,
      resolution,
      imageCssSelector,
      forceReload // TODO: Make `forceReload` a CLI option
    );
    // await takeScreenshot(page, resolution, imageConfig[IMAGE_NAME]);
    // TODO: Make `takeScreenshot` this a CLI option
    currentPageData.push({
      ...resolution,
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
