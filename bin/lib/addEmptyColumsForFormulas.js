import {
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  EVALUATION,
  WASTE,
} from "./constants.js";

export default function (data) {
  return data.map((row) => ({
    ...row,
    [RENDERED_FIDELITY]: 0,
    [RENDERED_TO_IDEAL_FIDELITY_RATIO]: 0,
    [EVALUATION]: "",
    [WASTE]: 0,
  }));
}
