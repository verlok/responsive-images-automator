import worksheetToJson from "./lib/worksheetToJson.js";
import getWorksheetNames from "./lib/getWorksheetNames.js";
import testTemplate from "./makeTests/testTemplate.js";
import fs from "fs";
import {
  CHOSEN_INTRINSIC_WIDTH,
  PIXEL_RATIO,
  VIEWPORT_WIDTH,
} from "./lib/constants.js";
import ExcelJS from "exceljs";

const workbook = new ExcelJS.Workbook();
const pageNames = await getWorksheetNames(workbook, "./data/datafile.xlsx");
const columnsToRead = [VIEWPORT_WIDTH, PIXEL_RATIO, CHOSEN_INTRINSIC_WIDTH];

pageNames.forEach((pageName) => {
  console.log(`Generating tests for page "${pageName}"`);
  const worksheet = workbook.getWorksheet(pageName);
  if (!worksheet) {
    console.error(
      `Error while trying to open worksheeet for "${pageName}". Aborting.`
    );
    return;
  }
  const testData = worksheetToJson(worksheet, columnsToRead);
  console.log(testData);
  const fileContent = testTemplate(testData);
  console.log(fileContent);
  const fileName = `./__tests__/${pageName}.test.js`;
  try {
    fs.writeFileSync(fileName, fileContent);
  } catch (err) {
    console.error(err);
  }
});
