
const testFnFactory = require("./factory/testFnFactory");

const imageName = "chloe-plp";
const pageUrl = `http://localhost:8080/image/${imageName}`;
const imageTemplate = "https://chloe.yooxbox.com/product_image/11651807FT/f/w{{width}}.jpg";

describe(`Testing ${imageName} image at "${pageUrl}" `, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375} | ${3} | ${316}
${414} | ${2} | ${316}
${390} | ${3} | ${316}
${375} | ${2} | ${316}
${414} | ${3} | ${316}
${360} | ${3} | ${316}
${428} | ${3} | ${316}
${1920} | ${1} | ${316}
${412} | ${2.63} | ${316}
${1440} | ${2} | ${582}
${1366} | ${1} | ${316}
${360} | ${2} | ${316}
${768} | ${2} | ${404}
${393} | ${2.75} | ${316}
${1536} | ${1.25} | ${404}
${320} | ${2} | ${316}`(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl, imageTemplate)
  );
});
