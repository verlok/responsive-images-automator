import ExcelJS from "exceljs";
import {
  CAP_TO_2X,
  IMAGE_CSS_SELECTOR,
  IMAGE_TEMPLATE,
  PAGE_NAME,
  PAGE_URL,
  PIXEL_RATIO,
  USAGE,
  VIEWPORT_WIDTH,
} from "./constants.js";
import getWorksheetNames from "./getWorksheetNames.js";
import worksheetToJson from "./worksheetToJson.js";
import fs from "fs";

const normalizeHyperlinks = (config, fields) => {
  return config.map((row) => {
    const normalizedRow = {};
    for (const field of fields) {
      normalizedRow[field] = row[field].hyperlink
        ? row[field].hyperlink
        : row[field];
    }
    return normalizedRow;
  });
};

async function getResolutionsFromXslx() {
  const fileName = "./config/resolutions.xlsx";
  const workbook = new ExcelJS.Workbook();
  const sheetNames = await getWorksheetNames(workbook, fileName);
  const worksheet = workbook.getWorksheet(sheetNames[0]);
  const columnsToRead = [USAGE, VIEWPORT_WIDTH, PIXEL_RATIO];

  if (!worksheet) {
    console.error(`Error reading ${fileName}`);
    return null;
  }

  const resolutions = worksheetToJson(worksheet, columnsToRead);
  console.log("resolutions", resolutions);
  return resolutions;
}

async function getImagesConfigFromXlsx() {
  const fileName = "./config/images.xlsx";
  const workbook = new ExcelJS.Workbook();
  const sheetNames = await getWorksheetNames(workbook, fileName);
  const worksheet = workbook.getWorksheet(sheetNames[0]);
  const columnsToRead = [
    PAGE_NAME,
    PAGE_URL,
    IMAGE_CSS_SELECTOR,
    CAP_TO_2X,
    IMAGE_TEMPLATE,
  ];

  if (!worksheet) {
    console.error(`Error reading ${fileName}`);
    return null;
  }

  let extractionConfig = worksheetToJson(worksheet, columnsToRead);
  extractionConfig = normalizeHyperlinks(extractionConfig, columnsToRead);
  return extractionConfig;
}

function tryReadFromJson(fileName) {
  try {
    const rawdata = fs.readFileSync(fileName);
    const parsed = JSON.parse(rawdata);
    return parsed;
  } catch (e) {
    // console.log(`${fileName} was not found`);
  }
}

export async function getResolutions() {
  let resolutions;
  resolutions = tryReadFromJson("./config/resolutions.json");
  if (!resolutions) {
    resolutions = await getResolutionsFromXslx();
  }
  return resolutions;
}

export async function getImagesConfig() {
  let imagesConfig;
  imagesConfig = tryReadFromJson("./config/images.json");
  if (!imagesConfig) {
    imagesConfig = await getImagesConfigFromXlsx();
  }
  return imagesConfig;
}
