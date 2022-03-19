import { getResolutions } from "./readConfig.js";
import getImageWidthAt from "./getImageWidthAtViewport.js";
import takeScreenshot from "./takeScreenshot.js";
import { calcImgVW, calcIdealIntrinsicWidth } from "./calcImgColumns.js";

import {
  IMG_WIDTH,
  IMG_VW,
  IDEAL_INTRINSIC_WIDTH,
  USAGE,
} from "./constants.js";

export default async function (page, extractionRule, fidelityCap) {
  const currentPageData = [];
  const resolutions = await getResolutions();
  for (const resolution of resolutions) {
    const imgWidth = await getImageWidthAt(page, resolution, extractionRule);
    //await takeScreenshot(page, resolution, extractionRule);
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
