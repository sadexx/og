import { FindOptionsWhere, Not, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { AppStoreProduct } from "../schemas";
import { PaginationQueryDto } from "../../../common/dto";
import { PaginationQueryOutput } from "../../../common/outputs";
import { findOneOrFail } from "../../../common/utils";
import { CreateAppStoreProductDto, UpdateAppStoreProductDto } from "../common/dto";
import { BadRequestException } from "../../../common/exceptions";
import { IAppStoreProduct } from "../common/interfaces";
import { SubscriptionPlan } from "../../subscription-plan/schemas";
import { EAppStoreProductType } from "../common/enums";
import { ESubscriptionPlanType } from "../../subscription-plan/common/enums";

export class AppStoreProductService {
  private readonly appStoreProductRepository: Repository<AppStoreProduct>;
  private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>;

  constructor() {
    this.appStoreProductRepository = AppDataSource.getRepository(AppStoreProduct);
    this.subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
  }

  public async getAllAppStoreProducts(dto: PaginationQueryDto): Promise<PaginationQueryOutput<AppStoreProduct>> {
    const [appStoreProducts, total] = await this.appStoreProductRepository.findAndCount({
      select: {
        id: true,
        productType: true,
        productId: true,
        name: true,
        discount: true,
        quantity: true,
        subscriptionPlan: { id: true, type: true }
      },
      relations: { subscriptionPlan: true },
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
        productType: true,
        productId: true,
        name: true,
        discount: true,
        quantity: true,
        subscriptionPlan: { id: true, type: true }
      },
      where: { id },
      relations: { subscriptionPlan: true }
    });

    return appStoreProduct;
  }

  public async createAppStoreProduct(dto: CreateAppStoreProductDto): Promise<void> {
    await this.validateAppStoreProduct(dto);
    await this.constructAndCreateAppStoreProduct(dto);
  }

  private async constructAndCreateAppStoreProduct(dto: CreateAppStoreProductDto): Promise<void> {
    const appStoreProductDto = this.constructAppStoreProductDto(dto);
    await this.saveAppStoreProduct(appStoreProductDto);
  }

  private async saveAppStoreProduct(dto: IAppStoreProduct): Promise<AppStoreProduct> {
    const newAppStoreProductDto = this.appStoreProductRepository.create(dto);
    const savedAppStoreProduct = await this.appStoreProductRepository.save(newAppStoreProductDto);

    return savedAppStoreProduct;
  }

  private constructAppStoreProductDto(dto: CreateAppStoreProductDto): IAppStoreProduct {
    const determinedSubscriptionPlan =
      dto.productType === EAppStoreProductType.SUBSCRIPTION_PLAN
        ? ({ id: dto.subscriptionPlanId } as SubscriptionPlan)
        : null;

    return {
      productType: dto.productType,
      productId: dto.productId,
      name: dto.name,
      discount: dto.discount,
      quantity: dto.quantity,
      subscriptionPlan: determinedSubscriptionPlan
    };
  }

  public async updateAppStoreProduct(id: string, dto: UpdateAppStoreProductDto): Promise<void> {
    const appStoreProduct = await findOneOrFail(this.appStoreProductRepository, {
      select: { id: true, productType: true },
      where: { id }
    });

    if (dto.subscriptionPlanId && appStoreProduct.productType !== EAppStoreProductType.SUBSCRIPTION_PLAN) {
      throw new BadRequestException("Subscription plan can only be updated for subscription plan products.");
    }

    if (dto.quantity !== undefined && appStoreProduct.productType === EAppStoreProductType.SUBSCRIPTION_PLAN) {
      throw new BadRequestException("Cannot change quantity for subscription plan products.");
    }

    await this.validateAppStoreProduct(dto, id);

    await this.appStoreProductRepository.update(appStoreProduct.id, {
      productId: dto.productId,
      name: dto.name,
      discount: dto.discount,
      quantity: dto.quantity,
      subscriptionPlan: { id: dto.subscriptionPlanId }
    });
  }

  public async deleteAppStoreProduct(id: string): Promise<void> {
    const appStoreProduct = await findOneOrFail(this.appStoreProductRepository, {
      select: { id: true },
      where: { id }
    });
    await this.appStoreProductRepository.remove(appStoreProduct);
  }

  private async validateAppStoreProduct(
    dto: CreateAppStoreProductDto | UpdateAppStoreProductDto,
    excludeId?: string
  ): Promise<void> {
    if (dto.subscriptionPlanId) {
      await this.validateSubscriptionPlanAssignment(dto.subscriptionPlanId);
    }

    if (dto.productId || dto.name || dto.subscriptionPlanId) {
      await this.validateAppStoreProductUniqueness(dto, excludeId);
    }
  }

  private async validateSubscriptionPlanAssignment(subscriptionPlanId: string): Promise<void> {
    const existingSubscriptionPlan = await this.subscriptionPlanRepository.exists({
      where: { id: subscriptionPlanId, type: Not(ESubscriptionPlanType.FREE) }
    });

    if (!existingSubscriptionPlan) {
      throw new BadRequestException("Subscription plan not found or cannot assign FREE plan.");
    }
  }

  private async validateAppStoreProductUniqueness(
    dto: CreateAppStoreProductDto | UpdateAppStoreProductDto,
    excludeId?: string
  ): Promise<void> {
    const whereConditions: FindOptionsWhere<AppStoreProduct>[] = [];

    if (dto.productId) {
      whereConditions.push({ productId: dto.productId });
    }

    if (dto.name) {
      whereConditions.push({ name: dto.name });
    }

    const finalConditions = excludeId
      ? whereConditions.map((condition) => ({ ...condition, id: Not(excludeId) }))
      : whereConditions;

    const existingAppStoreProduct = await this.appStoreProductRepository.exists({
      where: finalConditions
    });

    if (existingAppStoreProduct) {
      throw new BadRequestException("App Store Product with the same productId or name already exists.");
    }
  }
}
