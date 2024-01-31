import { BaseCommand } from './base-command';
import { TgBotService } from '../services';
import { CommandsEnum } from './commands.enum';
import {
    CommandContext,
    Context
} from 'grammy';
import { UserRolesEnum } from '../user-roles.enum';

export class CommandAdminHello extends BaseCommand {
    command: string = CommandsEnum.ADMIN_HELLO;
    description: string = "Say hello as an admin";

    async afterHandler(bot: TgBotService): Promise<void> {
        return;
    }

    async handler(ctx: CommandContext<Context>, bot: TgBotService): Promise<void> {
        if (!ctx.match) {
            await ctx.reply(`Invalid command format.\nUsage: /${this.command} {userId} {message}.\nExample: /${this.command} 1234567890 Hello from admin!`);
            
            return;
        }
        
        const [userId, ...message] = ctx.match!.split(' ');
        
        if (!userId || !message.length) {
            await ctx.reply('Invalid command format');
            
            return;
        }
        
        const user = await bot.loadUserById(userId);
        
        if (!user) {
            await ctx.reply('User not found');
            
            return;
        }
        
        await ctx.api.sendMessage(user.id, message.join(' '));
    }

    checkAccess(role: UserRolesEnum): boolean {
        return role === UserRolesEnum.ADMIN;
    }
    
}
