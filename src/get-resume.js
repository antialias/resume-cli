import { createReadStream } from "fs";
import { resolve as resolvePath } from "path";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import Assembler from "stream-json/Assembler";

export default ({ path }) => {
  const assembler = Assembler.connectTo(
    chain([
      process.stdin.isTTY
        ? createReadStream(resolvePath(process.cwd(), path))
        : process.stdin,
      parser(),
    ])
  );
  return new Promise((resolve) =>
    assembler.on("done", ({ current }) => resolve(current))
  );
};
