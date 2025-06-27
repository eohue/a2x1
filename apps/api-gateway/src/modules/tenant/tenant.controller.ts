import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/decorators/roles.decorator';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super', 'admin')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async list() {
    return this.tenantService.listTenants();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.tenantService.getTenant(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.tenantService.createTenant(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.tenantService.updateTenant(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tenantService.deleteTenant(id);
  }
} 