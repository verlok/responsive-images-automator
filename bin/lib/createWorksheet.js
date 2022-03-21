import {
  CHOSEN_INTRINSIC_WIDTH,
  CHOSEN_EVALUATION,
  CHOSEN_RENDERED_FIDELITY,
  CHOSEN_RTI_FIDELITY_RATIO,
  CHOSEN_WASTE,
  USAGE,
  VIEWPORT_WIDTH,
  PIXEL_RATIO,
  IMG_WIDTH,
  IMG_VW,
  CURRENT_INTRINSIC_WIDTH,
  IDEAL_INTRINSIC_WIDTH,
  CURRENT_EVALUATION,
  CURRENT_RENDERED_FIDELITY,
  CURRENT_RTI_FIDELITY_RATIO,
  CURRENT_WASTE,
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
  [CURRENT_RENDERED_FIDELITY]: "G",
  [CURRENT_RTI_FIDELITY_RATIO]: "H",
  [CURRENT_EVALUATION]: "I",
  [CURRENT_WASTE]: "J",
  [IDEAL_INTRINSIC_WIDTH]: "K",
  [CHOSEN_INTRINSIC_WIDTH]: "L",
  [CHOSEN_RENDERED_FIDELITY]: "M",
  [CHOSEN_RTI_FIDELITY_RATIO]: "N",
  [CHOSEN_EVALUATION]: "O",
  [CHOSEN_WASTE]: "P",
  /* "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z", */
};

const startRowNumber = 2;

function camelToSentence(camel) {
  const result = camel.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getNumberFormat(key) {
  switch (key) {
    case USAGE:
    case CURRENT_WASTE:
    case CHOSEN_WASTE:
      return "0.00%";
    case CURRENT_RENDERED_FIDELITY:
    case CURRENT_RTI_FIDELITY_RATIO:
    case CHOSEN_RENDERED_FIDELITY:
    case CHOSEN_RTI_FIDELITY_RATIO:
      return "0.00";
    default:
      return null;
  }
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

const autoWidth = (worksheet) => {
  worksheet.columns.forEach(column => {
    const lengths = column.values.map(v => v.toString().length);
    const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
    column.width = maxLength;
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

function addConditionalFormatting(worksheet, lastRowNumber) {
  addConditionalFormattingTo(
    worksheet,
    CHOSEN_INTRINSIC_WIDTH,
    CHOSEN_EVALUATION,
    lastRowNumber
  );
  addConditionalFormattingTo(
    worksheet,
    CURRENT_INTRINSIC_WIDTH,
    CURRENT_EVALUATION,
    lastRowNumber
  );
}

function addConditionalFormattingTo(
  worksheet,
  columnToFormat,
  evaluationColumn,
  lastRowNumber
) {
  const evaluationCell = excelCell(evaluationColumn, startRowNumber);
  worksheet.addConditionalFormatting({
    ref: excelVerticalRange(columnToFormat, startRowNumber, lastRowNumber),
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
}

function thresholdsFormula(columnWithRTI) {
  const rtiCell = excelCell(columnWithRTI, startRowNumber);
  return `_xlfn.IFS(\
    ${rtiCell}<0.9, "${evaluations.POOR}", \
    ${rtiCell}<1, "${evaluations.BELOW}", \
    ${rtiCell}=1, "${evaluations.GOOD}", \
    ${rtiCell}>1.2, "${evaluations.BIG}", \
    ${rtiCell}>1, "${evaluations.ABOVE}"\
  )`;
}

function fillWithFormulas(worksheet, lastRowNumber, fidelityCap) {
  const currentIntrWidthCell = excelCell(
    CURRENT_INTRINSIC_WIDTH,
    startRowNumber
  );
  const chosenIntrWidthCell = excelCell(CHOSEN_INTRINSIC_WIDTH, startRowNumber);
  const imgWidthCell = excelCell(IMG_WIDTH, startRowNumber);
  const currentRenderedFidelityCell = excelCell(
    CURRENT_RENDERED_FIDELITY,
    startRowNumber
  );
  const chosenRenderedFidelityCell = excelCell(
    CHOSEN_RENDERED_FIDELITY,
    startRowNumber
  );
  const pixelRatioCell = excelCell(PIXEL_RATIO, startRowNumber);
  const usageCell = excelCell(USAGE, startRowNumber);

  // CURRENT
  worksheet.fillFormula(
    excelVerticalRange(
      CURRENT_RENDERED_FIDELITY,
      startRowNumber,
      lastRowNumber
    ),
    `${currentIntrWidthCell}/${imgWidthCell}`
  );
  worksheet.fillFormula(
    excelVerticalRange(
      CURRENT_RTI_FIDELITY_RATIO,
      startRowNumber,
      lastRowNumber
    ),
    `${currentRenderedFidelityCell}/MIN(${fidelityCap},${pixelRatioCell})`
  );
  worksheet.fillFormula(
    excelVerticalRange(CURRENT_EVALUATION, startRowNumber, lastRowNumber),
    thresholdsFormula(CURRENT_RTI_FIDELITY_RATIO)
  );
  worksheet.fillFormula(
    excelVerticalRange(CURRENT_WASTE, startRowNumber, lastRowNumber),
    `(${excelCell(CURRENT_RTI_FIDELITY_RATIO, startRowNumber)}-1)*${usageCell}`
  );

  // CHOSEN
  worksheet.fillFormula(
    excelVerticalRange(CHOSEN_RENDERED_FIDELITY, startRowNumber, lastRowNumber),
    `${chosenIntrWidthCell}/${imgWidthCell}`
  );
  worksheet.fillFormula(
    excelVerticalRange(
      CHOSEN_RTI_FIDELITY_RATIO,
      startRowNumber,
      lastRowNumber
    ),
    `${chosenRenderedFidelityCell}/MIN(${fidelityCap},${pixelRatioCell})`
  );
  worksheet.fillFormula(
    excelVerticalRange(CHOSEN_EVALUATION, startRowNumber, lastRowNumber),
    thresholdsFormula(CHOSEN_RTI_FIDELITY_RATIO)
  );
  worksheet.fillFormula(
    excelVerticalRange(CHOSEN_WASTE, startRowNumber, lastRowNumber),
    `(${excelCell(CHOSEN_RTI_FIDELITY_RATIO, startRowNumber)}-1)*${usageCell}`
  );
}

export default function (workbook, pageName, thisPageData, fidelityCap) {
  const worksheet = workbook.addWorksheet(pageName);
  const columnKeys = [...Object.keys(columns)];
  const lastRowNumber = thisPageData.length + 1;
  worksheet.columns = getColumns(columnKeys);
  worksheet.addRows(thisPageData);
  fillWithFormulas(worksheet, lastRowNumber, fidelityCap);
  autoWidth(worksheet);
  addConditionalFormatting(worksheet, lastRowNumber);
}
