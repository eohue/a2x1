import { ApplicationService } from './application.service';
import { Application } from '../../entities/Application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Request } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(body: CreateApplicationDto): Promise<Application>;
    findAll(): Promise<Application[]>;
    findOne(id: string): Promise<Application | undefined>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto): Promise<Application | undefined>;
    getMyApplication(req: AuthRequest): Promise<Application | undefined>;
}
export {};
