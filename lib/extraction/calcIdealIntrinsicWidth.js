export default function calcIdealIntrinsicWidth(imgWidth, pixelRatio, capTo2x) {
  const pxrToCapTo = capTo2x === "true" ? 2 : 3;
  const idealIntrinsicWidth = imgWidth * Math.min(pixelRatio, pxrToCapTo);
  return idealIntrinsicWidth;
}
