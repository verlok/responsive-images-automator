export default function (port, sheetNames) {
  const listOfUrls = sheetNames.map(
    (imageName) => `- http://localhost:${port}/image/${imageName}`
  );
  const consoleLines = [
    "Server is running.",
    "Visit one of the following pages to generate HTML for the related image:",
    //"",
    ...listOfUrls,
    
  ];
  console.log(consoleLines.join("\n"));
}
