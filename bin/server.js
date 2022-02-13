import express from "express";
import prepareCappedImgModel from "../lib/cappedImageModel.js";
import prepareUncappedImgModel from "../lib/uncappedImageModel.js";
import csvToJson from "csvtojson";

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
app.get("/capped", function (req, res) {
  const templateData = prepareCappedImgModel(cappedData, 2);
  templateData.pageTitle = "Capped images page";
  templateData.imgAlt = "Capped image";
  res.render("capped.ejs", templateData);
});

app.get("/uncapped", function (req, res) {
  const templateData = prepareUncappedImgModel(uncappedData);
  templateData.pageTitle = "Uncapped images page";
  templateData.imgAlt = "Uncapped image";
  res.render("uncapped.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running");
});
