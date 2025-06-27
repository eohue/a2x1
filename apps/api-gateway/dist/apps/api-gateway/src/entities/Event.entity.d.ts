import { House } from './House.entity';
import { User } from './User.entity';
export declare class Event {
    id: string;
    tenant_id: string;
    house: House;
    user: User;
    title: string;
    description: string;
    event_date: Date;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
