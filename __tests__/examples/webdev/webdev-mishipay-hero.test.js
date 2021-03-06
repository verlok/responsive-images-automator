const testFnFactory = require("./factory/testFnFactory");

const imageName = "webdev-mishipay-hero";
const pageUrl = `http://localhost:8080/image/${imageName}`;
const imageTemplate =
  "https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/CZo4R87iOBYiRpIq6NcP.jpg?auto=format&w={{width}}";

describe(`Testing ${imageName} image at "${pageUrl}" `, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375}        | ${3}       | ${1242}
    ${414}        | ${2}       | ${828}
    ${390}        | ${3}       | ${1242}
    ${375}        | ${2}       | ${828}
    ${414}        | ${3}       | ${1242}
    ${360}        | ${3}       | ${1242}
    ${428}        | ${3}       | ${1242}
    ${1920}       | ${1}       | ${1600}
    ${412}        | ${2.63}    | ${1242}
    ${1440}       | ${2}       | ${2880}
    ${1366}       | ${1}       | ${1600}
    ${360}        | ${2}       | ${828}
    ${768}        | ${2}       | ${1600}
    ${393}        | ${2.75}    | ${1242}
    ${1536}       | ${1.25}    | ${1920}
    ${320}        | ${2}       | ${828}
  `(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl, imageTemplate)
  );
});
