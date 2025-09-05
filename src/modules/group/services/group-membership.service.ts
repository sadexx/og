import { Repository } from "typeorm";
import { Group, GroupMembership } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { EGroupMembershipRole } from "../common/enums";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../common/exceptions";
import { RemoveMembershipFromGroupDto } from "../common/dto";

export class GroupMembershipService {
  private readonly groupRepository: Repository<Group>;
  private readonly groupMembershipRepository: Repository<GroupMembership>;

  constructor() {
    this.groupRepository = AppDataSource.getRepository(Group);
    this.groupMembershipRepository = AppDataSource.getRepository(GroupMembership);
  }

  public async createGroupMembership(group: Group, userId: string, role: EGroupMembershipRole): Promise<void> {
    const alreadyMember = await this.groupMembershipRepository.exists({
      where: {
        group: { id: group.id },
        user: { id: userId }
      }
    });

    if (alreadyMember) {
      throw new BadRequestException("User is already a member of this group.");
    }

    await this.constructAndCreateGroupMembership(group, userId, role);
    await this.incrementGroupMembersCount(group.id);
  }

  private async constructAndCreateGroupMembership(
    group: Group,
    userId: string,
    role: EGroupMembershipRole
  ): Promise<void> {
    const newGroupMembership = this.groupMembershipRepository.create({
      group,
      role,
      user: { id: userId }
    });
    await this.groupMembershipRepository.save(newGroupMembership);
  }

  public async leaveGroup(groupId: string, userId: string): Promise<void> {
    const groupMembership = await this.groupMembershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId }
      }
    });

    if (!groupMembership) {
      throw new NotFoundException("Group membership not found.");
    }

    if (groupMembership.role === EGroupMembershipRole.OWNER) {
      throw new BadRequestException("You cant leave the group you own.");
    }

    await this.groupMembershipRepository.remove(groupMembership);
    await this.decrementGroupMembersCount(groupId);
  }

  public async removeUserFromGroup(groupId: string, userId: string, dto: RemoveMembershipFromGroupDto): Promise<void> {
    await this.checkGroupAccessability(groupId, userId, EGroupMembershipRole.OWNER);

    if (dto.targetUserId === userId) {
      throw new BadRequestException("You cant remove yourself from the group.");
    }

    const groupMembership = await this.groupMembershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: dto.targetUserId }
      }
    });

    if (!groupMembership) {
      throw new NotFoundException("Group membership not found.");
    }

    await this.groupMembershipRepository.remove(groupMembership);
    await this.decrementGroupMembersCount(groupId);
  }

  public async checkGroupAccessability(groupId: string, userId: string, role?: EGroupMembershipRole): Promise<void> {
    const hasAccess = await this.groupMembershipRepository.exists({
      where: {
        group: { id: groupId },
        user: { id: userId },
        role: role
      }
    });

    if (!hasAccess) {
      throw new ForbiddenException("Forbidden request");
    }
  }

  private async incrementGroupMembersCount(groupId: string): Promise<void> {
    const COLUMN_NAME: keyof Group = "membersCount";
    await this.groupRepository.increment({ id: groupId }, COLUMN_NAME, 1);
  }

  private async decrementGroupMembersCount(groupId: string): Promise<void> {
    const COLUMN_NAME: keyof Group = "membersCount";
    await this.groupRepository.decrement({ id: groupId }, COLUMN_NAME, 1);
  }
}
