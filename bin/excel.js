import ExcelJS from "exceljs";

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet("Oh, sheet");

ws.getCell("A1").value = 2;
ws.getCell("B1").value = 3;
ws.getCell("C1").value = { formula: "A1 / B1" };

wb.xlsx
  .writeFile("./data/extracted.xlsx")
  .then(() => {
    console.log("Done.");
  })
  .catch((error) => {
    console.log(error.message);
  });
