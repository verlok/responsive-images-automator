import Mustache from "mustache";

const defaultTemplate = `https://via.placeholder.com/{{ imgWidth }}`;

const templateToUse = /* passedTemplate || */ defaultTemplate;

export default (imgWidth) => Mustache.render(templateToUse, { imgWidth });
