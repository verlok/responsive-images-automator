export default function (worksheet, onlyValues = []) {
  let header;
  const pageData = [];
  worksheet.eachRow(function (row, rowNumber) {
    if (rowNumber === 1) {
      header = row.values;
      return;
    }
    const rowData = {};
    for (const fieldIndex in row.values) {
      const fieldName = header[fieldIndex];
      // skip fields noto in onlyValues
      if (onlyValues.length && !onlyValues.includes(fieldName)) {
        continue;
      }
      rowData[fieldName] = row.values[fieldIndex];
    }
    pageData.push(rowData);
  });
  return pageData;
}
