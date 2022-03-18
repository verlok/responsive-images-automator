import { CHOSEN_INTRINSIC_WIDTH, PIXEL_RATIO, VIEWPORT_WIDTH } from "./constants.js";

const cappedCompareFn = (rowA, rowB) => rowA[VIEWPORT_WIDTH] - rowB[VIEWPORT_WIDTH] || rowA[PIXEL_RATIO] - rowB[PIXEL_RATIO];

const calculateCappedWidths = (pageData, pxrCapping) => {
    const output = [];
    let lastWidths = { widthAt1x: null, widthAt2x: null };
    for (const row of pageData) {
        const roundedPxr = Math.round(row[PIXEL_RATIO]);
        const cappedPxr = Math.min(roundedPxr, pxrCapping);
        const thisKey = cappedPxr === 1 ? 'widthAt1x' : 'widthAt2x';
        lastWidths[thisKey] = row[CHOSEN_INTRINSIC_WIDTH];
        if (lastWidths.widthAt1x === null) {
            lastWidths.widthAt1x = lastWidths.widthAt2x;
        }
        output.push({
            viewportWidth: row[VIEWPORT_WIDTH],
            ...lastWidths
        })
    }
    return output;
}

export default (intrinsicWidthsConfig, pxrCap) => {
    const sortedWidthConfig = intrinsicWidthsConfig.sort(cappedCompareFn);
    const sortedCappedImgWidths = calculateCappedWidths(sortedWidthConfig, pxrCap);
    const templateData = {
        mobileImgWidth: sortedCappedImgWidths[0].widthAt2x,
        mediaQueries: [],
        legacyImgWidth: sortedCappedImgWidths[sortedCappedImgWidths.length - 1].widthAt1x
    };
    let prevImgWidths = `${sortedCappedImgWidths[0].widthAt1x}|${sortedCappedImgWidths[0].widthAt2x}`;
    for (const row of sortedCappedImgWidths) {
        const currentImgWidths = `${row.widthAt1x}|${row.widthAt2x}`;
        if (currentImgWidths !== prevImgWidths) {
            templateData.mediaQueries.push({
                minWidth: row.viewportWidth,
                imgWidth1x: row.widthAt1x,
                imgWidth2x: row.widthAt2x
            });
            prevImgWidths = currentImgWidths;
        }
    }
    templateData.mediaQueries = templateData.mediaQueries.reverse();
    return templateData;
}

