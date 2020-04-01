import { promisify } from "util";
import fs, { writeFile } from "fs";
import { join } from "path";
import http from "http";
import opn from "opn";
import nodeStatic from "node-static";
import readline from "readline";
import builder from "./builder";

function serveFile(file, req, res) {
  req
    .addListener("end", () => {
      file.serve(req, res);
    })
    .resume();
}

export default function ({ port, themeName, silent, dir, path }) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const file = new nodeStatic.Server(join(process.cwd(), dir), { cache: 1 });
  http
    .createServer(async (req, res) => {
      if (req.url !== "/" && req.url !== "/index.html") {
        serveFile(file, req, res);
        return;
      }
      try {
        res.end(await builder({ themeName, dir, path }));
      } catch (err) {
        res.statusCode = 500;
        res.end(err.message);
      }
    })
    .listen(port);

  console.log("");
  const previewUrl = `http://localhost:${port}`;
  console.log(`Preview: ${previewUrl}`);
  console.log("Press ctrl-c to stop");
  console.log("");

  if (!silent) {
    opn(previewUrl);
  }
}

// console.log javascript errors. could not find render function.
