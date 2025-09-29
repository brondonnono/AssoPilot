import { UserType } from '../enums/UserType.enum';
export interface User {
    username: string;
    email: string;
    role: UserType;
    password: string;
    created_at: string;
}
