import { Repository } from 'typeorm';
import { Application } from '../../entities/Application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class ApplicationService {
    private readonly applicationRepo;
    constructor(applicationRepo: Repository<Application>);
    createApplication(data: CreateApplicationDto): Promise<Application>;
    getApplications(): Promise<Application[]>;
    getApplicationById(id: string): Promise<Application | undefined>;
    updateStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<Application | undefined>;
    getMyApplication(userId: string): Promise<Application | undefined>;
}
