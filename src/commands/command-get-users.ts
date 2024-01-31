import { BaseCommand } from './base-command';
import { CommandsEnum } from './commands.enum';
import {
    CommandContext,
    Context
} from 'grammy';
import {
    RedisService,
    TgBotService
} from '../services';
import { IUserModel } from '../models';
import { UserRolesEnum } from '../user-roles.enum';

export class CommandGetUsers extends BaseCommand {
    command: string = CommandsEnum.GET_USERS;
    description: string = 'Get users list';

    async handler(ctx: CommandContext<Context>, bot: TgBotService): Promise<void> {
        const users = await RedisService.loadFromHash('session');

        if (!users) {
            await ctx.reply('Users not found');

            return;
        }

        const usersList = Object.values(users).map((user: IUserModel) => {
            let userString = user.firstName;
            
            if (user.lastName) {
                userString += ` ${user.lastName}`;
            }
            
            if (user.username) {
                userString += ` (@${user.username})`;
            }
            
            userString += `, <b>role</b>: ${user.role}, <b>ID</b>: ${user.id}`;
            
            return userString;
        });

        await ctx.reply(`<b>Users list</b>\n\n${usersList.join('\n')}`, {
            parse_mode: 'HTML',
        });
    }

    async afterHandler(): Promise<void> {
        return;
    }

    checkAccess(role: UserRolesEnum): boolean {
        return [UserRolesEnum.ADMIN, UserRolesEnum.USER].includes(role);
    }
}
