import { VIEWPORT_WIDTH, PIXEL_RATIO, PAGE_NAME } from "./constants.js";

export default async function takeScreenshot(page, resolution, extractionRule) {
  console.log(`Taking screenshot...`);
  const viewportWidth = resolution[VIEWPORT_WIDTH];
  const pixelRatio = resolution[PIXEL_RATIO];
  const pageName = extractionRule[PAGE_NAME];
  await page.screenshot({
    path: `screenshot-${pageName}-${viewportWidth}@${pixelRatio}.png`,
  });
}
