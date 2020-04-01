/* eslint-disable global-require, import/no-dynamic-require */
import { join, resolve } from "path";

export default ({ name: inputName, resume }) => {
  let packageJson = {};
  let name = inputName;

  try {
    packageJson = require(join(process.cwd(), "package"));
  } catch {
    // 'package' module does not exist
  }

  let theme;
  try {
    theme = require(join(process.cwd(), packageJson.main || "index"));
  } catch {
    // The file does not exist.
  }
  if (theme && typeof theme.render === "function") {
    return theme;
  }

  if ((!name || name === "-") && resume?.meta) {
    name = resume.meta.theme;
  }
  if (!name) {
    throw new Error(
      "options.themeName must be defined if a local theme is not present in your project"
    );
  }
  const fullName = name.match("jsonresume-theme-.*")
    ? name
    : `jsonresume-theme-${name}`;
  return require(resolve(process.cwd(), "node_modules", fullName));
};
