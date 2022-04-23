import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import { getImagesConfig, getResolutions } from "./lib/readConfig.js";
import navigateTo from "./lib/navigateTo.js";
import augmentPageData from "./lib/augmentPageData.js";
import extractPageData from "./lib/extractPageData.js";
import createWorksheet from "./lib/createWorksheet.js";
import { CAP_TO_2X, PAGE_NAME, PAGE_URL } from "./lib/constants.js";

async function run(puppeteer) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });
  const resolutions = await getResolutions();
  const imagesConfig = await getImagesConfig();
  
  const workbook = new ExcelJS.Workbook();
  for (const imageConfig of imagesConfig) {
    await navigateTo(page, imageConfig[PAGE_URL]);
    const capConfig = imageConfig[CAP_TO_2X];
    const fidelityCap = capConfig === true || capConfig === "true" ? 2 : 3;
    const extractedPageData = await extractPageData(
      resolutions,
      page,
      imageConfig,
      fidelityCap
    );
    const augmentedPageData = augmentPageData(extractedPageData, fidelityCap);
    createWorksheet(
      workbook,
      imageConfig[PAGE_NAME],
      augmentedPageData,
      fidelityCap
    );
  }

  const fileName = "./data/datafile.xlsx";
  await workbook.xlsx.writeFile(fileName);
  console.log(`DONE! Data extracted in ${fileName}`);

  await browser.close();
}

await run(puppeteer);
