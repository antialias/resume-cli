/* eslint-disable global-require, import/no-dynamic-require */
import buildThemeProxy from "./build-theme-proxy";
import { themeServer } from "./config";
import requireResolve from "./utils/require-resolve";

const resolve = requireResolve(require);

export default ({ name: inputName, resume, remoteFallback }) => {
  let name = resume?.meta?.theme || "flat";
  if (inputName) {
    name = inputName;
  }
  let modulePath = name;
  if (/[a-zA-Z0-9-]/.test(name[0])) {
    [, , modulePath] = name.match(/^(jsonresume-theme-)?([0-9a-z-]+)$/);
    modulePath = `jsonresume-theme-${modulePath}`;
  }
  let themeModuleResolvedPath;
  try {
    themeModuleResolvedPath = resolve(modulePath, {
      paths: [process.cwd()],
    });
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }
  if (themeModuleResolvedPath) {
    return require(themeModuleResolvedPath);
  }
  if (!remoteFallback) {
    throw new Error(
      `theme ${modulePath} could not be imported locally. Use --remote-fallback to attempt to render the resume by POSTing it to ${themeServer}${name}`
    );
  }
  return buildThemeProxy({
    server: typeof remoteFallback === "string" ? remoteFallback : themeServer,
    name,
  });
};
