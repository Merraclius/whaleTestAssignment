import {
    Bot,
    CommandContext,
    Context
} from 'grammy';
import { Config } from '../config';
import { RedisService } from './redis.service';
import { UserRolesEnum } from '../user-roles.enum';
import { IUserModel } from '../models';
import { BaseCommand } from '../commands/base-command';
import { CommandsEnum } from '../commands/commands.enum';

/**
 * Telegram bot service
 */
export class TgBotService extends Bot {
    constructor() {
        if (!Config.botApiToken) {
            throw new Error('BOT_API_TOKEN is missing');
        }

        super(Config.botApiToken);
    }
    
    static init(): TgBotService {
        return new TgBotService();
    }

    /**
     * Start the bot
     */
    async start() {
        await super.start();
        
        process.once('SIGINT', () => this.stop());
        process.once('SIGTERM', () => this.stop());
    }

    /**
     * Register commands
     * 
     * @param commands
     */
    async registerCommands(commands: BaseCommand[]) {
        const commandsList = commands.map((command) => ({
            command: command.command,
            description: command.description
        }));
        
        await this.api.setMyCommands(commandsList);
        
        await Promise.all(commands.map(async (command) => {
            this.command(command.command,  
                async (ctx) => {
                    // Quick hack to ignore checkAccess for the start command
                    if (command.command !== CommandsEnum.START) {
                        const user = await this.loadUserById(ctx.message!.from.id);

                        if (!user) {
                            await ctx.reply('Access denied');

                            return;
                        }

                        if (!command.checkAccess(user.role)) {
                            await ctx.reply('Access denied');

                            return;

                        }
                    }
                    
                    await command.handler(ctx, this)
                }
            );
            
            return command.afterHandler(this);
        }));
    }

    // @Todo: Move all related to the users methods to repository abstraction and use DI 
    async saveUserByCtx(ctx: CommandContext<Context>): Promise<void> {
        if (!ctx.message?.from.id) {
            return;
        }
        
        const userData: IUserModel = {
            id: ctx.message.from.id,
            firstName: ctx.message.from.first_name,
            lastName: ctx.message.from.last_name,
            username: ctx.message.from.username,
            role: UserRolesEnum.USER
        }
        
        await this.saveToStore(userData.id, userData);
    }
    
    async loadUserById(id: string | number): Promise<IUserModel | undefined> {
        return await this.loadFromStore(id) as IUserModel;
    }
    
    async saveToStore(key: string | number, value: Record<string, any>): Promise<void> {
        await RedisService.saveToHash('session', key, value);
    }
    
    async loadFromStore(key: string | number): Promise<Record<string, any> | undefined> {
        return await RedisService.loadFromHash('session', key);
    }
}
