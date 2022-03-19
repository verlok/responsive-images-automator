import {
  CHOSEN_INTRINSIC_WIDTH,
  EVALUATION,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  WASTE,
  USAGE,
} from "./constants.js";

const evaluations = {
  POOR: "POOR (--)",
  BELOW: "(-)",
  GOOD: "GOOD!",
  ABOVE: "(+)",
  BIG: "BIG (++)",
};

function camelToSentence(camel) {
  const result = camel.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getNumberFormat(key) {
  switch (key) {
    case USAGE:
    case WASTE:
      return "0.00%";
    case RENDERED_FIDELITY:
    case RENDERED_TO_IDEAL_FIDELITY_RATIO:
      return "0.00";
    default:
      return null;
  }
}

function getColumnKeys(thisPageData) {
  return [
    ...Object.keys(thisPageData[0]),
    RENDERED_FIDELITY,
    RENDERED_TO_IDEAL_FIDELITY_RATIO,
    EVALUATION,
    WASTE,
  ];
}

function getStyle(columnKey) {
  const style = {
    numFmt: getNumberFormat(columnKey),
  };
  if (columnKey === CHOSEN_INTRINSIC_WIDTH) {
    style["font"] = { bold: true };
    style["border"] = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
  }
  return style;
}

function getColumns(columnKeys) {
  return columnKeys.map((key) => {
    return {
      key,
      header: key, //camelToSentence(key),
      style: getStyle(key),
    };
  });
}

const autoWidth = (worksheet, minimalWidth = 1) => {
  worksheet.columns.forEach((column) => {
    let maxColumnLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      maxColumnLength = Math.max(
        maxColumnLength,
        minimalWidth,
        cell.value ? cell.value.toString().length : 0
      );
    });
    column.width = maxColumnLength + 1;
  });
};

const addConditionalFormatting = (worksheet, lastRowNumber) => {
  worksheet.addConditionalFormatting({
    ref: `G2:G${lastRowNumber}`,
    rules: [
      {
        type: "expression",
        formulae: [`J2="${evaluations.GOOD}"`],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FF99D07A" },
          },
        },
      },
      {
        type: "expression",
        formulae: [`J2="${evaluations.POOR}"`],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FFC0504D" },
          },
          font: { color: { argb: "FFFFFFFF" } },
        },
      },
      {
        type: "expression",
        formulae: [`J2="${evaluations.BIG}"`],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FFC00000" },
          },
          font: { color: { argb: "FFFFFFFF" } },
        },
      },
      {
        type: "expression",
        formulae: [`OR(J2="${evaluations.ABOVE}",J2="${evaluations.BELOW}")`],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FFD4EDD2" },
          },
        },
      },
    ],
  });
};

const thresholdsFormula = `_xlfn.IFS(I2<0.9, "${evaluations.POOR}", I2<1, "${evaluations.BELOW}", I2=1, "${evaluations.GOOD}", I2>1.2, "${evaluations.BIG}", I2>1, "${evaluations.ABOVE}")`;

function fillWithFormulas(worksheet, lastRowNumber, fidelityCap) {
  worksheet.fillFormula(`H2:H${lastRowNumber}`, "G2/D2");
  worksheet.fillFormula(`I2:I${lastRowNumber}`, `H2/MIN(${fidelityCap}, C2)`);
  worksheet.fillFormula(`J2:J${lastRowNumber}`, thresholdsFormula);
  worksheet.fillFormula(`K2:K${lastRowNumber}`, "(I2-1)*A2");
}

export default function (workbook, pageName, thisPageData, fidelityCap) {
  const worksheet = workbook.addWorksheet(pageName);
  const columnKeys = getColumnKeys(thisPageData);
  const lastRowNumber = thisPageData.length + 1;
  worksheet.columns = getColumns(columnKeys);
  worksheet.addRows(thisPageData);
  fillWithFormulas(worksheet, lastRowNumber, fidelityCap);
  autoWidth(worksheet);
  addConditionalFormatting(worksheet, lastRowNumber);
}
