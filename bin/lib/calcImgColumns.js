export function calcIdealIntrinsicWidth(imgWidth, resolution, fidelityCap) {
  return Math.round(imgWidth * Math.min(resolution.pixelRatio, fidelityCap));
}

export function calcImgVW(imgWidth, resolution, approximation = 1) {
  let integerValue = Math.round((imgWidth / resolution.viewportWidth) * 100);
  return Math.ceil(integerValue / approximation) * approximation;
}
