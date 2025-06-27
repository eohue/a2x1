import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/Group.entity';
import { User } from '../../entities/User.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  /** 소모임(그룹) 생성 */
  async createGroup(dto: CreateGroupDto, userId: string, tenantId: string) {
    // 동일 테넌트 내 그룹명 중복 체크
    const exists = await this.groupRepo.findOne({ where: { tenant_id: tenantId, name: dto.name, is_deleted: false } });
    if (exists) throw new ConflictException('이미 존재하는 그룹명입니다.');

    const creator = await this.userRepo.findOne({ where: { id: userId, is_deleted: false } });
    if (!creator) throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');

    const group = this.groupRepo.create({
      tenant_id: tenantId,
      name: dto.name,
      description: dto.description,
      thumbnail_url: dto.thumbnail_url,
      created_by: creator,
      members: [creator],
    });
    await this.groupRepo.save(group);
    return group;
  }

  /** 소모임(그룹) 정보 수정 */
  async updateGroup(groupId: string, dto: UpdateGroupDto, userId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['created_by'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    if (group.created_by.id !== userId) throw new ConflictException('수정 권한이 없습니다.');

    // 이름 변경 시 중복 체크
    if (dto.name && dto.name !== group.name) {
      const exists = await this.groupRepo.findOne({ where: { tenant_id: tenantId, name: dto.name, is_deleted: false } });
      if (exists) throw new ConflictException('이미 존재하는 그룹명입니다.');
      group.name = dto.name;
    }
    if (dto.description !== undefined) group.description = dto.description;
    if (dto.thumbnail_url !== undefined) group.thumbnail_url = dto.thumbnail_url;
    await this.groupRepo.save(group);
    return group;
  }

  /** 소모임(그룹) 삭제 */
  async deleteGroup(groupId: string, userId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['created_by'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    if (group.created_by.id !== userId) throw new ConflictException('삭제 권한이 없습니다.');
    group.is_deleted = true;
    await this.groupRepo.save(group);
    return { message: '삭제되었습니다.' };
  }

  /** 소모임(그룹) 리스트 조회 */
  async listGroups(/* params */) {}

  /** 소모임(그룹) 상세 조회 */
  async getGroup(/* params */) {}

  /** 소모임 참여 */
  async joinGroup(groupId: string, userId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['members'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    if (group.members.some(m => m.id === userId)) throw new ConflictException('이미 가입된 그룹입니다.');
    const user = await this.userRepo.findOne({ where: { id: userId, is_deleted: false } });
    if (!user) throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    group.members.push(user);
    await this.groupRepo.save(group);
    return group;
  }

  /** 소모임 탈퇴 */
  async leaveGroup(groupId: string, userId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['members', 'created_by'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    if (group.created_by.id === userId) throw new ConflictException('생성자는 탈퇴할 수 없습니다.');
    if (!group.members.some(m => m.id === userId)) throw new ConflictException('가입된 멤버가 아닙니다.');
    group.members = group.members.filter(m => m.id !== userId);
    await this.groupRepo.save(group);
    return group;
  }

  /** 소모임 멤버 리스트 */
  async listMembers(groupId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['members'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    return group.members;
  }

  /** 소모임 멤버 강퇴/관리 */
  async removeMember(groupId: string, userId: string, requesterId: string, tenantId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId, tenant_id: tenantId, is_deleted: false }, relations: ['members', 'created_by'] });
    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');
    if (group.created_by.id !== requesterId) throw new ConflictException('강퇴 권한이 없습니다.');
    if (group.created_by.id === userId) throw new ConflictException('생성자는 강퇴할 수 없습니다.');
    if (!group.members.some(m => m.id === userId)) throw new ConflictException('가입된 멤버가 아닙니다.');
    group.members = group.members.filter(m => m.id !== userId);
    await this.groupRepo.save(group);
    return group;
  }
} 