const testFnFactory = require("../factory/testFnFactory");

const pageName = "webdev-home";
const pageUrl = `http://localhost:8080/page/${pageName}`;

describe(`Testing ${pageName} page image`, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375}        | ${3}       | ${__expected__}
    ${414}        | ${2}       | ${__expected__}
    ${390}        | ${3}       | ${__expected__}
    ${375}        | ${2}       | ${__expected__}
    ${414}        | ${3}       | ${__expected__}
    ${360}        | ${3}       | ${__expected__}
    ${428}        | ${3}       | ${__expected__}
    ${1920}       | ${1}       | ${__expected__}
    ${412}        | ${2.63}    | ${__expected__}
    ${1440}       | ${2}       | ${__expected__}
    ${1366}       | ${1}       | ${__expected__}
    ${360}        | ${2}       | ${__expected__}
    ${768}        | ${2}       | ${__expected__}
    ${393}        | ${2.75}    | ${__expected__}
    ${1536}       | ${1.25}    | ${__expected__}
    ${320}        | ${2}       | ${__expected__}
  `(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl)
  );
});
