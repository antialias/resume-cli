import http from "http";
import opn from "opn";

export default function ({ port, theme, open, resume }) {
  http
    .createServer(async (req, res) => {
      try {
        res.end(await theme.render(resume));
      } catch (err) {
        res.statusCode = 500;
        res.end(err.message);
      }
    })
    .listen(port);

  const url = `http://localhost:${port}`;
  console.log(`serving resume at: ${url}`);
  if (open) {
    opn(url);
  }
}
