import {
  IMG_VW,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  IDEAL_INTRINSIC_WIDTH,
  CHOSEN_INTRINSIC_WIDTH,
  EVALUATION,
  WASTE,
} from "./constants.js";

function calcIdealIntrinsicWidth(imgWidth, resolution, fidelityCap) {
  return imgWidth * Math.min(resolution.pixelRatio, fidelityCap);
}

function calcImgVW(imgWidth, resolution) {
  return Math.round((imgWidth / resolution.viewportWidth) * 100);
}

export default function (imgWidth, resolution, fidelityCap) {
  const idealIntrinsicWidth = calcIdealIntrinsicWidth(
    imgWidth,
    resolution,
    fidelityCap
  );

  const imgVw = calcImgVW(imgWidth, resolution);

  return {
    [IMG_VW]: imgVw,
    [IDEAL_INTRINSIC_WIDTH]: idealIntrinsicWidth,
    [CHOSEN_INTRINSIC_WIDTH]: idealIntrinsicWidth,
    [RENDERED_FIDELITY]: 0,
    [RENDERED_TO_IDEAL_FIDELITY_RATIO]: 0,
    [EVALUATION]: "",
    [WASTE]: 0,
  };
}

/* function calcWaste(renderedToIdealFidelityRatio, resolution) {
  return (renderedToIdealFidelityRatio - 1) * resolution.usage;
} */

/* function calcRenderedToIdealFidelityRatio(
  renderedFidelity,
  resolution,
  fidelityCap
) {
  return renderedFidelity / Math.min(resolution.pixelRatio, fidelityCap);
} */

/* function calcEvaluation(ratio) {
  if (ratio < 0.9) return "TOO SMALL (--)";
  if (ratio < 1) return "(-)";
  if (ratio === 1) return "OK";
  if (ratio > 1.2) return "TOO BIG (++)";
  if (ratio > 1) return "(+)";
  return "ERR";
} */

//const renderedFidelity = chosenIntrinsicWidth / imgWidth;
/* const renderedToIdealFidelityRatio = calcRenderedToIdealFidelityRatio(
  renderedFidelity,
  resolution,
  fidelityCap
); */
