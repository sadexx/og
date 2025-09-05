import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { LogsService } from "../services";

export class LogsController {
  constructor(private readonly logsService = new LogsService()) {}

  public async listLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listofFileLogs = await this.logsService.listLogs();
      res.status(EHttpResponseCode.OK).json(listofFileLogs);
    } catch (error) {
      next(error);
    }
  }

  public async downloadLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filename } = req.params;
      const { buffer, fileSize } = await this.logsService.downloadLog(filename);

      res.set({
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": fileSize
      });

      res.status(EHttpResponseCode.OK).send(buffer);
    } catch (error) {
      next(error);
    }
  }
}
