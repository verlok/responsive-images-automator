import express from "express";
import preparePlpImageModel from "../lib/cappedImageModel.js";
import preparePdpImageModel from "../lib/uncappedImageModel.js";
import csvToJson from "csvtojson";

const colParser = {
  viewportWidth: "number",
  pixelRatio: "number",
  intrinsicWidth: "number",
  imgWidth: "number",
  imgVW: "number",
};

const cappedData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/capped.csv"
);
const uncappedData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/uncapped.csv"
);

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.get("/capped", function (req, res) {
  const templateData = preparePlpImageModel(cappedData, 2);
  templateData.pageTitle = "Capped images page";
  templateData.imgAlt = "Capped image";
  res.render("capped.ejs", templateData);
});

app.get("/uncapped", function (req, res) {
  const templateData = preparePdpImageModel(uncappedData);
  templateData.pageTitle = "Uncapped images page";
  templateData.imgAlt = "Uncapped image";
  res.render("uncapped.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running");
});
