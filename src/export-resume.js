import request from "superagent";
import http from "http";
import fs from "fs";
import path from "path";
import read from "read";
import spinner from "char-spinner";
import chalk from "chalk";
import puppeteer from "puppeteer";
import btoa from "btoa";
import { registryServer, themeServer } from "./config";
import getTheme from "./get-theme";

const SUPPORTED_FILE_FORMATS = ["html", "pdf"];

const formatters = {
  async pdf({ resume, fileName, themeName }) {
    const themePkg = getTheme({ themeName, resume });
    const html = themePkg.render(resume);
    const puppeteerLaunchArgs = [];

    if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
      puppeteerLaunchArgs.push("--no-sandbox");
    }

    const browser = await puppeteer.launch({
      args: puppeteerLaunchArgs,
    });
    const page = await browser.newPage();

    await page.emulateMedia(
      (themePkg.pdfRenderOptions && themePkg.pdfRenderOptions.mediaType) ||
        "screen"
    );
    await page.goto(
      `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`,
      { waitUntil: "networkidle0" }
    );
    await page.pdf({
      path: `${fileName}.pdf`,
      format: "Letter",
      printBackground: true,
      ...themePkg.pdfRenderOptions,
    });

    await browser.close();
  },
  async html({ resume, fileName, themeName }) {
    const html = getTheme({ themeName, resume }).render(resume);
    const stream = fs.createWriteStream(
      path.resolve(process.cwd(), `${fileName}.html`)
    );

    return new Promise((resolve, reject) => {
      stream.write(html, function (error) {
        if (error) {
          return reject(error);
        }
        stream.close(resolve);
      });
    });
  },
};
export default async function exportResume({
  resume,
  fileNameInput,
  themeName,
  format,
}) {
  const fileNameAndFormat = getFileNameAndFormat(fileNameInput, format);
  const { fileName, format: fileFormatToUse } = fileNameAndFormat;
  const fileExtension = `.${fileFormatToUse}`;
  const formatter = formatters[fileFormatToUse];
  if (!formatter) {
    throw new Error(`JSON Resume does not support ${fileExtension} format`);
  }
  await formatter({ resume, themeName, ...fileNameAndFormat });
  return { ...fileNameAndFormat, fileExtension };
}

function extractFileFormat(fileName) {
  const dotPos = fileName.lastIndexOf(".");
  if (dotPos === -1) {
    return null;
  }
  return fileName.substring(dotPos + 1).toLowerCase();
}

function getFileNameAndFormat(fileName, format) {
  const fileFormatFound = extractFileFormat(fileName);
  let fileFormatToUse = format;
  if (format && fileFormatFound && format === fileFormatFound) {
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
  } else if (fileFormatFound) {
    fileFormatToUse = fileFormatFound;
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
  }

  return {
    fileName,
    format: fileFormatToUse,
  };
}
