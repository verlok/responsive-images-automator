import puppeteer from "puppeteer";
import ObjectsToCsv from "objects-to-csv";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import {
  resolutions,
  extractionRules,
} from "../lib/extraction/readCsvConfig.js";
import blockBlacklistedRequests from "../lib/extraction/blockBlacklistedRequests.js";

let browser = await puppeteer.launch({
  headless: false,
  //devtools: true
});

const page = await browser.newPage();
blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });

for (const {
  capTo2x,
  pageName,
  pageUrl,
  imageCssSelector,
} of extractionRules) {
  const thisPageData = [];
  console.log(`Navigating to ${pageUrl}...`);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 0 });

  for (const { usage, viewportWidth, pixelRatio } of resolutions) {
    let proposedIntrinsicWidth = 0;
    const viewportOptions = {
      deviceScaleFactor: pixelRatio,
      width: viewportWidth,
      height: 666,
    };
    console.log(
      `Setting viewport width ${viewportWidth} @ ${pixelRatio} (usage ${usage}%)`
    );
    await page.setViewport(viewportOptions);
    await page.waitForSelector(imageCssSelector);
    await page.waitForTimeout(100);
    /* console.log(`Taking screenshot...`);
    await page.screenshot({
      path: `screenshot-${pageName}-${viewportWidth}@${pixelRatio}.png`,
    }); */
    const imgWidth = await page.$eval(imageCssSelector, (image) => image.width);
    const idealIntrinsicWidth_capped2x = imgWidth * Math.min(pixelRatio, 2);
    const idealIntrinsicWidth = imgWidth * pixelRatio;

    // Setting initially proposed intrinsic width - TODO: EXTRACT IN OTHER FILE
    if (capTo2x === "true") {
      if (
        viewportWidth === 414 && // TODO: CALCULATE BY READING RESOLUTIONS
        pixelRatio === 2
      ) {
        proposedIntrinsicWidth = idealIntrinsicWidth_capped2x;
      }
    } else {
      if (
        (viewportWidth === 414 && // TODO: CALCULATE BY READING RESOLUTIONS
          pixelRatio === 2) ||
        (viewportWidth === 375 && // TODO: CALCULATE BY READING RESOLUTIONS
          pixelRatio === 3)
      ) {
        proposedIntrinsicWidth = idealIntrinsicWidth;
      }
    }

    thisPageData.push({
      usage: `${usage}%`,
      viewportWidth: viewportWidth,
      pixelRatio,
      imgWidth,
      imgVW: Math.round((imgWidth / viewportWidth) * 100),
      idealIntrinsicWidth_capped2x,
      idealIntrinsicWidth,
      intrinsicWidth: proposedIntrinsicWidth,
    });
  }

  const csv = new ObjectsToCsv(thisPageData);
  await csv.toDisk(`./data/${pageName}-extracted.csv`);
}

await browser.close();
