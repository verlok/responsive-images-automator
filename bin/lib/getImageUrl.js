import Mustache from "mustache";

const defaultTemplate = `https://via.placeholder.com/{{ width }}`;

export default (width, template) => {
  const templateToUse = template || defaultTemplate;
  return Mustache.render(templateToUse, { width });
};
