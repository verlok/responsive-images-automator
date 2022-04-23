const testFnFactory = (pageUrl) => {
  return async ({ viewportWidth, pixelRatio, expectedIntrinsicWidth }) => {
    await page.setCacheEnabled(false);
    await page.setViewport({
      deviceScaleFactor: pixelRatio,
      width: viewportWidth,
      height: 667,
    });
    await page.goto(pageUrl);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(`document.querySelector("img").currentSrc`);
    //await page.screenshot({ path: `detail-${viewportWidth}@${pixelRatio}.png` });
    const body = await page.$("body");
    expect(await body.$eval("img", (img) => img.currentSrc)).toBe(
      `https://via.placeholder.com/${expectedIntrinsicWidth}`
    );
  };
};

module.exports = testFnFactory;