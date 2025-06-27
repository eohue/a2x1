import { User } from './User.entity';
import { Post } from './Post.entity';
export declare class Comment {
    id: string;
    tenant_id: string;
    user: User;
    post: Post;
    content: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
