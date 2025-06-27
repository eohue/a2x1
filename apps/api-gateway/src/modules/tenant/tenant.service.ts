import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/Tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async createTenant(data: Partial<Tenant>) {
    const tenant = this.tenantRepo.create(data);
    return this.tenantRepo.save(tenant);
  }

  async updateTenant(id: string, data: Partial<Tenant>) {
    const tenant = await this.tenantRepo.findOne({ where: { id, is_deleted: false } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    Object.assign(tenant, data);
    return this.tenantRepo.save(tenant);
  }

  async deleteTenant(id: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id, is_deleted: false } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    tenant.is_deleted = true;
    return this.tenantRepo.save(tenant);
  }

  async getTenant(id: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id, is_deleted: false } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async listTenants() {
    return this.tenantRepo.find({ where: { is_deleted: false }, order: { created_at: 'DESC' } });
  }
} 