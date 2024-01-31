import { BaseCommand } from './base-command';
import { CommandsEnum } from './commands.enum';
import {
    CommandContext,
    Context,
    InlineKeyboard
} from 'grammy';
import { TgBotService } from '../services';
import { UserRolesEnum } from '../user-roles.enum';
import { Config } from '../config';

export class CommandStart extends BaseCommand {
    command: string = CommandsEnum.START;
    description: string = 'Start the bot';

    async handler(ctx: CommandContext<Context>, bot: TgBotService): Promise<void> {
        await ctx.reply(`<b>Greeting</b>\n\n
To open the web app page - push the button below.\n
To get the list of all users - type /${CommandsEnum.GET_USERS}\n
You can change the role of any user - type /${CommandsEnum.CHANGE_ROLE} {userId}\n
You can send a message to any user - type /${CommandsEnum.ADMIN_HELLO} {userId} {message} (required the ${UserRolesEnum.ADMIN} role)\n
`, {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().webApp('Open the page', Config.webappUrl),
        });

        await bot.saveUserByCtx(ctx);
    }

    async afterHandler(): Promise<void> {
        return;
    }

    checkAccess(role: UserRolesEnum): boolean {
        return [UserRolesEnum.ADMIN, UserRolesEnum.USER].includes(role);
    }
}
