import { UserType } from '../enums/UserType.enum';
export interface User {
    id: string;
    username: string;
    email: string;
    role: UserType;
    password: string;
    created_at: string;
}
