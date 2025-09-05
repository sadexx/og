import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { AppStoreProductService } from "../services";
import { PaginationQueryDto } from "../../../common/dto";
import { CreateAppStoreProductDto, UpdateAppStoreProductDto } from "../common/dto";

export class AppStoreProductController {
  constructor(private appStoreProductService = new AppStoreProductService()) {}

  public async getAllAppStoreProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(PaginationQueryDto, req.body);
      const appStoreProducts = await this.appStoreProductService.getAllAppStoreProducts(dto);
      res.status(EHttpResponseCode.OK).json(appStoreProducts);
    } catch (error) {
      next(error);
    }
  }

  public async getAppStoreProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const appStoreProduct = await this.appStoreProductService.getAppStoreProductById(id);
      res.status(EHttpResponseCode.OK).json(appStoreProduct);
    } catch (error) {
      next(error);
    }
  }

  public async createAppStoreProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateAppStoreProductDto, req.body);
      await this.appStoreProductService.createAppStoreProduct(dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateAppStoreProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateAppStoreProductDto, req.body);
      await this.appStoreProductService.updateAppStoreProduct(id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async deleteAppStoreProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.appStoreProductService.deleteAppStoreProduct(id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
