export default async function (workbook, file) {
  const sheetNames = [];
  await workbook.xlsx.readFile(file);
  workbook.eachSheet((worksheet) => {
    sheetNames.push(worksheet.name);
  });
  return sheetNames;
}
