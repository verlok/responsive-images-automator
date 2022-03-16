import {
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  IDEAL_INTRINSIC_WIDTH,
  CHOSEN_INTRINSIC_WIDTH,
} from "./constants.js";

export default function (partialPageData, fidelityCap) {
  let chosenValue = 0;
  const chosenRow = partialPageData.find(
    (row) => row[VIEWPORT_WIDTH] === 414 && row[PIXEL_RATIO] === fidelityCap
  );
  if (chosenRow) {
    chosenValue = chosenRow[IDEAL_INTRINSIC_WIDTH];
  }
  return partialPageData.map((row) => ({
    ...row,
    [CHOSEN_INTRINSIC_WIDTH]: chosenValue,
  }));
}
