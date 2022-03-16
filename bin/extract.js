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
import { IMG_WIDTH, IMG_VW, IDEAL_INTRINSIC_WIDTH, USAGE } from "./lib/constants.js";

async function run(puppeteer) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });
  const workbook = new ExcelJS.Workbook();

  for (const extractionRule of extractionRules) {
    await navigateTo(page, extractionRule.pageUrl);
    const fidelityCap = extractionRule.capTo2x === "true" ? 2 : 3;
    const partialCurrentPageData = await getCurrentPageData(
      page,
      extractionRule,
      fidelityCap
    );
    const currentPageData = addChosenIntrinsicWidths(
      partialCurrentPageData,
      fidelityCap
    );
    createWorksheet(workbook, extractionRule, currentPageData, fidelityCap);
  }

  await workbook.xlsx.writeFile(`./data/datafile-extracted.xlsx`);
  await browser.close();
}

await run(puppeteer);

async function getCurrentPageData(page, extractionRule, fidelityCap) {
  const currentPageData = [];
  for (const resolution of resolutions) {
    const imgWidth = await getImageWidthAt(page, resolution, extractionRule);
    //await takeScreenshot(page, resolution, extractionRule);
    currentPageData.push({
      ...resolution,
      [USAGE]: resolution.usage / 100,
      [IMG_WIDTH]: imgWidth,
      [IMG_VW]: calcImgVW(imgWidth, resolution, 5),
      [IDEAL_INTRINSIC_WIDTH]: calcIdealIntrinsicWidth(
        imgWidth,
        resolution,
        fidelityCap
      ),
    });
  }
  return currentPageData;
}
