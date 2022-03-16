import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import { extractionRules } from "./lib/readCsvConfig.js";
import navigateTo from "./lib/navigateTo.js";
import addChosenIntrinsicWidths from "./lib/addChosenIntrinsicWidths.js";
import getCurrentPageData from "./lib/getCurrentPageData.js";
import createWorksheet from "./lib/createWorksheet.js";

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
