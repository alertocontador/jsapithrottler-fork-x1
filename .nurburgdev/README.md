---
title: "Implement an API ratelimiter in Nodejs"
tags:
  - redis
  - nodejs
  - expressjs
  - typescript
summary: "Ratelimitter are middlewares which disallow api access to an enpoint if the number of API requests cross a certain number per minute. In this assignment you will be implementing an API ratelimiter in nodejs."
---

## Problem Statement

You need to implement an API rate limiter in Node.js that can limit the number of request to backend services `service-a` and `service-b`.

The application consists of:

- **Main API Server**: Express.js application with rate limiting middleware
- **Service A**: Backend service running in devcontainer
- **Service B**: Backend service running in devcontainer
- **Redis**: Optional Redis setup provided. Could be used in your architecture if you like.

Following functionality should be ensured.

1. `POST /api/a/*` - Routes to Service A with rate limiting
2. `POST /api/b/*` - Routes to Service B with rate limiting
3. Each backend service has independent rate limiting.

## Development Setup

Please go through the development setup. You can open the development setup by click the "Open Code" button.

### Express.js Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.dev .env
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Application URL**
   - Local server: http://localhost:3000

## Database Services

### Redis

- **Host**: jsapithrottlerredis
- **Port**: 6379
- **Database**: 0

## Development Workflow

1. Make your changes to the code
2. Test locally using the development server
3. Ensure all tests pass
4. Deploy using the production configuration

## Production Deployment

The application uses `.env.prod` for production environment variables with Kubernetes service names for database connections.
