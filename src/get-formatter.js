import * as formatters from "./formatters";

export default (format) => {
  const formatter = formatters[format];
  if (!formatter) {
    throw new Error(`no formatter exists for type ${format}`);
  }
  if (typeof formatter !== "function") {
    throw new Error(`formatter for ${format} is not a function`);
  }
  return formatter;
};
