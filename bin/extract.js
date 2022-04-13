import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import {
  getImagesConfigFromXlsx,
  getResolutionsFromXslx,
} from "./lib/readConfig.js";
import navigateTo from "./lib/navigateTo.js";
import augmentPageData from "./lib/augmentPageData.js";
import extractPageData from "./lib/extractPageData.js";
import createWorksheet from "./lib/createWorksheet.js";
import { CAP_TO_2X, PAGE_NAME, PAGE_URL } from "./lib/constants.js";
import fs from "fs";

function tryReadFromJson(fileName) {
  try {
    const rawdata = fs.readFileSync(fileName);
    const parsed = JSON.parse(rawdata);
    return parsed;
  } catch (e) {
    console.log(`${fileName} was not found`);
  }
}

async function getResolutions() {
  let resolutions;
  resolutions = tryReadFromJson("./config/resolutions.json");
  if (!resolutions) {
    resolutions = await getResolutionsFromXslx();
  }
  return resolutions;
}

async function getImagesConfig() {
  let imagesConfig;
  imagesConfig = tryReadFromJson("./config/images.json");
  if (!imagesConfig) {
    imagesConfig = await getImagesConfigFromXlsx();
  }
  return imagesConfig;
}

async function run(puppeteer) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });
  const workbook = new ExcelJS.Workbook();

  const resolutions = await getResolutions();
  const imagesConfig = await getImagesConfig();

  for (const imageConfig of imagesConfig) {
    await navigateTo(page, imageConfig[PAGE_URL]);
    const fidelityCap = imageConfig[CAP_TO_2X] === "true" ? 2 : 3;
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
