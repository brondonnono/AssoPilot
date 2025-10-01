import { UserRole } from '../enums/UserRole.enum';
export interface User {
    id: string;
    username: string;
    role: UserRole;
    password: string;
    created_at: string;
}
