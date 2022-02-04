import csvToJson from "csvtojson";

export const resolutions = await csvToJson({
  colParser: { usage: "number", viewportWidth: "number", pixelRatio: "number" },
}).fromFile("./config/resolutions.csv");

export const extractionRules = await csvToJson().fromFile(
  "./config/extraction.csv"
);
