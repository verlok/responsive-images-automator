function calcIdealIntrinsicWidth(imgWidth, resolution, fidelityCap) {
  return imgWidth * Math.min(resolution.pixelRatio, fidelityCap);
}

function calcWaste(renderedToIdealFidelityRatio, resolution) {
  return (renderedToIdealFidelityRatio - 1) * resolution.usage;
}

function calcRenderedToIdealFidelityRatio(
  renderedFidelity,
  resolution,
  fidelityCap
) {
  return renderedFidelity / Math.min(resolution.pixelRatio, fidelityCap);
}

function calcImgVW(imgWidth, resolution) {
  return Math.round((imgWidth / resolution.viewportWidth) * 100);
}

function calcEvaluation(ratio) {
  if (ratio < 0.9) return "TOO SMALL (--)";
  if (ratio < 1) return "(-)";
  if (ratio === 1) return "🎯";
  if (ratio > 1.2) return "TOO BIG (++)";
  if (ratio > 1) return "(+)";
  return "ERR";
}

export default function (imgWidth, resolution, fidelityCap) {
  const idealIntrinsicWidth = calcIdealIntrinsicWidth(
    imgWidth,
    resolution,
    fidelityCap
  );
  const chosenIntrinsicWidth = idealIntrinsicWidth;
  const imgVW = calcImgVW(imgWidth, resolution);
  const renderedFidelity = chosenIntrinsicWidth / imgWidth;
  const renderedToIdealFidelityRatio = calcRenderedToIdealFidelityRatio(
    renderedFidelity,
    resolution,
    fidelityCap
  );
  const evaluation = calcEvaluation(renderedToIdealFidelityRatio);
  const waste = calcWaste(renderedToIdealFidelityRatio, resolution);

  return {
    imgVW,
    idealIntrinsicWidth,
    chosenIntrinsicWidth,
    renderedFidelity,
    renderedToIdealFidelityRatio,
    evaluation,
    waste,
  };
}
