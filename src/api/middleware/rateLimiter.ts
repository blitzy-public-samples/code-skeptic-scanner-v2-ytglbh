import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { config } from '../../config/apiConfig';
import { logger } from '../../utils/logger';

/**
 * Creates and returns a rate limiter middleware function.
 * @returns {express.RequestHandler} A rate limiter middleware function.
 */
export const createRateLimiterMiddleware = (): express.RequestHandler => {
  // Create a new Redis client using configuration settings
  const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  });

  // Create a new RedisStore instance with the Redis client
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
  });

  // Configure the rate limiter options (max requests, window ms, etc.) from config
  const rateLimiterOptions = {
    store: redisStore,
    max: config.rateLimit.maxRequests,
    windowMs: config.rateLimit.windowMs,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: express.Request, res: express.Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    },
  };

  // Create a new rateLimit instance with the configured options and RedisStore
  const limiter = rateLimit(rateLimiterOptions);

  // Return the created rate limiter middleware function
  return limiter;
};

// Human tasks (for future improvements):
// TODO: Regularly review and adjust rate limiting thresholds based on API usage patterns
// TODO: Implement different rate limits for various API endpoints based on their resource intensity
// TODO: Develop a mechanism for whitelisting certain IP addresses or API keys from rate limiting
// TODO: Create a system for notifying administrators when rate limits are consistently being hit
// TODO: Implement a gradual backoff strategy for repeated limit violations
// TODO: Consider implementing a token bucket algorithm for more flexible rate limiting