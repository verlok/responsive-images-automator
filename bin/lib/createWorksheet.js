import camelToSentence from "./camelToSentence.js";
import { CHOSEN_INTRINSIC_WIDTH } from "./constants.js";
import getNumberFormats from "./getNumberFormats.js";

export default function (workbook, extractionRule, thisPageData, fidelityCap) {
  const worksheet = workbook.addWorksheet(extractionRule.pageName);
  const columns = Object.keys(thisPageData[0]).map((key) => ({
    header: camelToSentence(key),
    key,
    style: {
      font: { bold: key === CHOSEN_INTRINSIC_WIDTH },
      numFmt: getNumberFormats(key),
    },
  }));
  worksheet.columns = columns;
  worksheet.addRows(thisPageData);
  const lastRow = thisPageData.length + 1;
  worksheet.fillFormula(`H2:H${lastRow}`, "G2/D2");
  worksheet.fillFormula(`I2:I${lastRow}`, `H2/MIN(${fidelityCap}, C2)`);
  worksheet.fillFormula(
    `J2:J${lastRow}`,
    'IFS(I2<0.9, "POOR! (--)", I2<1, "(-)", I2=1, "OK", I2>1.2, "BIG (++)", I2>1, "(+)")'
  );
  worksheet.fillFormula(`K2:K${lastRow}`, "(I2-1)*A2");
}

