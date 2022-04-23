const getTestCasesRows = (testCases) =>
  testCases
    .map(
      ({ viewportWidth, pixelRatio, chosenIntrinsicWidth }) =>
        `\${${viewportWidth}} | \${${pixelRatio}} | \${${chosenIntrinsicWidth}}\n`
    )
    .join("");

export default (testCases) => `
const testFnFactory = require("./factory/testFnFactory");

const pageName = "webdev-home";
const pageUrl = \`http://localhost:8080/page/\${pageName}\`;

describe(\`Testing \${pageName} page image\`, () => {
  test.each\`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${getTestCasesRows(testCases)}\`(
    \`When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth\`,
    testFnFactory(pageUrl)
  );
});
`;
