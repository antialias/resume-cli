import { validate } from "resume-schema";
import { promisify } from "util";
import fs from "fs";
import colors from "colors";
import chalk from "chalk"; // slowly replace colors with chalk

let symbols = {
  ok: "\u2713",
  err: "\u2717",
};

// win32 console default output fonts don't support tick/cross
if (process?.platform === "win32") {
  symbols = {
    ok: "\u221A",
    err: "\u00D7",
  };
}

const tick = chalk.green(symbols.ok);
const cross = chalk.red(symbols.err);

// converts the schema's returned path output, to JS object selection notation.
function pathFormatter(path) {
  let jsonPath = path.split("/");
  jsonPath.shift();
  jsonPath = jsonPath.join(".");
  jsonPath = jsonPath.replace(".[", "[");
  return jsonPath;
}

const errorFormatter = (errors) =>
  errors
    .map((error) =>
      [
        "    ",
        cross,
        chalk.gray(
          pathFormatter(error.path),
          "is",
          error.params.type,
          ", expected",
          error.params?.expected || error.params.format
        ),
      ].join("")
    )
    .join("\n");

export default async function ({ resume }) {
  try {
    await promisify(validate)(resume);
  } catch (err) {
    throw new Error(
      `Cannot export. There are errors in your resume.json schema format.\n${errorFormatter(
        err
      )}`
    );
  }
}

// TODO error handling for single quotes

// use json error handler to pinpoint errors
