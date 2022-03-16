import express from "express";
import prepareCappedImgModel from "./lib/cappedImageModel.js";
import prepareUncappedImgModel from "../lib/uncappedImageModel.js";
import csvToJson from "csvtojson";
import { extractionRules } from "./lib/readCsvConfig.js";

const colParser = {
  viewportWidth: "number",
  pixelRatio: "number",
  intrinsicWidth: "number",
  imgWidth: "number",
  imgVW: "number",
};

const cappedData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/listing.csv"
);
const uncappedData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/detail.csv"
);

const app = express();
const port = 8080;

app.set("view engine", "ejs");

app.get("/page/:pageName", function (req, res) {
  const pageName = req.params.pageName;
  const pageData = extractionRules.find((rule) => rule.pageName === pageName);
  if (!pageData) return; // TODO use error page

  const isCapped = pageData.capTo2x === "true";
  const templateData = isCapped
    ? prepareCappedImgModel(cappedData, 2)
    : prepareUncappedImgModel(uncappedData);
  templateData.pageTitle = `${pageName} page`;
  templateData.imgAlt = `${pageName} page image`;
  res.render(isCapped ? "capped.ejs" : "uncapped.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running");
});
