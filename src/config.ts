const { BOT_API_TOKEN, REDIS_HOST, WEBAPP_URL } = process.env;

export class Config {
    static get webappUrl(): string {
        if (!WEBAPP_URL) {
            throw new Error('WEBAPP_URL is missing');
        }
        
        return WEBAPP_URL;
    }
    
    static get botApiToken(): string {
        return BOT_API_TOKEN || '';
    }

    static get redisHost(): string {
        return REDIS_HOST || 'redis://redis:6379';
    }
}
