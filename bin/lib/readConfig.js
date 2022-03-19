import csvToJson from "csvtojson";
import { PIXEL_RATIO, USAGE, VIEWPORT_WIDTH } from "./constants.js";

export async function getResolutions() {
  return await csvToJson({
    colParser: {
      [USAGE]: "number",
      [VIEWPORT_WIDTH]: "number",
      [PIXEL_RATIO]: "number",
    },
  }).fromFile("./config/resolutions.csv");
}

export async function getExtractionConfig() {
  return await csvToJson().fromFile("./config/extraction.csv");
}
