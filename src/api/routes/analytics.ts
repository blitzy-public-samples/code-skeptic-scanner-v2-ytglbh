import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { logger } from '../../utils/logger';

export function createAnalyticsRoutes(analyticsController: AnalyticsController): express.Router {
  // Create a new Express router
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiter middleware to all routes
  router.use(rateLimiterMiddleware);

  // Define GET /analytics/sentiment route to retrieve sentiment trends
  router.get('/sentiment', analyticsController.getSentimentTrends);

  // Define GET /analytics/engagement route to retrieve engagement metrics
  router.get('/engagement', analyticsController.getEngagementMetrics);

  // Define GET /analytics/ai-tools route to retrieve AI tool mention trends
  router.get('/ai-tools', analyticsController.getAIToolMentionTrends);

  // Define GET /analytics/daily-report route to generate a daily report
  router.get('/daily-report', analyticsController.generateDailyReport);

  // Define GET /analytics/weekly-report route to generate a weekly report
  router.get('/weekly-report', analyticsController.generateWeeklyReport);

  // Define GET /analytics/monthly-report route to generate a monthly report
  router.get('/monthly-report', analyticsController.generateMonthlyReport);

  // Define POST /analytics/custom-report route to generate a custom report
  router.post('/custom-report', analyticsController.generateCustomReport);

  // Define GET /analytics/predictions route to retrieve future trend predictions
  router.get('/predictions', analyticsController.getFutureTrendPredictions);

  // Log the creation of analytics routes
  logger.info('Analytics routes created');

  // Return the configured router
  return router;
}

// Human tasks:
// TODO: Regularly review and update API documentation for analytics routes
// TODO: Implement comprehensive input validation for all route parameters and request bodies
// TODO: Develop integration tests to ensure proper functionality of analytics routes
// TODO: Monitor API usage patterns and adjust rate limiting rules as necessary
// TODO: Implement versioning strategy for the API to allow for future updates without breaking existing clients
// TODO: Consider implementing caching mechanisms for frequently requested analytics data
// TODO: Develop a mechanism for scheduling and automating report generation
// TODO: Implement export functionality for analytics data in various formats (CSV, JSON, PDF)