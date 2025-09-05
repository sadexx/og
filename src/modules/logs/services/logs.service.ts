import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import { DownloadLogOutput } from "../common/outputs";

export class LogsService {
  constructor() {}

  public async listLogs(): Promise<string[]> {
    const logDir = path.join(__dirname, "../../../../logs");
    const files = await readdir(logDir);
    const filteredFiles = files.filter((file) => !file.startsWith("."));

    return filteredFiles;
  }

  public async downloadLog(fileName: string): Promise<DownloadLogOutput> {
    const logDir = path.join(__dirname, "../../../../logs");
    const filePath = path.join(logDir, fileName);
    await fs.promises.access(filePath, fs.constants.F_OK);
    const fileContent = await fs.promises.readFile(filePath);
    const fileSize = fileContent.length;

    return {
      buffer: fileContent,
      fileSize
    };
  }
}
