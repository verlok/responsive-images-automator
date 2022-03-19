import express from "express";
import prepareCappedImgModel from "./lib/cappedImageModel.js";
import prepareUncappedImgModel from "./lib/uncappedImageModel.js";
import worksheetToJson from "./lib/worksheetToJson.js";
import getWorksheetNames from "./lib/getWorksheetNames.js";
import welcomeMessage from "./lib/welcomeMessage.js";
import getIsCapped from "./lib/getIsCapped.js";
import {
  CHOSEN_INTRINSIC_WIDTH,
  IMG_VW,
  PIXEL_RATIO,
  VIEWPORT_WIDTH,
} from "./lib/constants.js";
import ExcelJS from "exceljs";

const app = express();
const port = 8080;
app.set("view engine", "ejs");

const workbook = new ExcelJS.Workbook();
const sheetNames = await getWorksheetNames(workbook, "./data/datafile.xlsx");
const columnsToRead = [
  IMG_VW,
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  CHOSEN_INTRINSIC_WIDTH,
];

app.get("/page/:pageName", async function (req, res) {
  const pageName = req.params.pageName;
  const worksheet = workbook.getWorksheet(pageName);

  if (!worksheet) {
    res.render("notFound.ejs", { pageName });
    return;
  }

  const pageData = worksheetToJson(worksheet, columnsToRead);
  const isCapped = getIsCapped(pageName);

  const templateData = isCapped
    ? prepareCappedImgModel(pageData, 2)
    : prepareUncappedImgModel(pageData);
  templateData.pageTitle = `${pageName} page`;
  templateData.imgAlt = `${pageName} page image`;
  res.render(isCapped ? "capped.ejs" : "uncapped.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) {
    throw error;
    return;
  }
  welcomeMessage(port, sheetNames);
});