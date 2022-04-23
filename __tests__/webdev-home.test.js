const testFnFactory = require("./factory/testFnFactory");

const pageName = "webdev-home";
const pageUrl = `http://localhost:8080/page/${pageName}`;

describe(`Testing ${pageName} page image`, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375}        | ${3}       | ${692}
    ${414}        | ${2}       | ${692}
    ${390}        | ${3}       | ${692}
    ${375}        | ${2}       | ${692}
    ${414}        | ${3}       | ${692}
    ${360}        | ${3}       | ${692}
    ${428}        | ${3}       | ${692}
    ${1920}       | ${1}       | ${558}
    ${412}        | ${2.63}    | ${692}
    ${1440}       | ${2}       | ${1116}
    ${1366}       | ${1}       | ${558}
    ${360}        | ${2}       | ${692}
    ${768}        | ${2}       | ${558}
    ${393}        | ${2.75}    | ${692}
    ${1536}       | ${1.25}    | ${692}
    ${320}        | ${2}       | ${558}
  `(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl)
  );
});
