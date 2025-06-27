import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/Application.entity';
import { encrypt, decrypt } from '@common/crypto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { User } from '../../entities/User.entity';
import { House } from '../../entities/House.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(House)
    private readonly houseRepo: Repository<House>,
  ) {}

  async createApplication(data: CreateApplicationDto & { user_id?: string; tenant_id?: string }): Promise<Application> {
    console.time('createApplication');
    let user: User | undefined;
    let house: House | undefined;
    if (data.user_id) {
      user = await this.userRepo.findOne({ where: { id: data.user_id } });
      if (!user) throw new Error('신청자 정보가 올바르지 않습니다.');
    }
    house = await this.houseRepo.findOne({ where: { id: data.house_id } });
    if (!house) throw new Error('지점 정보가 올바르지 않습니다.');
    const entity = this.applicationRepo.create({
      ...data,
      user,
      house,
      tenant_id: data.tenant_id || (user ? user.tenant_id : undefined),
      applicant_name: encrypt(data.applicant_name),
      applicant_contact: encrypt(data.applicant_contact),
    });
    const result = await this.applicationRepo.save(entity);
    console.timeEnd('createApplication');
    return result;
  }

  async getApplications(): Promise<Application[]> {
    console.time('getApplications');
    const apps = await this.applicationRepo.find();
    const result = apps.map(app => ({
      ...app,
      applicant_name: app.applicant_name ? decrypt(app.applicant_name) : '',
      applicant_contact: app.applicant_contact ? decrypt(app.applicant_contact) : '',
    }));
    console.timeEnd('getApplications');
    return result;
  }

  async getApplicationById(id: string): Promise<Application | undefined> {
    console.time('getApplicationById');
    const app = await this.applicationRepo.findOne({ where: { id } });
    let result: Application | undefined = undefined;
    if (app) {
      result = {
        ...app,
        applicant_name: app.applicant_name ? decrypt(app.applicant_name) : '',
        applicant_contact: app.applicant_contact ? decrypt(app.applicant_contact) : '',
      } as Application;
    }
    console.timeEnd('getApplicationById');
    return result;
  }

  async updateStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<Application | undefined> {
    console.time('updateStatus');
    const app = await this.applicationRepo.findOne({ where: { id } });
    let result: Application | undefined = undefined;
    if (app) {
      app.status = status;
      if (reason) app.reason = reason;
      result = await this.applicationRepo.save(app);
    }
    console.timeEnd('updateStatus');
    return result;
  }

  async getMyApplication(userId: string): Promise<Application | undefined> {
    console.time('getMyApplication');
    const app = await this.applicationRepo.findOne({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
    let result: Application | undefined = undefined;
    if (app) {
      result = {
        ...app,
        applicant_name: app.applicant_name ? decrypt(app.applicant_name) : '',
        applicant_contact: app.applicant_contact ? decrypt(app.applicant_contact) : '',
      } as Application;
    }
    console.timeEnd('getMyApplication');
    return result;
  }
} 