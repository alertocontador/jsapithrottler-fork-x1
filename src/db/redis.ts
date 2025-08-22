import { createClient } from 'redis';

const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB || '0'),
};

export const redisClient = createClient(redisConfig);

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        return true;
    } catch (error) {
        console.error('Redis connection failed:', error);
        return false;
    }
};

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

