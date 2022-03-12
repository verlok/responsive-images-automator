import puppeteer from "puppeteer";
import ObjectsToCsv from "objects-to-csv";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import {
  resolutions,
  extractionRules,
} from "../lib/extraction/readCsvConfig.js";
import blockBlacklistedRequests from "../lib/extraction/blockBlacklistedRequests.js";
import getImageWidthAt from "../lib/extraction/getImageWidthAtViewport.js";
import takeScreenshot from "../lib/extraction/takeScreenshot.js";
import navigateTo from "../lib/extraction/navigateTo.js";
import calcIdealIntrinsicWidth from "../lib/extraction/calcIdealIntrinsicWidth.js";

const run = async (puppeteer) => {
  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });

  for (const extractionRule of extractionRules) {
    const thisPageData = [];
    await navigateTo(page, extractionRule.pageUrl);
    for (const resolution of resolutions) {
      const imgWidth = await getImageWidthAt(page, resolution, extractionRule);
      //await takeScreenshot(page, resolution, extractionRule);

      const idealIntrinsicWidth = calcIdealIntrinsicWidth(
        imgWidth,
        resolution.pixelRatio,
        extractionRule.capTo2x
      );
      const intrinsicWidth = idealIntrinsicWidth;
      const imgVW = Math.round((imgWidth / resolution.viewportWidth) * 100);

      thisPageData.push({
        ...resolution,
        imgVW,
        idealIntrinsicWidth,
        intrinsicWidth,
      });
    }

    const csv = new ObjectsToCsv(thisPageData);
    await csv.toDisk(`./data/${extractionRule.pageName}-extracted.csv`);
  }

  await browser.close();
};

await run(puppeteer);
