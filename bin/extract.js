import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import {
  resolutions,
  extractionRules,
} from "./lib/readCsvConfig.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import getImageWidthAt from "./lib/getImageWidthAtViewport.js";
import takeScreenshot from "./lib/takeScreenshot.js";
import navigateTo from "./lib/navigateTo.js";
import calcColumns from "./lib/calcColumns.js";
import createWorksheet from "./lib/createWorksheet.js";

const run = async (puppeteer) => {
  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });
  
  const workbook = new ExcelJS.Workbook();
  for (const extractionRule of extractionRules) {
    const thisPageData = [];
    const fidelityCap = extractionRule.capTo2x === "true" ? 2 : 3;
    await navigateTo(page, extractionRule.pageUrl);

    for (const resolution of resolutions) {
      const imgWidth = await getImageWidthAt(page, resolution, extractionRule);
      //await takeScreenshot(page, resolution, extractionRule);
      const columns = calcColumns(imgWidth, resolution, fidelityCap);
      thisPageData.push({
        ...resolution,
        usage: resolution.usage / 100,
        imgWidth,
        ...columns,
      });
    }

    createWorksheet(workbook, extractionRule, thisPageData, fidelityCap);
    await workbook.xlsx.writeFile(
      `./data/${extractionRule.pageName}-extracted.xlsx`
    );
  }

  await browser.close();
};

await run(puppeteer);
