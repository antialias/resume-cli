import { createReadStream, promises } from "fs";
import { lookup } from "mime-types";
import { resolve as resolvePath } from "path";
import quaff from "quaff";
import toString from "stream-to-string";
import yaml from "yaml-js";

const { stat } = promises;

const parsers = {
  "text/yaml": (string) => yaml.load(string),
  "application/json": (string) => JSON.parse(string),
};
export default async ({ path }) => {
  const pathStat = await stat(path);
  if (pathStat.isDirectory()) {
    return quaff(path);
  }
  let input;
  let mime;
  if (process.stdin.isTTY && path) {
    mime = lookup(path);
    input = createReadStream(resolvePath(process.cwd(), path));
  }
  if (!input) {
    mime = lookup(".json");
    input = process.stdin;
  }
  const resumeString = await toString(input);
  const parser = parsers[mime];
  if (!parser) {
    throw new Error(`no parser available for detected mime type ${mime}`);
  }
  return parser(resumeString);
};
