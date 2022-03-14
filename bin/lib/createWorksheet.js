import camelToSentence from "./camelToSentence.js";
import {
  CHOSEN_INTRINSIC_WIDTH,
  EVALUATION,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  WASTE,
} from "./constants.js";
import getNumberFormats from "./getNumberFormats.js";

export default function (workbook, extractionRule, thisPageData, fidelityCap) {
  const worksheet = workbook.addWorksheet(extractionRule.pageName);
  const lastRowNumber = thisPageData.length + 1;
  const columnKeys = [
    ...Object.keys(thisPageData[0]),
    RENDERED_FIDELITY,
    RENDERED_TO_IDEAL_FIDELITY_RATIO,
    EVALUATION,
    WASTE,
  ];
  worksheet.columns = columnKeys.map((key) => ({
    header: camelToSentence(key),
    key,
    style: {
      font: { bold: key === CHOSEN_INTRINSIC_WIDTH },
      numFmt: getNumberFormats(key),
    },
  }));
  worksheet.addRows(thisPageData);
  worksheet.fillFormula(`H2:H${lastRowNumber}`, "G2/D2");
  worksheet.fillFormula(`I2:I${lastRowNumber}`, `H2/MIN(${fidelityCap}, C2)`);
  worksheet.fillFormula(
    `J2:J${lastRowNumber}`,
    'IFS(I2<0.9, "POOR! (--)", I2<1, "(-)", I2=1, "OK", I2>1.2, "BIG (++)", I2>1, "(+)")'
  );
  worksheet.fillFormula(`K2:K${lastRowNumber}`, "(I2-1)*A2");
}
