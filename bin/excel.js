import ExcelJS from "exceljs";

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Oh, sheet");

/* ws.getCell("A1").value = 2;
ws.getCell("B1").value = 3;
ws.getCell("C1").value = { formula: "A1 / B1" };
 */
worksheet.columns = [
  { header: "Id", key: "id" },
  { header: "Name", key: "name" },
  { header: "Age", key: "age" },
  { header: "Average", key: "average" },
];

worksheet.addRow({ id: 1, name: "John Doe", age: 35 });
worksheet.addRow({ id: 2, name: "ORgo Ciald", age: 12 });
worksheet.addRow({ id: 3, name: "Ciadk voj", age: 34 });
worksheet.addRow({ id: 4, name: "Diavolo a 4", age: 69 });
worksheet.fillFormula("D2:D5", "C2 * A2");

workbook.xlsx
  .writeFile("./data/extracted.xlsx")
  .then(() => {
    console.log("Done.");
  })
  .catch((error) => {
    console.log(error.message);
  });
