#!/usr/bin/env node

//import 'dotenv-safe/config';
import pkg from "../package.json";
import validate from "./validate";
import init from "./init";
import getResume from "./get-resume";
import exportResume from "./export-resume";
import serve from "./serve";
import program from "commander";
import colors from "colors";
import chalk from "chalk";
import { join, resolve } from "path";

(async function () {
  program
    .usage("[command] [options]")
    .version(pkg.version)
    .name("resume")
    .option(
      "-t, --theme <theme name>",
      "Specify theme (modern, crisp, flat: default)",
      "flat"
    )
    .option(
      "-r, --resume <resume filename>",
      "(default: resume.json)",
      join(process.cwd(), "resume.json")
    );

  program
    .command("init")
    .description("Initialize a resume.json file")
    .action(init);

  program
    .command("validate")
    .description("Schema validation test your resume.json")
    .action(async ({ parent: { resume: path } }) => {
      const resume = await getResume(path);
      const validate = await validate({ resume });
    });

  program
    .command("export <fileName>")
    .option("-f, --format <file type extension>")
    .description(
      "Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format."
    )
    .action(async (fileNameInput, { parent: { resume: path } }) => {
      const resume = await getResume({ path });
      await validate({ resume });
      const { fileName, format, fileExtension } = await exportResume({
        resume,
        fileNameInput,
        program,
      });
      console.log(
        chalk.green(
          `Done! Find your new ${format} resume at:\n${resolve(
            process.cwd(),
            fileName + fileExtension
          )}`
        )
      );
    });

  program
    .command("serve")
    .option("-p, --port <port>", "(default: 4000)", 4000)
    .option("-s, --silent", "don't automatically open the browser", false)
    .option("-d, --dir <path>", "public directory path", "public")
    .description("Serve resume at http://localhost:4000/")
    .action(
      async ({
        dir,
        silent,
        port,
        parent: { theme: themeName, resume: path },
      }) => {
        await serve({
          themeName,
          silent,
          port,
          dir,
          path,
        });
      }
    );

  await program.parseAsync(process.argv);

  var validCommands = program.commands.map(function (cmd) {
    return cmd._name;
  });

  if (!program.args.length) {
    console.log("resume-cli:".cyan, "https://jsonresume.org", "\n");
    program.help();
  } else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log("Invalid argument:".red, process.argv[2]);
    console.log("resume-cli:".cyan, "https://jsonresume.org", "\n");
    program.help();
  }
})();
