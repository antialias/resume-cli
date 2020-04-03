import { program } from "commander";
import { extname, join } from "path";

import pkg from "../package.json";
import { themeServer } from "./config";
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
    .option("-F, --force", "bypasses schema testing.")
    .option(
      "-r, --resume <resume filename>",
      "(default: stdin if TTY else resume.json)",
      join(process.cwd(), "resume.json")
    )
    .option(
      "-m, --mime <mime type>",
      "input mime type. inferred from the file type. defaults to application/json when reading from stdin. Use `text/yaml` to force input to be parsed as yaml"
    )
    .option(
      "--remote-fallback [url]",
      `if <theme name> can not be resolved as a local module, then attempt to render the resume by POSTing the resume as JSON to {url}{theme name}. Defaults to ${themeServer} if [url] is unspecified`
    );

  program
    .command("init")
    .description("Initialize a resume.json file")
    .action(init);

  program
    .command("validate")
    .description("Schema validation test your resume.json")
    .action(async ({ parent: { resume: path } }) => {
      await validate({ resume: await getResume({ path }) });
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
        {
          format: inputFormat,
          parent: {
            force,
            remoteFallback,
            mime,
            theme: themeName,
            resume: path,
          },
        }
      ) => {
        const resume = await getResume({ path, mime });
        const theme = await getTheme({
          remoteFallback,
          name: themeName,
          resume,
        });
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
        if (!force) {
          await validate({ resume });
        }
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
        parent: { force, remoteFallback, mime, theme: themeName, resume: path },
      }) => {
        const resume = await getResume({ path, mime });
        if (!force) {
          await validate({ resume });
        }
        const theme = await getTheme({
          remoteFallback,
          name: themeName,
          resume,
        });
        await serve({
          theme,
          silent,
          port,
          dir,
          resume,
        });
      }
    );

  await program.parseAsync(process.argv);
})();
