import { Router } from "express";
import multer from "multer";
import { ERoutes } from "../../common/enums";
import { validationMiddlewareQuery, customPassportAuthenticate } from "../../common/middleware";
import { CustomStorageService } from "./services";
import { UpdateFileDto } from "./common/dto";
import { FileManagementController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class FileManagementRoutes {
  public path = `/${ERoutes.FILE_MANAGEMENT}`;
  public router = Router();
  public controller = new FileManagementController();
  public upload = multer({
    storage: new CustomStorageService()
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/exercises/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/exercises/videos`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/videos`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/equipments/videos`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/workouts/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/workout-categories/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/grip-types/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/grip-firmwares/firmware`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/strain-classes/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(UpdateFileDto),
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
    this.router.post(
      `${this.path}/users/images`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      customPassportAuthenticate,
      this.upload.single("file"),
      this.controller.upload.bind(this.controller)
    );
  }
}
