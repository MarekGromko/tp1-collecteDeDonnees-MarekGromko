import { UnknownMedia } from "./IMedia";

/**
 * The role of the user
 */
type UserRole = 'user' | 'admin';

interface IUser {
    id: string;
    email: string;
    password: string, 
    role: UserRole, 
    favorites: UnknownMedia[] 
}

export { 
    IUser,
    UserRole
};