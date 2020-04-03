import fs from "fs";
import { assign } from "object-path-immutable";
import readCB from "read";
import { promisify } from "util";
import yn from "yn";

// eslint-disable-next-line import/no-useless-path-segments
import resumeJson from "../src/init-resume.json";

const read = promisify(readCB);
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

export default async () => {
  if (await exists("./resume.json")) {
    console.log("There is already a resume.json file in this directory.");
    if (!yn(await read({ prompt: "Do you want to override?:" }))) {
      process.exit();
    }
  }
  console.log(
    "This utility will generate a resume.json file in your current working directory."
  );
  console.log(
    "Fill out your name and email to get started, or leave the fields blank."
  );
  console.log("All fields are optional.\n");
  console.log("Press ^C at any time to quit.");

  const name = await read({ prompt: "name: " });
  const email = await read({ prompt: "email: " });

  await writeFile(
    `${process.cwd()}/resume.json`,
    JSON.stringify(assign(resumeJson, "basics", { name, email }), undefined, 2)
  );
};
