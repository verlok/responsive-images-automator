import {
  PIXEL_RATIO,
  CHOSEN_INTRINSIC_WIDTH,
  IMG_VW,
  VIEWPORT_WIDTH,
} from "./constants.js";

const uncappedCompareFn = (rowA, rowB) => {
  return (
    rowA[VIEWPORT_WIDTH] - rowB[VIEWPORT_WIDTH] ||
    rowA[PIXEL_RATIO] - rowB[PIXEL_RATIO]
  );
};

const getImageSizesAttr = (imageSizes) =>
  imageSizes
    .map((imageSize) =>
      !imageSize.minWidth
        ? `${imageSize.vw}vw`
        : `(min-width: ${imageSize.minWidth}px) ${imageSize.vw}vw`
    )
    .join();

const getImageSizesMediaQueries = (sortedWidths) => {
  let prevImgVW = sortedWidths[0].imgVW;
  const mediaQueries = [{ vw: prevImgVW }];
  for (const row of sortedWidths) {
    const currentImgVW = row.imgVW;
    if (currentImgVW !== prevImgVW) {
      mediaQueries.unshift({
        minWidth: row.viewportWidth,
        vw: row.imgVW,
      });
      prevImgVW = currentImgVW;
    }
  }
  return mediaQueries;
};

export default (intrinsicWidthsConfig) => {
  const sortedUncappedImgWidths = intrinsicWidthsConfig.sort(uncappedCompareFn);
  const onlyImgWidths = sortedUncappedImgWidths.map(
    (row) => row[CHOSEN_INTRINSIC_WIDTH]
  );
  const dedupedImgWidths = Array.from(new Set(onlyImgWidths));
  const imageSizesMediaQueries = getImageSizesMediaQueries(
    sortedUncappedImgWidths
  );
  const templateData = {
    imageWidths: dedupedImgWidths,
    legacyImgWidth: dedupedImgWidths[dedupedImgWidths.length - 1],
    imageSizesAttr: getImageSizesAttr(imageSizesMediaQueries),
  };
  return templateData;
};
