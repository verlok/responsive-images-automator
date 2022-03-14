export function calcIdealIntrinsicWidth(imgWidth, resolution, fidelityCap) {
  return imgWidth * Math.min(resolution.pixelRatio, fidelityCap);
}

export function calcImgVW(imgWidth, resolution) {
  return Math.round((imgWidth / resolution.viewportWidth) * 100);
}