import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

import blacklistedDomains from "../config/blacklisted_domains.js";
import blacklistedPaths from "../config/blacklisted_paths.js";
import blockBlacklistedRequests from "./lib/blockBlacklistedRequests.js";
import { getImagesConfig, getResolutions } from "./lib/readConfig.js";
import navigateTo from "./lib/navigateTo.js";
import augmentImageData from "./lib/augmentImageData.js";
import extractImageData from "./lib/extractImageData.js";
import createWorksheet from "./lib/createWorksheet.js";
import { CAP_TO_2X, IMAGE_NAME, PAGE_URL } from "./lib/constants.js";

async function run(puppeteer) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setCookie({
    name: "YSITEDELIVERY",
    value:
      "%8c%ad%ab%e9%b6%8dDs%ec0%e6O%9b%bf%dbbg%8d%5dv%d0%0b9%ae%9dV%bb%e5%d7%1e%f8)~%3aL%c9%ac%0fzqxy%fb0%bdN%1a%7c%00%00%00%01",
    url: "https://chloe.yooxbox.com",
  });
  blockBlacklistedRequests(page, { blacklistedDomains, blacklistedPaths });
  const resolutions = await getResolutions();
  const imagesConfig = await getImagesConfig();

  const workbook = new ExcelJS.Workbook();
  for (const imageConfig of imagesConfig) {
    await navigateTo(page, imageConfig[PAGE_URL]);
    const capConfig = imageConfig[CAP_TO_2X];
    const fidelityCap = capConfig || capConfig === "true" ? 2 : 3;
    const extractedPageData = await extractImageData(
      resolutions,
      page,
      imageConfig,
      fidelityCap
    );
    const augmentedPageData = augmentImageData(extractedPageData, fidelityCap);
    createWorksheet(
      workbook,
      imageConfig[IMAGE_NAME],
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
