export default async function takeScreenshot(page, resolution, extractionRule) {
  console.log(`Taking screenshot...`);
  const { viewportWidth, pixelRatio } = resolution;
  const { pageName } = extractionRule;
  await page.screenshot({
    path: `screenshot-${pageName}-${viewportWidth}@${pixelRatio}.png`,
  });
}
