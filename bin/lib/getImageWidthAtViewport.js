export default async function (page, resolution, extractionRule) {
  const { viewportWidth, pixelRatio } = resolution;
  const { imageCssSelector } = extractionRule;
  const viewportOptions = {
    width: viewportWidth,
    deviceScaleFactor: pixelRatio,
    height: 666,
  };
  console.log(`Setting viewport width ${viewportWidth} @ ${pixelRatio}`);
  await page.setViewport(viewportOptions);
  await page.waitForSelector(imageCssSelector);
  await page.waitForTimeout(100);
  return await page.$eval(imageCssSelector, (image) => image.width);
}
