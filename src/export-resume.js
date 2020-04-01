import fs from "fs";
import path from "path";

export default async function exportResume({
  resume,
  outputPath,
  formatter,
  theme,
}) {
  if (!formatter) {
    throw new Error("exportResume expects options.formatter");
  }
  let output = process.stdout;
  if (outputPath && outputPath !== "-") {
    output = fs.createWriteStream(path.resolve(process.cwd(), outputPath));
  }
  await formatter({ resume, theme, output });
}
