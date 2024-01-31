import {
    createClient,
    RedisClientType,
} from 'redis';
import { Config } from '../config';

let service: RedisClientType;

/**
 * Redis service
 * @Todo: Instead of using Redis directly, add the storage abstraction layer and use DI to use it.
 */
export class RedisService {
    static async init() {
        service = createClient({
            url: Config.redisHost
        });

        await service.connect();

        process.once('SIGINT', () => service.disconnect());
        process.once('SIGTERM', () => service.disconnect());
    }
    
    static async saveToHash(hashKey: string, field: string | number, value: Record<string, any>): Promise<void> {
        await service.hSet(hashKey, field, this.serialize(value));
    }
    
    static async loadFromHash(hashKey: string, field?: string | number): Promise<Record<string, any> | undefined> {
        if (!field) {
            const value = await service.hGetAll(hashKey);
            
            return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, this.deserialize(value)]));
        }
        
        const value = await service.hGet(hashKey, typeof field === 'number' ? field.toString() : field);
        
        return this.deserialize(value);
    }
    
    static serialize(value: Record<string, any>): string {
        return JSON.stringify(value);
    }
    
    static deserialize(value?: string): Record<string, any> | undefined {
        if (!value) {
            return;
        }
        
        return JSON.parse(value);
    }
}
