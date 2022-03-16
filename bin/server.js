import express from "express";
import prepareCappedImgModel from "./lib/cappedImageModel.js";
import prepareUncappedImgModel from "./lib/uncappedImageModel.js";
import worksheetToJson from "./lib/worksheetToJson.js";
import {
  CHOSEN_INTRINSIC_WIDTH,
  IMG_VW,
  PIXEL_RATIO,
  VIEWPORT_WIDTH,
} from "./lib/constants.js";
import ExcelJS from "exceljs";
import { extractionRules } from "./lib/readCsvConfig.js";

const app = express();
const port = 8080;

app.set("view engine", "ejs");

app.get("/page/:pageName", async function (req, res) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("./data/datafile.xlsx");

  const pageName = req.params.pageName;
  const worksheet = workbook.getWorksheet(pageName);

  if (!worksheet) {
    res.render("notFound.ejs", { pageName });
    return;
  }

  const pageData = worksheetToJson(worksheet, [
    IMG_VW,
    VIEWPORT_WIDTH,
    PIXEL_RATIO,
    CHOSEN_INTRINSIC_WIDTH,
  ]);

  const thisPageRule = extractionRules.find(rule => rule.pageName === pageName)
  const isCapped = thisPageRule.capTo2x === 'true';
  const templateData = isCapped
    ? prepareCappedImgModel(pageData, 2)
    : prepareUncappedImgModel(pageData);
  templateData.pageTitle = `${pageName} page`;
  templateData.imgAlt = `${pageName} page image`;
  res.render(isCapped ? "capped.ejs" : "uncapped.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running");
});
