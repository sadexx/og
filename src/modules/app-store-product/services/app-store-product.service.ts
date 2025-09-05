import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { AppStoreProduct } from "../schemas";
import { PaginationQueryDto } from "../../../common/dto";
import { PaginationQueryOutput } from "../../../common/outputs";
import { findOneOrFail } from "../../../common/utils";
import { CreateAppStoreProductDto, UpdateAppStoreProductDto } from "../common/dto";
import { BadRequestException } from "../../../common/exceptions";

export class AppStoreProductService {
  private readonly appStoreProductRepository: Repository<AppStoreProduct>;

  constructor() {
    this.appStoreProductRepository = AppDataSource.getRepository(AppStoreProduct);
  }

  public async getAllAppStoreProducts(dto: PaginationQueryDto): Promise<PaginationQueryOutput<AppStoreProduct>> {
    const [appStoreProducts, total] = await this.appStoreProductRepository.findAndCount({
      select: {
        id: true,
        productId: true,
        name: true,
        discount: true,
        quantity: true
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: appStoreProducts,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getAppStoreProductById(id: string): Promise<AppStoreProduct> {
    const appStoreProduct = await findOneOrFail(this.appStoreProductRepository, {
      select: {
        id: true,
        productId: true,
        name: true,
        discount: true,
        quantity: true
      },
      where: { id }
    });

    return appStoreProduct;
  }

  public async createAppStoreProduct(dto: CreateAppStoreProductDto): Promise<void> {
    await this.validateAppStoreProductUniqueness(dto);
    await this.constructAndCreateAppStoreProduct(dto);
  }

  private async constructAndCreateAppStoreProduct(dto: CreateAppStoreProductDto): Promise<AppStoreProduct> {
    const newAppStoreProductDto = this.appStoreProductRepository.create(dto);
    const savedAppStoreProduct = await this.appStoreProductRepository.save(newAppStoreProductDto);

    return savedAppStoreProduct;
  }

  public async updateAppStoreProduct(id: string, dto: UpdateAppStoreProductDto): Promise<void> {
    const appStoreProduct = await findOneOrFail(this.appStoreProductRepository, {
      select: { id: true },
      where: { id }
    });

    if (dto.productId || dto.name) {
      await this.validateAppStoreProductUniqueness(dto);
    }

    await this.appStoreProductRepository.update(appStoreProduct.id, dto);
  }

  public async deleteAppStoreProduct(id: string): Promise<void> {
    const appStoreProduct = await findOneOrFail(this.appStoreProductRepository, {
      select: { id: true },
      where: { id }
    });
    await this.appStoreProductRepository.remove(appStoreProduct);
  }

  private async validateAppStoreProductUniqueness(
    dto: CreateAppStoreProductDto | UpdateAppStoreProductDto
  ): Promise<void> {
    const existingAppStoreProduct = await this.appStoreProductRepository.exists({
      where: [{ productId: dto.productId }, { name: dto.name }]
    });

    if (existingAppStoreProduct) {
      throw new BadRequestException("App Store Product with the same productId or name already exists.");
    }
  }
}
