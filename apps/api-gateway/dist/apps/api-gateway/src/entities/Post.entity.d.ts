import { User } from './User.entity';
import { House } from './House.entity';
export declare class Post {
    id: string;
    tenant_id: string;
    user: User;
    house: House;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
