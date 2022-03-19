import { VIEWPORT_WIDTH } from "./constants.js";

export function calcIdealIntrinsicWidth(imgWidth, resolution, fidelityCap) {
  return Math.round(imgWidth * Math.min(resolution.pixelRatio, fidelityCap));
}

export function calcImgVW(imgWidth, resolution) {
  return Math.floor((imgWidth / resolution[VIEWPORT_WIDTH]) * 100);
}
