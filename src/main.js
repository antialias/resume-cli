import { program } from "commander";
import { extname, join } from "path";

import pkg from "../package.json";
import exportResume from "./export-resume";
import getFormatter from "./get-formatter";
import getResume from "./get-resume";
import getTheme from "./get-theme";
import init from "./init";
import serve from "./serve";
import validate from "./validate";

(async () => {
  program
    .usage("[command] [options]")
    .version(pkg.version)
    .name("resume")
    .option(
      "-t, --theme <theme name>",
      "Specify theme (modern, crisp, flat: default)"
    )
    .option(
      "-r, --resume <resume filename>",
      "(default: stdin if TTY else resume.json)",
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
      await validate({ resume: await getResume(path) });
    });

  program
    .command("export [fileName]")
    .option(
      "-f, --format <file type extension>",
      "accepts pdf or html. defaults to whatever is detected from fileName's extension else html",
      "html"
    )
    .description("Export to fileName, or stdout if unspecified or -")
    .action(
      async (
        fileNameInput,
        { format: inputFormat, parent: { theme: themeName, resume: path } }
      ) => {
        const resume = await getResume({ path });
        const theme = await getTheme({ name: themeName, resume });
        let format;
        if (fileNameInput) {
          format = extname(fileNameInput);
        }
        format = format || inputFormat;
        if (!format) {
          throw new Error(
            "could not infer the requested type to render the resume as"
          );
        }
        [, format] = format.match(/^\.?(.*)$/);
        const formatter = getFormatter(format);
        console.error(`rendering resume as ${format}`);
        await validate({ resume });
        await exportResume({
          outputPath: fileNameInput,
          resume,
          theme,
          formatter,
        });
        console.error(
          [
            `rendered resume as ${format}`,
            fileNameInput ? `to ${fileNameInput}` : null,
          ]
            .filter((x) => x)
            .join(" ")
        );
      }
    );

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

  const validCommands = program.commands.map((cmd) => cmd._name);

  if (!program.args.length) {
    console.log("resume-cli:".cyan, "https://jsonresume.org", "\n");
    program.help();
  } else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log("Invalid argument:".red, process.argv[2]);
    console.log("resume-cli:".cyan, "https://jsonresume.org", "\n");
    program.help();
  }
})();
