import {
  PIXEL_RATIO,
  CHOSEN_INTRINSIC_WIDTH,
  IMG_VW,
  VIEWPORT_WIDTH,
} from "./constants.js";
import getImageUrl from "./getImageUrl.js";

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
    .join(', ');

const getImageSizesMediaQueries = (sortedWidths) => {
  let prevImgVW = sortedWidths[0][IMG_VW];
  const mediaQueries = [{ vw: prevImgVW }];
  for (const row of sortedWidths) {
    const currentImgVW = row[IMG_VW];
    if (currentImgVW !== prevImgVW) {
      mediaQueries.unshift({
        minWidth: row[VIEWPORT_WIDTH],
        vw: currentImgVW,
      });
      prevImgVW = currentImgVW;
    }
  }
  return mediaQueries;
};

export default (intrinsicWidthsConfig, imageTemplate) => {
  const sortedUncappedImgWidths = intrinsicWidthsConfig.sort(uncappedCompareFn);
  const onlyImgWidths = sortedUncappedImgWidths.map(
    (row) => row[CHOSEN_INTRINSIC_WIDTH]
  );
  const dedupedImgWidths = Array.from(new Set(onlyImgWidths));
  const imageSizesMediaQueries = getImageSizesMediaQueries(
    sortedUncappedImgWidths
  );
  const legacyWidth = dedupedImgWidths[dedupedImgWidths.length - 1];
  const srcset = dedupedImgWidths
    .map((imageWidth) => `${getImageUrl(imageWidth, imageTemplate)} ${imageWidth}w`)
    .join(', ');
  const templateData = {
    srcset,
    legacyImgUrl: getImageUrl(legacyWidth, imageTemplate),
    sizesAttr: getImageSizesAttr(imageSizesMediaQueries),
  };
  return templateData;
};
