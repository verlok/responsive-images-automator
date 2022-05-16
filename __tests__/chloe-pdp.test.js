
const testFnFactory = require("./factory/testFnFactory");

const imageName = "chloe-pdp";
const pageUrl = `http://localhost:8080/image/${imageName}`;
const imageTemplate = "https://chloe.yooxbox.com/product_image/17107893wk/f/w{{width}}.jpg";

describe(`Testing ${imageName} image at "${pageUrl}" `, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375} | ${3} | ${582}
${414} | ${2} | ${404}
${390} | ${3} | ${582}
${375} | ${2} | ${404}
${414} | ${3} | ${582}
${360} | ${3} | ${582}
${428} | ${3} | ${582}
${1920} | ${1} | ${582}
${412} | ${2.63} | ${582}
${1440} | ${2} | ${780}
${1366} | ${1} | ${404}
${360} | ${2} | ${404}
${768} | ${2} | ${780}
${393} | ${2.75} | ${582}
${1536} | ${1.25} | ${582}
${320} | ${2} | ${404}`(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl, imageTemplate)
  );
});
