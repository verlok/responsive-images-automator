import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import { resolutions, extractionRules } from "./lib/readCsvConfig.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import getImageWidthAt from "./lib/getImageWidthAtViewport.js";
import takeScreenshot from "./lib/takeScreenshot.js";
import navigateTo from "./lib/navigateTo.js";
import { calcImgVW, calcIdealIntrinsicWidth } from "./lib/calcImgColumns.js";
import addChosenIntrinsicWidths from "./lib/addChosenIntrinsicWidths.js";

import createWorksheet from "./lib/createWorksheet.js";
import {
  IMG_WIDTH,
  IMG_VW,
  IDEAL_INTRINSIC_WIDTH,
} from "./lib/constants.js";

async function run(puppeteer) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });

  for (const extractionRule of extractionRules) {
    let currentPageData = [];
    const fidelityCap = extractionRule.capTo2x === "true" ? 2 : 3;
    await navigateTo(page, extractionRule.pageUrl);

    for (const resolution of resolutions) {
      const imgWidth = await getImageWidthAt(page, resolution, extractionRule);
      resolution.usage /= 100;
      //await takeScreenshot(page, resolution, extractionRule);
      currentPageData.push({
        ...resolution,
        [IMG_WIDTH]: imgWidth,
        [IMG_VW]: calcImgVW(imgWidth, resolution),
        [IDEAL_INTRINSIC_WIDTH]: calcIdealIntrinsicWidth(
          imgWidth,
          resolution,
          fidelityCap
        ),
      });
    }

    currentPageData = addChosenIntrinsicWidths(currentPageData, fidelityCap);

    const workbook = new ExcelJS.Workbook();
    createWorksheet(workbook, extractionRule, currentPageData, fidelityCap);
    await workbook.xlsx.writeFile(
      `./data/${extractionRule.pageName}-extracted.xlsx`
    );
  }

  await browser.close();
}

await run(puppeteer);
