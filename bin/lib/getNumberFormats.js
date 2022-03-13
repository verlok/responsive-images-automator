import {
  USAGE,
  WASTE,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
} from "./constants.js";

export default function (key) {
  switch (key) {
    case USAGE:
    case WASTE:
      return "0.00%";
    case RENDERED_FIDELITY:
    case RENDERED_TO_IDEAL_FIDELITY_RATIO:
      return "0.00";
    default:
      return null;
  }
}
