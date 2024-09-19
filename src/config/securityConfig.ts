import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import { config } from './apiConfig';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';

// Configure Helmet middleware for enhanced security headers
const configureHelmet = (): ReturnType<typeof helmet> => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    xssFilter: true,
    frameguard: {
      action: 'deny',
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    hidePoweredBy: true,
  });
};

// Configure CORS middleware with appropriate settings
const configureCors = (): ReturnType<typeof cors> => {
  const allowedOrigins = config.cors.allowedOrigins;
  return cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};

// Configure rate limiter middleware to prevent abuse
const configureRateLimiter = (): express.RequestHandler => {
  const { maxRequests, windowMs } = config.rateLimit;
  return rateLimit({
    max: maxRequests,
    windowMs: windowMs,
    message: 'Too many requests, please try again later.',
  });
};

// Apply security middleware to the Express application
const configureSecurity = (app: express.Application): void => {
  app.use(configureHelmet());
  app.use(configureCors());
  app.use(configureRateLimiter());
  logger.info('Security configurations applied successfully');
};

export { configureSecurity };

// Human tasks:
// TODO: Regularly review and update security configurations to address new vulnerabilities
// TODO: Implement additional security measures such as API key authentication for certain routes
// TODO: Develop a system for monitoring and alerting on potential security threats
// TODO: Implement IP blocking for repeated abuse attempts
// TODO: Consider implementing a Web Application Firewall (WAF) for additional protection
// TODO: Conduct regular security audits and penetration testing