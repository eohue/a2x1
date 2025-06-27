import { User } from './User.entity';
import { Post } from './Post.entity';
import { Event } from './Event.entity';
export declare class Report {
    id: string;
    tenant_id: string;
    user: User;
    post?: Post;
    event?: Event;
    type: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
