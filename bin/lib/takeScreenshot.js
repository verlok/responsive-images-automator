import { VIEWPORT_WIDTH, PIXEL_RATIO } from "./constants.js";

export default async function takeScreenshot(page, resolution, imageName) {
  console.log(`Taking screenshot...`);
  const viewportWidth = resolution[VIEWPORT_WIDTH];
  const pixelRatio = resolution[PIXEL_RATIO];
  await page.screenshot({
    path: `screenshot-${imageName}-${viewportWidth}@${pixelRatio}.png`,
  });
}
