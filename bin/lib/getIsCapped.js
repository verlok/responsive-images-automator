import { extractionRules } from "./readCsvConfig.js";

export default function (pageName) {
  const thisPageRule = extractionRules.find(
    (rule) => rule.pageName === pageName
  );
  if (!thisPageRule) {
    return null;
  }
  const isCapped = thisPageRule.capTo2x === "true";
  return isCapped;
}
