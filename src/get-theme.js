/* eslint-disable global-require, import/no-dynamic-require */
import { join } from "path";

import buildThemeProxy from "./build-theme-proxy";
import { themeServer } from "./config";

function isTheme(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj.render === "function";
}

export default ({ name: inputName, resume, useRemoteFallback = false }) => {
  let packageJson = {};

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
  if (isTheme(theme)) {
    return theme;
  }

  let name = resume?.meta?.theme || "flat";
  if (inputName) {
    name = inputName;
  }
  let modulePath = name;
  if (/a-z0-9/.test(name[0])) {
    [, , modulePath] = `jsonresume-theme-${name.match(
      /^(jsonresume-theme-)?([0-9a-z-]+)$/
    )}`;
  }
  let themeModuleResolvedPath;
  try {
    themeModuleResolvedPath = require.resolve(modulePath, {
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
  if (!useRemoteFallback) {
    throw new Error(
      `theme ${modulePath} could not be imported locally. Use --remote-theme-fallback to attempt to render the resume by POSTing it to ${themeServer}${name}`
    );
  }
  return buildThemeProxy({ server: themeServer, name });
};
