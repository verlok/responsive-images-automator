import { getImagesConfig } from "./readConfig.js";
import { CAP_TO_2X, PAGE_NAME } from "./constants.js";

const imagesConfig = await getImagesConfig();
export default function (pageName) {
  const thisImageRules = imagesConfig.find(
    (rule) => rule[PAGE_NAME] === pageName
  );
  if (!thisImageRules) {
    return null;
  }
  const thisImageCap2xRule = thisImageRules[CAP_TO_2X];
  const isCapped = thisImageCap2xRule || thisImageCap2xRule === "true";
  return isCapped;
}
