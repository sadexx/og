import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";

export class FileManagementController {
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(EHttpResponseCode.BAD_REQUEST).json({
          message: "No file uploaded"
        });

        return;
      }

      const file = req.file;
      res.status(EHttpResponseCode.CREATED).json(file);
    } catch (error) {
      next(error);
    }
  }
}
