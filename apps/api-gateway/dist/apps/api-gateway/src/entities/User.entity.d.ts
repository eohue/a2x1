export declare class User {
    id: string;
    tenant_id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'resident' | 'admin' | 'manager' | 'super';
    password: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
