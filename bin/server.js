import express from "express";
import preparePlpImageModel from "../lib/plpImageModel.js";
import preparePdpImageModel from "../lib/pdpImageModel.js";
import csvToJson from "csvtojson";

const colParser = {
  viewportWidth: "number",
  pixelRatio: "number",
  intrinsicWidth: "number",
  imgWidth: "number",
  imgVW: "number",
};

const plpData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/plp.csv"
);
const pdpData = await csvToJson({ delimiter: "auto", colParser }).fromFile(
  "./data/pdp.csv"
);

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  const templateData = preparePlpImageModel(plpData, 2);
  templateData.pageTitle = "Listing page";
  templateData.imgAlt = "Listing image";
  res.render("plp.ejs", templateData);
});

app.get("/details", function (req, res) {
  const templateData = preparePdpImageModel(pdpData);
  templateData.pageTitle = "Details page";
  templateData.imgAlt = "Details image";
  res.render("pdp.ejs", templateData);
});

app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running");
});
