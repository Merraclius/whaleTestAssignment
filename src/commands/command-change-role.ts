import { BaseCommand } from './base-command';
import { CommandsEnum } from './commands.enum';
import {
    CommandContext,
    Context,
    InlineKeyboard
} from 'grammy';
import { TgBotService } from '../services';
import { ButtonsEnum } from '../buttons.enum';
import type { CallbackQueryContext } from 'grammy/out/context';
import { UserRolesEnum } from '../user-roles.enum';

export class CommandChangeRole extends BaseCommand {
    command: string = CommandsEnum.CHANGE_ROLE;
    description: string = "Change the user role";
    
    selectedUserId: number | null = null;

    async handler(ctx: CommandContext<Context>, bot: TgBotService): Promise<void> {
        const userId = parseInt(ctx.match);

        if (!userId) {
            await ctx.reply(`Need to specify the user id.\nUsage: /${this.command} {userId}.\nExample: /${this.command} 1234567890`);
            
            return;
        }

        const user = await bot.loadUserById(userId);

        if (!user) {
            await ctx.reply("User not found");
            
            return;
        }
        
        this.selectedUserId = userId;

        await ctx.reply(`<b>Change role</b>\n\nSelect a new role for user ${user.username} (current: ${user.role})`, {
            parse_mode: "HTML",
            reply_markup: new InlineKeyboard()
                .text("Admin", ButtonsEnum.ADMIN)
                .text("User", ButtonsEnum.USER)
                .text("Cancel", ButtonsEnum.CANCEL_CHANGE_ROLE),
        });
    }
    
    async afterHandler(bot: TgBotService): Promise<void> {
        bot.callbackQuery([ButtonsEnum.ADMIN, ButtonsEnum.USER], async (ctx) => {
            const role = ctx.match as UserRolesEnum;
            
            if (!this.selectedUserId) {
                await ctx.reply("User is not selected");
                
                return;
            }
            
            const user = await bot.loadUserById(this.selectedUserId);
            
            if (!user) {
                await ctx.reply("User not found");
                
                return;
            }
            
            user.role = role;
            
            await bot.saveToStore(user.id, user);
            
            await ctx.editMessageText("Role changed successfully");
        });

        bot.callbackQuery(ButtonsEnum.CANCEL_CHANGE_ROLE, async (ctx: CallbackQueryContext<Context>) => {
            this.selectedUserId = null;
            await ctx.deleteMessage();
        });
    }
    
    checkAccess(role: UserRolesEnum): boolean {
        return [UserRolesEnum.ADMIN, UserRolesEnum.USER].includes(role);
    }
}
