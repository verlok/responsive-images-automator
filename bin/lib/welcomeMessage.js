export default function (port, sheetNames) {
  const listOfUrls = sheetNames.map(
    (pageName) => `- http://localhost:${port}/page/${pageName}`
  );
  const consoleLines = [
    "Server is running.",
    "Visit one of the following pages to generate HTML for the related page:",
    //"",
    ...listOfUrls,
    
  ];
  console.log(consoleLines.join("\n"));
}
