const testFnFactory = require("./factory/testFnFactory");

const imageName = "webdev-home";
const pageUrl = `http://localhost:8080/image/${imageName}`;

describe(`Testing image "${imageName}"`, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375}        | ${3}       | ${1038}
    ${414}        | ${2}       | ${1038}
    ${390}        | ${3}       | ${1038}
    ${375}        | ${2}       | ${1038}
    ${414}        | ${3}       | ${1038}
    ${360}        | ${3}       | ${1038}
    ${428}        | ${3}       | ${1038}
    ${1920}       | ${1}       | ${1038}
    ${412}        | ${2.63}    | ${1038}
    ${1440}       | ${2}       | ${1038}
    ${1366}       | ${1}       | ${1038}
    ${360}        | ${2}       | ${1038}
    ${768}        | ${2}       | ${1038}
    ${393}        | ${2.75}    | ${1038}
    ${1536}       | ${1.25}    | ${1038}
    ${320}        | ${2}       | ${1038}
`(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl)
  );
});
