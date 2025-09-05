import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { UpdateRollingPlanDto } from "../common/dto";
import { RollingPlan } from "../schemas";

export class RollingPlanService {
  private readonly rollingPlanRepository: Repository<RollingPlan>;

  constructor() {
    this.rollingPlanRepository = AppDataSource.getRepository(RollingPlan);
  }

  public async get(userId: string): Promise<RollingPlan> {
    const rollingPlan = await this.rollingPlanRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!rollingPlan) {
      throw new NotFoundException("Workout-rolling-plan not found");
    }

    return rollingPlan;
  }

  public async update(userId: string, dto: UpdateRollingPlanDto): Promise<RollingPlan> {
    const rollingPlan = await this.rollingPlanRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!rollingPlan) {
      throw new NotFoundException("Workout-rolling-plan not found");
    }

    const updatedRollingPlan = this.rollingPlanRepository.merge(rollingPlan, dto);

    await this.rollingPlanRepository.save(updatedRollingPlan);

    return updatedRollingPlan;
  }

  public async deleteAllCycle(userId: string): Promise<void> {
    const rollingPlan = await this.rollingPlanRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!rollingPlan) {
      throw new NotFoundException("Grip-type not found");
    }

    await this.rollingPlanRepository.update(rollingPlan.id, {
      rollingPlanCycles: null
    });
  }
}
