import { getImagesConfig } from "./readConfig.js";
import { CAP_TO_2X, PAGE_NAME } from "./constants.js";

const imagesConfig = await getImagesConfig();
export default function (pageName) {
  const thisPageRule = imagesConfig.find(
    (rule) => rule[PAGE_NAME] === pageName
  );
  if (!thisPageRule) {
    return null;
  }
  const isCapped = thisPageRule[CAP_TO_2X] === "true";
  return isCapped;
}
