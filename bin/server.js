import express from "express";
import buildCappedImgModel from "./lib/cappedImageModelBuilder.js";
import buildUncappedImgModel from "./lib/uncappedImageModelBuilder.js";
import worksheetToJson from "./lib/worksheetToJson.js";
import getWorksheetNames from "./lib/getWorksheetNames.js";
import welcomeMessage from "./lib/welcomeMessage.js";
import getImageConfig from "./lib/getImageConfig.js";
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
const imageNames = await getWorksheetNames(workbook, "./data/datafile.xlsx");
if (!imageNames) {
  console.error("No sheets found. Aborting.");
  process.exit(1);
}
const columnsToRead = [
  IMG_VW,
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  CHOSEN_INTRINSIC_WIDTH,
];

const buildImageModel = (imageConfig, pageData) => {
  const { isCapped, imageTemplate } = imageConfig;
  return isCapped
    ? buildCappedImgModel(pageData, 2, imageTemplate)
    : buildUncappedImgModel(pageData, imageTemplate);
};

app.get("/image/:imageName", async function (req, res) {
  const requestedImageName = req.params.imageName;
  const worksheet = workbook.getWorksheet(requestedImageName);
  if (!worksheet) {
    res.render("notFound.ejs", { imageName: requestedImageName });
    return;
  }
  const pageData = worksheetToJson(worksheet, columnsToRead);
  const imageConfig = getImageConfig(requestedImageName);
  if (!imageConfig) {
    res.render("notFound.ejs", { imageName: requestedImageName });
    return;
  }
  const imageModel = buildImageModel(imageConfig, pageData);
  const templateData = {
    image: imageModel,
    pageTitle: `Image: ${requestedImageName}`,
    imgAlt: `${requestedImageName}`,
  };

  res.render(
    imageConfig.isCapped ? "capped.ejs" : "uncapped.ejs",
    templateData
  );
});

app.listen(port, function (error) {
  if (error) {
    throw error;
    return;
  }
  welcomeMessage(port, imageNames);
});
