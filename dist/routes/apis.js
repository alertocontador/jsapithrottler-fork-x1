"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../db/redis");
const http_1 = __importDefault(require("http"));
const router = (0, express_1.Router)();
const serviceA = process.env.SERVICE_A || 'servicea:7000';
const serviceB = process.env.SERVICE_B || 'serviceb:7001';
const serviceMap = {
    'a': {
        host: serviceA.split(':')[0],
        port: parseInt(serviceA.split(':')[1])
    },
    'b': {
        host: serviceB.split(':')[0],
        port: parseInt(serviceB.split(':')[1])
    }
};
console.log("SERVICE MAP", serviceMap);
const proxyRequest = (req, res, backend) => {
    const service = serviceMap[backend];
    if (!service) {
        return res.status(404).json({
            error: 'Backend not found',
            message: `Backend '${backend}' is not available. Available backends: a, b`
        });
    }
    const targetPath = req.url;
    const options = {
        hostname: service.host,
        port: service.port,
        path: targetPath,
        method: req.method,
        headers: { ...req.headers, host: `${service.host}:${service.port}` }
    };
    const proxyReq = http_1.default.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode || 200);
        Object.keys(proxyRes.headers).forEach(key => {
            const value = proxyRes.headers[key];
            if (value) {
                res.setHeader(key, value);
            }
        });
        proxyRes.pipe(res);
    });
    proxyReq.on('error', (error) => {
        console.error(`Proxy error for backend ${backend}:`, error);
        res.status(502).json({
            error: 'Bad Gateway',
            message: `Failed to connect to backend '${backend}'`
        });
    });
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        req.pipe(proxyReq);
    }
    else {
        proxyReq.end();
    }
};
router.all('/:backend/*', async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const backend = req.params.backend;
    const key = `rate_limit:${clientIp}:${backend}`;
    const windowSeconds = 60;
    const maxRequests = 10;
    try {
        const current = await redis_1.redisClient.get(key);
        if (!current) {
            await redis_1.redisClient.setEx(key, windowSeconds, '1');
        }
        else {
            const requestCount = parseInt(current);
            if (requestCount >= maxRequests) {
                return res.status(429).json({
                    error: 'Too many requests',
                    message: `Rate limit exceeded for backend '${backend}'. Maximum 10 requests per minute per backend.`,
                    backend: backend,
                    retryAfter: 60
                });
            }
            console.log(key, await redis_1.redisClient.incr(key));
        }
    }
    catch (error) {
        console.error('Rate limiter error:', error);
    }
    // Proxy request to backend service
    proxyRequest(req, res, backend);
});
exports.default = router;
//# sourceMappingURL=apis.js.map