import {
  CHOSEN_INTRINSIC_WIDTH,
  EVALUATION,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  WASTE,
  USAGE,
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  IMG_WIDTH,
  IMG_VW,
  CURRENT_INTRINSIC_WIDTH,
  IDEAL_INTRINSIC_WIDTH,
} from "./constants.js";

const evaluations = {
  POOR: "POOR (--)",
  BELOW: "(-)",
  GOOD: "GOOD!",
  ABOVE: "(+)",
  BIG: "BIG (++)",
};

const columns = {
  [USAGE]: "A",
  [VIEWPORT_WIDTH]: "B",
  [PIXEL_RATIO]: "C",
  [IMG_WIDTH]: "D",
  [IMG_VW]: "E",
  [CURRENT_INTRINSIC_WIDTH]: "F",
  [IDEAL_INTRINSIC_WIDTH]: "G",
  [CHOSEN_INTRINSIC_WIDTH]: "H",
  [RENDERED_FIDELITY]: "I",
  [RENDERED_TO_IDEAL_FIDELITY_RATIO]: "J",
  [EVALUATION]: "K",
  [WASTE]: "L",
};
/* "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]; */

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

function getConditionalFormattingRule(formula, bgColor, isWhiteText) {
  const style = {
    fill: {
      type: "pattern",
      pattern: "solid",
      bgColor: { argb: bgColor },
    },
  };
  if (isWhiteText) {
    style["font"] = { color: { argb: "FFFFFFFF" } };
  }
  return {
    type: "expression",
    formulae: [formula],
    style,
  };
}

function excelRange(startColName, startRowNumber, endColName, endRowNumber) {
  return `${excelCell(startColName, startRowNumber)}:${excelCell(
    endColName,
    endRowNumber
  )}`;
}

function excelVerticalRange(startColName, startRowNumber, endRowNumber) {
  const endColName = startColName;
  return excelRange(startColName, startRowNumber, endColName, endRowNumber);
}

function excelCell(colName, rowNumber) {
  return `${columns[colName]}${rowNumber}`;
}

const startRowNumber = 2;

const addConditionalFormatting = (worksheet, lastRowNumber) => {
  const evaluationCell = excelCell(EVALUATION, startRowNumber);
  worksheet.addConditionalFormatting({
    ref: excelRange(
      CHOSEN_INTRINSIC_WIDTH,
      startRowNumber,
      CHOSEN_INTRINSIC_WIDTH,
      lastRowNumber
    ),
    rules: [
      getConditionalFormattingRule(
        `${evaluationCell}="${evaluations.GOOD}"`,
        "FF99D07A"
      ),
      getConditionalFormattingRule(
        `${evaluationCell}="${evaluations.POOR}"`,
        "FFC0504D",
        true
      ),
      getConditionalFormattingRule(
        `${evaluationCell}="${evaluations.BIG}"`,
        "FFC00000",
        true
      ),
      getConditionalFormattingRule(
        `OR(${evaluationCell}="${evaluations.ABOVE}",${evaluationCell}="${evaluations.BELOW}")`,
        "FFD4EDD2"
      ),
    ],
  });
};

function fillWithFormulas(worksheet, lastRowNumber, fidelityCap) {
  const renderedToIdealFRCell = excelCell(
    RENDERED_TO_IDEAL_FIDELITY_RATIO,
    startRowNumber
  );
  const chosenIntrWidthCell = excelCell(CHOSEN_INTRINSIC_WIDTH, startRowNumber);
  const imgWidthCell = excelCell(IMG_WIDTH, startRowNumber);
  const renderedFidelityCell = excelCell(RENDERED_FIDELITY, startRowNumber);
  const pixelRatioCell = excelCell(PIXEL_RATIO, startRowNumber);
  const usageCell = excelCell(USAGE, startRowNumber);

  const thresholdsFormula = `_xlfn.IFS(\
    ${renderedToIdealFRCell}<0.9, "${evaluations.POOR}", \
    ${renderedToIdealFRCell}<1, "${evaluations.BELOW}", \
    ${renderedToIdealFRCell}=1, "${evaluations.GOOD}", \
    ${renderedToIdealFRCell}>1.2, "${evaluations.BIG}", \
    ${renderedToIdealFRCell}>1, "${evaluations.ABOVE}"\
  )`;

  worksheet.fillFormula(
    excelVerticalRange(RENDERED_FIDELITY, startRowNumber, lastRowNumber),
    `${chosenIntrWidthCell}/${imgWidthCell}`
  );
  worksheet.fillFormula(
    excelVerticalRange(
      RENDERED_TO_IDEAL_FIDELITY_RATIO,
      startRowNumber,
      lastRowNumber
    ),
    `${renderedFidelityCell}/MIN(${fidelityCap},${pixelRatioCell})`
  );
  worksheet.fillFormula(
    excelVerticalRange(EVALUATION, startRowNumber, lastRowNumber),
    thresholdsFormula
  );
  worksheet.fillFormula(
    excelVerticalRange(WASTE, startRowNumber, lastRowNumber),
    `(${renderedToIdealFRCell}-1)*${usageCell}`
  );
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
