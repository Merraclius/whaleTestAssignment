import { UserRolesEnum } from '../user-roles.enum';

export interface IUserModel {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    role: UserRolesEnum;
}
