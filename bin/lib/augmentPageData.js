import {
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  IDEAL_INTRINSIC_WIDTH,
  CHOSEN_INTRINSIC_WIDTH,
} from "./constants.js";

const searchRules = (viewportWidth, fidelityCap) => (row) =>
  row[VIEWPORT_WIDTH] === viewportWidth && row[PIXEL_RATIO] === fidelityCap;

export default function (extractedPageData, fidelityCap) {
  const chosenRow = extractedPageData.find(searchRules(414, fidelityCap));
  const chosenIntrWidth = !chosenRow ? 0 : chosenRow[IDEAL_INTRINSIC_WIDTH];
  return extractedPageData.map((row) => ({
    ...row,
    [CHOSEN_INTRINSIC_WIDTH]: chosenIntrWidth,
  }));
}


