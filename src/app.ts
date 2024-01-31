import {
    RedisService,
    TgBotService
} from './services';
import {
    CommandAdminHello,
    CommandChangeRole,
    CommandGetUsers,
    CommandStart
} from './commands';

const initBot = async () => {
    const bot = TgBotService.init();

    await bot.registerCommands([
        new CommandStart(),
        new CommandChangeRole(),
        new CommandGetUsers(),
        new CommandAdminHello()
    ]);

    await bot.start();
};

const initRedis = async () => {
    await RedisService.init();
};

export async function init() {
    await initRedis();
    await initBot();
}
