import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LivingGuide } from '../../entities/LivingGuide.entity';
import { User } from '../../entities/User.entity';
import { LivingGuideHistory, LivingGuideChangeType } from '../../entities/LivingGuideHistory.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LivingGuideService {
  constructor(
    @InjectRepository(LivingGuide)
    private readonly guideRepo: Repository<LivingGuide>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LivingGuideHistory)
    private readonly historyRepo: Repository<LivingGuideHistory>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  private async saveHistory(guide: LivingGuide, user: User, change_type: LivingGuideChangeType) {
    const history = this.historyRepo.create({
      guide,
      version: guide.version,
      content: guide.content,
      status: guide.status,
      change_type,
      changed_by: user,
      tenant_id: guide.tenant_id,
    });
    await this.historyRepo.save(history);
  }

  async create(title: string, content: string, userId: string, tenantId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId, tenant_id: tenantId } });
    if (!user) throw new Error('사용자 없음');
    const guide = this.guideRepo.create({ title, content, created_by: user, status: 'draft', version: 1, tenant_id: tenantId });
    const saved = await this.guideRepo.save(guide);
    await this.saveHistory(saved, user, 'edit');
    return saved;
  }

  async update(id: string, content: string, userId: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['created_by'] });
    if (!guide) throw new Error('문서 없음');
    if (guide.created_by.id !== userId) throw new Error('수정 권한 없음');
    guide.content = content;
    guide.status = 'draft';
    guide.version += 1;
    const saved = await this.guideRepo.save(guide);
    const user = await this.userRepo.findOne({ where: { id: userId, tenant_id: tenantId } });
    if (user) await this.saveHistory(saved, user, 'edit');
    return saved;
  }

  async submitForApproval(id: string, userId: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['created_by'] });
    if (!guide) throw new Error('문서 없음');
    if (guide.created_by.id !== userId) throw new Error('권한 없음');
    guide.status = 'pending';
    const saved = await this.guideRepo.save(guide);
    const user = await this.userRepo.findOne({ where: { id: userId, tenant_id: tenantId } });
    if (user) await this.saveHistory(saved, user, 'submit');
    return saved;
  }

  async approve(id: string, adminId: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['approved_by', 'created_by'] });
    if (!guide) throw new Error('문서 없음');
    const admin = await this.userRepo.findOne({ where: { id: adminId, tenant_id: tenantId } });
    if (!admin) throw new Error('관리자 없음');
    guide.status = 'approved';
    guide.approved_by = admin;
    guide.approved_at = new Date();
    const saved = await this.guideRepo.save(guide);
    await this.saveHistory(saved, admin, 'approve');
    await this.notificationService.createNotification(
      guide.created_by.id,
      'living_guide_approved',
      `생활백서 "${guide.title}"이(가) 승인되었습니다.`,
      `/resident/living-guide`
    );
    return saved;
  }

  async reject(id: string, adminId: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['approved_by', 'created_by'] });
    if (!guide) throw new Error('문서 없음');
    const admin = await this.userRepo.findOne({ where: { id: adminId, tenant_id: tenantId } });
    if (!admin) throw new Error('관리자 없음');
    guide.status = 'rejected';
    guide.approved_by = admin;
    guide.approved_at = new Date();
    const saved = await this.guideRepo.save(guide);
    await this.saveHistory(saved, admin, 'reject');
    await this.notificationService.createNotification(
      guide.created_by.id,
      'living_guide_rejected',
      `생활백서 "${guide.title}"이(가) 거절되었습니다.`,
      `/resident/living-guide`
    );
    return saved;
  }

  async findAll(tenantId: string) {
    return this.guideRepo.find({ where: { tenant_id: tenantId }, order: { updated_at: 'DESC' }, relations: ['created_by', 'approved_by'] });
  }

  async findOne(id: string, tenantId: string) {
    return this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['created_by', 'approved_by'] });
  }

  async getHistory(guideId: string, tenantId: string) {
    return this.historyRepo.find({
      where: { guide: { id: guideId }, tenant_id: tenantId },
      relations: ['changed_by'],
      order: { changed_at: 'DESC' },
    });
  }

  async rollback(id: string, version: number, adminId: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['created_by'] });
    if (!guide) throw new Error('문서 없음');
    const history = await this.historyRepo.findOne({ where: { guide: { id }, version, tenant_id: tenantId } });
    if (!history) throw new Error('해당 버전 이력 없음');
    guide.content = history.content;
    guide.status = 'draft';
    guide.version = version + 1;
    const admin = await this.userRepo.findOne({ where: { id: adminId, tenant_id: tenantId } });
    if (!admin) throw new Error('관리자 없음');
    const saved = await this.guideRepo.save(guide);
    await this.saveHistory(saved, admin, 'rollback');
    await this.notificationService.createNotification(
      guide.created_by.id,
      'living_guide_rollback',
      `생활백서 "${guide.title}"이(가) 이전 버전으로 롤백되었습니다.`,
      `/resident/living-guide`
    );
    return saved;
  }

  async remove(id: string, tenantId: string) {
    const guide = await this.guideRepo.findOne({ where: { id, tenant_id: tenantId }, relations: ['created_by'] });
    if (!guide) throw new Error('문서 없음');
    await this.guideRepo.remove(guide);
    await this.notificationService.createNotification(
      guide.created_by.id,
      'living_guide_deleted',
      `생활백서 "${guide.title}"이(가) 삭제되었습니다.`,
      `/resident/living-guide`
    );
    return { success: true };
  }
} 