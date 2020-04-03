import btoa from "btoa";
import puppeteer from "puppeteer";

export default async function ({ resume, output, theme }) {
  const html = await theme.render(resume);
  const puppeteerLaunchArgs = [];

  if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
    puppeteerLaunchArgs.push("--no-sandbox");
  }

  const browser = await puppeteer.launch({
    args: puppeteerLaunchArgs,
  });
  const page = await browser.newPage();

  await page.emulateMedia(theme.pdfRenderOptions?.mediaType || "screen");
  await page.goto(
    `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`,
    { waitUntil: "networkidle0" }
  );
  const pdfBuffer = await page.pdf({
    format: "Letter",
    printBackground: true,
    ...theme.pdfRenderOptions,
  });

  await browser.close();
  return new Promise((resolve, reject) =>
    output.write(pdfBuffer, (error) => (error ? reject(error) : resolve()))
  );
}
