
import { Router, Request, Response } from 'express';
import { redisClient } from '../db/redis';
import http from 'http';

const router = Router();

const serviceA = process.env.SERVICE_A || 'servicea:7000';

const serviceB = process.env.SERVICE_B || 'serviceb:7001';

const serviceMap: { [key: string]: { host: string, port: number } } = {
    'a': { 
        host: serviceA.split(':')[0], 
        port: parseInt(serviceA.split(':')[1]) 
    },
    'b': { 
        host: serviceB.split(':')[0], 
        port: parseInt(serviceB.split(':')[1]) 
    }
};

console.log("SERVICE MAP", serviceMap)

const proxyRequest = (req: Request, res: Response, backend: string) => {

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

    const proxyReq = http.request(options, (proxyRes) => {
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
    } else {
        proxyReq.end();
    }
};

router.all('/:backend/*', async (req: Request, res: Response) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const backend = req.params.backend;
    const key = `rate_limit:${clientIp}:${backend}`;
    const windowSeconds = 60;
    const maxRequests = 10;

    try {
        const current = await redisClient.get(key);
        
        if (!current) {
            await redisClient.setEx(key, windowSeconds, '1');
        } else {
            const requestCount = parseInt(current);
            
            if (requestCount >= maxRequests) {
                return res.status(429).json({
                    error: 'Too many requests',
                    message: `Rate limit exceeded for backend '${backend}'. Maximum 10 requests per minute per backend.`,
                    backend: backend,
                    retryAfter: 60
                });
            }
            
            console.log(key, await redisClient.incr(key));
        }
    } catch (error) {
        console.error('Rate limiter error:', error);
    }

    // Proxy request to backend service
    proxyRequest(req, res, backend);
});


export default router;
