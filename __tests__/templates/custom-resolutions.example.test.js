const testFnFactory = require("../factory/testFnFactory");

const pageName = "webdev-home";
const pageUrl = `http://localhost:8080/page/${pageName}`;

describe(`Testing ${pageName} page image`, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
    ${__vw__}     | ${__pxr__} | ${__expected__}
  `(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    testFnFactory(pageUrl)
  );
});
