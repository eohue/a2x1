import { Controller, Post, Put, Delete, Get, Param, Body, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /** 소모임(그룹) 생성 */
  @Post()
  async createGroup(
    @Body(new ValidationPipe({ whitelist: true })) body: CreateGroupDto,
    @Req() req,
  ) {
    // JWT 인증 가정: req.user.id, req.user.tenant_id
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!userId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.createGroup(body, userId, tenantId);
  }

  /** 소모임(그룹) 정보 수정 */
  @Put(':id')
  async updateGroup(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) body: UpdateGroupDto,
    @Req() req,
  ) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!userId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.updateGroup(id, body, userId, tenantId);
  }

  /** 소모임(그룹) 삭제 */
  @Delete(':id')
  async deleteGroup(
    @Param('id') id: string,
    @Req() req,
  ) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!userId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.deleteGroup(id, userId, tenantId);
  }

  /** 소모임(그룹) 리스트 조회 */
  @Get()
  async listGroups(@Req() req) {
    const tenantId = req.user?.tenant_id;
    if (!tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.listGroups(tenantId);
  }

  /** 소모임(그룹) 상세 조회 */
  @Get(':id')
  async getGroup(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenant_id;
    if (!tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.getGroup(id, tenantId);
  }

  /** 소모임 참여 */
  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!userId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.joinGroup(id, userId, tenantId);
  }

  /** 소모임 탈퇴 */
  @Post(':id/leave')
  async leaveGroup(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!userId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.leaveGroup(id, userId, tenantId);
  }

  /** 소모임 멤버 리스트 */
  @Get(':id/members')
  async listMembers(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenant_id;
    if (!tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.listMembers(id, tenantId);
  }

  /** 소모임 멤버 강퇴/관리 */
  @Delete(':id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string, @Req() req) {
    const requesterId = req.user?.id;
    const tenantId = req.user?.tenant_id;
    if (!requesterId || !tenantId) throw new Error('인증 정보가 없습니다.');
    return this.groupService.removeMember(id, userId, requesterId, tenantId);
  }
} 