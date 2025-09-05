import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { PaginationQueryDto } from "../../../common/dto";
import { ESortOrder } from "../../../common/enums";
import { NotFoundException } from "../../../common/exceptions";
import { PaginationQueryOutput } from "../../../common/outputs";
import { EGroupMembershipRole } from "../common/enums";
import { Group, GroupMembership } from "../schemas";
import { GroupMembershipService } from "./group-membership.service";
import { findOneOrFail } from "../../../common/utils";
import { FRONT_END_URL } from "../../../common/configs/config";
import { IGetGroupInvitationLinkOutput } from "../common/outputs";

export class GroupQueryService {
  private readonly groupRepository: Repository<Group>;
  private readonly groupMembershipRepository: Repository<GroupMembership>;

  constructor(private readonly groupMembershipService = new GroupMembershipService()) {
    this.groupRepository = AppDataSource.getRepository(Group);
    this.groupMembershipRepository = AppDataSource.getRepository(GroupMembership);
  }

  public async getAllGroups(userId: string, dto: PaginationQueryDto): Promise<PaginationQueryOutput<Group>> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder("group")
      .select(["group.id", "group.name", "group.membersCount", "group.createdDate"])
      .leftJoin("group.groupMemberships", "groupMembership", "groupMembership.user_id = :userId", {
        userId
      })
      .addSelect(["groupMembership.id", "groupMembership.role"])
      .leftJoin("groupMembership.user", "user")
      .addSelect(["user.id", "user.name", "user.email"])
      .orderBy({ "group.createdDate": ESortOrder.DESC })
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit);

    const [groups, total] = await queryBuilder.getManyAndCount();

    return {
      data: groups,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getOwnedGroups(userId: string, dto: PaginationQueryDto): Promise<PaginationQueryOutput<Group>> {
    return await this.getGroupsByRole(userId, EGroupMembershipRole.OWNER, dto);
  }

  public async getJoinedGroups(userId: string, dto: PaginationQueryDto): Promise<PaginationQueryOutput<Group>> {
    return await this.getGroupsByRole(userId, EGroupMembershipRole.MEMBER, dto);
  }

  private async getGroupsByRole(
    userId: string,
    groupMembershipRole: EGroupMembershipRole,
    dto: PaginationQueryDto
  ): Promise<PaginationQueryOutput<Group>> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder("group")
      .select(["group.id", "group.name", "group.membersCount", "group.createdDate"])
      .innerJoin(
        "group.groupMemberships",
        "groupMembership",
        "groupMembership.user_id = :userId AND groupMembership.role = :role",
        { userId, role: groupMembershipRole }
      )
      .addSelect(["groupMembership.id", "groupMembership.role"])
      .leftJoin("groupMembership.user", "user")
      .addSelect(["user.id", "user.name", "user.email"])
      .orderBy({ "group.createdDate": ESortOrder.DESC })
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit);

    const [groups, total] = await queryBuilder.getManyAndCount();

    return {
      data: groups,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getGroupById(id: string, userId: string): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder("group")
      .select(["group.id", "group.name", "group.membersCount", "group.createdDate"])
      .leftJoin("group.groupMemberships", "groupMembership", "groupMembership.user_id = :userId", {
        userId
      })
      .addSelect(["groupMembership.id", "groupMembership.role"])
      .leftJoin("groupMembership.user", "user")
      .addSelect(["user.id", "user.name", "user.email"])
      .where("group.id = :id", { id })
      .getOne();

    if (!group) {
      throw new NotFoundException("Group not found.");
    }

    return group;
  }

  public async getGroupMemberships(
    groupId: string,
    dto: PaginationQueryDto
  ): Promise<PaginationQueryOutput<GroupMembership>> {
    const [groupMemberships, total] = await this.groupMembershipRepository.findAndCount({
      select: {
        id: true,
        role: true,
        createdDate: true,
        user: {
          id: true,
          name: true,
          email: true
        }
      },
      where: { group: { id: groupId } },
      relations: { user: true },
      order: { createdDate: ESortOrder.DESC },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: groupMemberships,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getGroupInvitationLink(id: string, userId: string): Promise<IGetGroupInvitationLinkOutput> {
    await this.groupMembershipService.checkGroupAccessability(id, userId);

    const group = await findOneOrFail(this.groupRepository, {
      select: { id: true, password: true },
      where: { id }
    });

    const invitationLink = `${FRONT_END_URL}/groups/${group.id}`;

    return {
      invitationLink
    };
  }
}
