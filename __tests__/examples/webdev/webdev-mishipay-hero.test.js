
const testFnFactory = require("./factory/testFnFactory");

const imageName = "webdev-mishipay-hero";
const pageUrl = `http://localhost:8080/image/${imageName}`;
const imageTemplate = "https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/CZo4R87iOBYiRpIq6NcP.jpg?auto=format&w={{width}}";

describe(`Testing ${imageName} image at "${pageUrl}" `, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375} | ${3} | ${1242}
${414} | ${2} | ${1242}
${390} | ${3} | ${1242}
${375} | ${2} | ${1242}
${414} | ${3} | ${1242}
${360} | ${3} | ${1242}
${428} | ${3} | ${1242}
${1920} | ${1} | ${1242}
${412} | ${2.63} | ${1242}
${1440} | ${2} | ${1242}
${1366} | ${1} | ${1242}
${360} | ${2} | ${1242}
${768} | ${2} | ${1242}
${393} | ${2.75} | ${1242}
${1536} | ${1.25} | ${1242}
${320} | ${2} | ${1242}`(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl, imageTemplate)
  );
});
