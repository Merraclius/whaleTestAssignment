import { TgBotService } from '../services';
import { UserRolesEnum } from '../user-roles.enum';

export abstract class BaseCommand {
    /**
     * Name of the command
     */
    public abstract command: string;
    
    /**
     * Description of the command
     */
    public abstract description: string;
    
    /**
     * The main handler of the command
     * @param ctx Context of the command
     * @param bot Bot service
     */
    public abstract handler(ctx: any, bot: TgBotService): Promise<void>;
    
    /**
     * Handler after the main handler (usually used for the button handlers)
     * @param bot Bot service
     */
    public abstract afterHandler(bot: TgBotService): Promise<void>;
    
    /**
     * Check access for the command based on the user role
     * @param roel User role
     */
    public abstract checkAccess(roel: UserRolesEnum): boolean;
}
