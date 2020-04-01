import { createReadStream } from "fs";
import { resolve } from "path";
import { parser } from "stream-json";
import { chain } from "stream-chain";
import Assembler from "stream-json/Assembler";

export default ({ path }) => {
  const assembler = Assembler.connectTo(
    chain([
      "-" === path
        ? process.stdin
        : createReadStream(resolve(process.cwd(), path)),
      parser(),
    ])
  );
  return new Promise((resolve) =>
    assembler.on("done", ({ current }) => resolve(current))
  );
};
