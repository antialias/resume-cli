import { resolve } from "path";

export default ({ themeName: inputThemeName, resume }) => {
  let packageJson = {};
  let themeName = inputThemeName;

  try {
    packageJson = require(join(process.cwd(), "package"));
  } catch (e) {
    // 'package' module does not exist
  }

  let theme;
  try {
    theme = require(join(process.cwd(), packageJson.main || "index"));
  } catch (e) {
    // The file does not exist.
  }
  if (theme && "function" === typeof theme.render) {
    return theme;
  }

  if ((!themeName || themeName === "-") && resume?.meta) {
    themeName = resume.meta.theme;
  }
  if (!themeName) {
    throw new Error(
      "options.themeName must be defined if a local theme is not present in your project"
    );
  }
  const fullThemeName = themeName.match("jsonresume-theme-.*")
    ? themeName
    : `jsonresume-theme-${themeName}`;
  return require(resolve(process.cwd(), "node_modules", fullThemeName));
};
