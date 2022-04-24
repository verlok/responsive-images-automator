export default async function (workbook, file) {
  const sheetNames = [];
  try {
    await workbook.xlsx.readFile(file);
  } catch (e) {
    console.error(
      `File not found: ${file}.
You probably need to run "npm run extract" before.`
    );
    return;
  }
  workbook.eachSheet((worksheet) => {
    sheetNames.push(worksheet.name);
  });
  return sheetNames;
}
