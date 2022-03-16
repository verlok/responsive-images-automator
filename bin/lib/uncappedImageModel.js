import { VIEWPORT_WIDTH, PIXEL_RATIO, CHOSEN_INTRINSIC_WIDTH } from "./constants.js";

const uncappedCompareFn = (rowA, rowB) =>
  rowA[VIEWPORT_WIDTH] - rowB[VIEWPORT_WIDTH] ||
  rowA[PIXEL_RATIO] - rowB[PIXEL_RATIO];

const getImageSizesAttr = (imageSizes) =>
  imageSizes
    .map((imageSize) =>
      !imageSize.maxWidth
        ? `${imageSize.vw}vw`
        : `(max-width: ${imageSize.maxWidth}px) ${imageSize.vw}vw`
    )
    .join();

const getImageSizesMediaQueries = (sortedWidths) => {
  const mediaQueries = [];
  let prevImgVW = sortedWidths[0].imgVW;
  for (const row of sortedWidths) {
    const currentImgVW = row.imgVW;
    if (currentImgVW !== prevImgVW) {
      mediaQueries.push({
        maxWidth: row.viewportWidth,
        vw: row.imgVW,
      });
      prevImgVW = currentImgVW;
    }
  }
  mediaQueries.push({ vw: prevImgVW });
  return mediaQueries;
};

export default (intrinsicWidthsConfig) => {
  const sortedPdpImgWidths = intrinsicWidthsConfig.sort(uncappedCompareFn);
  const onlyImgWidths = sortedPdpImgWidths.map(
    (row) => row[CHOSEN_INTRINSIC_WIDTH]
  );
  const dedupedImgWidths = Array.from(new Set(onlyImgWidths));
  const imageSizesMediaQueries = getImageSizesMediaQueries(sortedPdpImgWidths);
  const templateData = {
    imageWidths: dedupedImgWidths,
    legacyImgWidth: dedupedImgWidths[dedupedImgWidths.length - 1],
    imageSizesAttr: getImageSizesAttr(imageSizesMediaQueries),
  };
  return templateData;
};
