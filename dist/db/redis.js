"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB || '0'),
};
exports.redisClient = (0, redis_1.createClient)(redisConfig);
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        console.log('Connected to Redis');
        return true;
    }
    catch (error) {
        console.error('Redis connection failed:', error);
        return false;
    }
};
exports.connectRedis = connectRedis;
exports.redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
//# sourceMappingURL=redis.js.map