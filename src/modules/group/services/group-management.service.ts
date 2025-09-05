import { Repository } from "typeorm";
import { Group } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { CreateGroupDto, JoinGroupDto, UpdateGroupDto } from "../common/dto";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { GroupMembershipService } from "./group-membership.service";
import { EGroupMembershipRole } from "../common/enums";

export class GroupManagementService {
  private readonly groupRepository: Repository<Group>;

  constructor(private readonly groupMembershipService = new GroupMembershipService()) {
    this.groupRepository = AppDataSource.getRepository(Group);
  }

  public async createGroup(userId: string, dto: CreateGroupDto): Promise<void> {
    await this.validateGroupNameUniqueness(dto.name);

    const group = await this.constructAndCreateGroup(dto);
    await this.groupMembershipService.createGroupMembership(group, userId, EGroupMembershipRole.OWNER);
  }

  private async constructAndCreateGroup(dto: CreateGroupDto): Promise<Group> {
    const newGroupDto = this.groupRepository.create({
      name: dto.name,
      password: dto.password
    });
    const savedGroup = await this.groupRepository.save(newGroupDto);

    return savedGroup;
  }

  public async joinGroup(id: string, userId: string, dto: JoinGroupDto): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException("Group not found.");
    }

    if (dto.password !== group.password) {
      throw new BadRequestException("Incorrect password.");
    }

    await this.groupMembershipService.createGroupMembership(group, userId, EGroupMembershipRole.MEMBER);
  }

  public async joinGroupByInvitation(id: string, userId: string): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException("Group not found.");
    }

    await this.groupMembershipService.createGroupMembership(group, userId, EGroupMembershipRole.MEMBER);
  }

  public async updateGroup(id: string, userId: string, dto: UpdateGroupDto): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException("Group not found.");
    }

    await this.groupMembershipService.checkGroupAccessability(group.id, userId, EGroupMembershipRole.OWNER);

    if (dto.name && dto.name !== group.name) {
      await this.validateGroupNameUniqueness(dto.name);
    }

    await this.groupRepository.update(id, {
      name: dto.name,
      password: dto.password
    });
  }

  public async removeGroup(id: string, userId: string): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException("Group not found.");
    }

    await this.groupMembershipService.checkGroupAccessability(group.id, userId, EGroupMembershipRole.OWNER);
    await this.groupRepository.remove(group);
  }

  private async validateGroupNameUniqueness(name: string): Promise<void> {
    const existingGroup = await this.groupRepository.exists({
      where: { name }
    });

    if (existingGroup) {
      throw new BadRequestException("Group with this name already exists.");
    }
  }
}
