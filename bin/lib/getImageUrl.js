import Mustache from "mustache";

const defaultTemplate = `https://via.placeholder.com/{{ imgWidth }}`;

export default (imgWidth, template) => {
  const templateToUse = template || defaultTemplate;
  return Mustache.render(templateToUse, { imgWidth });
};
