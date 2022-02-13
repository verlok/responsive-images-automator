
const cappedCompareFn = (rowA, rowB) => rowA.viewportWidth - rowB.viewportWidth || rowA.pixelRatio - rowB.pixelRatio;

const calculateCappedWidths = (intrinsicWidthsConfig, pxrCapping) => {
    const output = [];
    let lastWidths = { widthAt1x: null, widthAt2x: null };
    for (const row of intrinsicWidthsConfig) {
        const roundedPxr = Math.round(row.pixelRatio);
        const cappedPxr = Math.min(roundedPxr, pxrCapping);
        const thisKey = cappedPxr === 1 ? 'widthAt1x' : 'widthAt2x';
        lastWidths[thisKey] = row.intrinsicWidth;
        if (lastWidths.widthAt1x === null) {
            lastWidths.widthAt1x = lastWidths.widthAt2x;
        }
        output.push({
            viewportWidth: row.viewportWidth,
            ...lastWidths
        })
    }
    return output;
}

export default (intrinsicWidthsConfig, pxrCap) => {
    const sortedWidthConfig = intrinsicWidthsConfig.sort(cappedCompareFn);
    const sortedPlpImgWidths = calculateCappedWidths(sortedWidthConfig, pxrCap);
    const templateData = {
        mobileImgWidth: sortedPlpImgWidths[0].widthAt2x,
        mediaQueries: [],
        legacyImgWidth: sortedPlpImgWidths[sortedPlpImgWidths.length - 1].widthAt1x
    };
    let prevImgWidths = `${sortedPlpImgWidths[0].widthAt1x}|${sortedPlpImgWidths[0].widthAt2x}`;
    for (const row of sortedPlpImgWidths) {
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

