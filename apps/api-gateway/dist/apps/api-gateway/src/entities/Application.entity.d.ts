import { User } from './User.entity';
import { House } from './House.entity';
export declare class Application {
    id: string;
    tenant_id: string;
    user: User;
    house: House;
    applicant_name: string;
    applicant_contact: string;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
