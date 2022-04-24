import {
  CHOSEN_INTRINSIC_WIDTH,
  PIXEL_RATIO,
  VIEWPORT_WIDTH,
} from "./constants.js";
import getImageUrl from "./getImageUrl.js";

const cappedCompareFn = (rowA, rowB) =>
  rowA[VIEWPORT_WIDTH] - rowB[VIEWPORT_WIDTH] ||
  rowA[PIXEL_RATIO] - rowB[PIXEL_RATIO];

const calculateCappedWidths = (pageData, pxrCapping) => {
  const output = [];
  let lastWidths = { widthAt1x: null, widthAt2x: null };
  for (const row of pageData) {
    const roundedPxr = Math.round(row[PIXEL_RATIO]);
    const cappedPxr = Math.min(roundedPxr, pxrCapping);
    const thisKey = cappedPxr === 1 ? "widthAt1x" : "widthAt2x";
    lastWidths[thisKey] = row[CHOSEN_INTRINSIC_WIDTH];
    if (lastWidths.widthAt1x === null) {
      lastWidths.widthAt1x = lastWidths.widthAt2x;
    }
    output.push({
      viewportWidth: row[VIEWPORT_WIDTH],
      ...lastWidths,
    });
  }
  return output;
};

export default (intrinsicWidthsConfig, pxrCap, imageTemplate) => {
  const sortedWidthConfig = intrinsicWidthsConfig.sort(cappedCompareFn);
  const sortedCappedImgWidths = calculateCappedWidths(
    sortedWidthConfig,
    pxrCap
  );
  const legacyWidth =
    sortedCappedImgWidths[sortedCappedImgWidths.length - 1].widthAt1x;
  const mobileWidth = sortedCappedImgWidths[0].widthAt2x;
  const templateData = {
    mobileImgUrl: getImageUrl(mobileWidth, imageTemplate),
    mediaQueries: [],
    legacyImgUrl: getImageUrl(legacyWidth, imageTemplate),
  };
  let prevImgWidths = `${sortedCappedImgWidths[0].widthAt1x}|${sortedCappedImgWidths[0].widthAt2x}`;
  for (const row of sortedCappedImgWidths) {
    const currentImgWidths = `${row.widthAt1x}|${row.widthAt2x}`;
    if (currentImgWidths !== prevImgWidths) {
      templateData.mediaQueries.push({
        minWidth: row[VIEWPORT_WIDTH],
        imgUrlAt1x: getImageUrl(row.widthAt1x, imageTemplate),
        imgUrlAt2x: getImageUrl(row.widthAt2x, imageTemplate),
      });
      prevImgWidths = currentImgWidths;
    }
  }
  templateData.mediaQueries = templateData.mediaQueries.reverse();
  return templateData;
};
