import request from 'supertest';
import app from '../../src/app';
import { connectToDatabase, disconnectFromDatabase } from '../../src/config/database';
import { TweetData, ResponseData, AiTool, ConfigData } from '../../src/types';
import { mockTweet } from '../mocks/tweetMock';
import { mockResponse } from '../mocks/responseMock';
import { mockAiTool } from '../mocks/aiToolMock';
import { mockConfig } from '../mocks/configMock';

describe('API Integration Tests', () => {
  // Set up database connection before all tests
  beforeAll(async () => {
    await connectToDatabase();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe('Tweet Endpoints', () => {
    test('should return a list of tweets', async () => {
      const response = await request(app).get('/tweets');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('content');
      expect(response.body[0]).toHaveProperty('author');
    });

    test('should create a new tweet', async () => {
      const response = await request(app)
        .post('/tweets')
        .send(mockTweet);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(mockTweet);
      // Additional check to ensure the tweet is created in the database
      const createdTweet = await request(app).get(`/tweets/${response.body.id}`);
      expect(createdTweet.body).toMatchObject(mockTweet);
    });

    // Additional tests for GET /tweets/:id, PUT /tweets/:id, and DELETE /tweets/:id would go here
  });

  describe('Response Endpoints', () => {
    test('should return a list of responses', async () => {
      const response = await request(app).get('/responses');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('content');
      expect(response.body[0]).toHaveProperty('tweetId');
    });

    test('should create a new response', async () => {
      const response = await request(app)
        .post('/responses')
        .send(mockResponse);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(mockResponse);
      // Additional check to ensure the response is created in the database
      const createdResponse = await request(app).get(`/responses/${response.body.id}`);
      expect(createdResponse.body).toMatchObject(mockResponse);
    });

    // Additional tests for GET /responses/:id, PUT /responses/:id, and DELETE /responses/:id would go here
  });

  describe('AI Tool Endpoints', () => {
    test('should return a list of AI tools', async () => {
      const response = await request(app).get('/ai-tools');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    test('should create a new AI tool', async () => {
      const response = await request(app)
        .post('/ai-tools')
        .send(mockAiTool);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(mockAiTool);
      // Additional check to ensure the AI tool is created in the database
      const createdAiTool = await request(app).get(`/ai-tools/${response.body.id}`);
      expect(createdAiTool.body).toMatchObject(mockAiTool);
    });

    // Additional tests for GET /ai-tools/:id, PUT /ai-tools/:id, and DELETE /ai-tools/:id would go here
  });

  describe('Configuration Endpoints', () => {
    test('should return the current configuration', async () => {
      const response = await request(app).get('/config');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('scanInterval');
      expect(response.body).toHaveProperty('aiToolsEnabled');
    });

    test('should update the configuration', async () => {
      const response = await request(app)
        .put('/config')
        .send(mockConfig);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockConfig);
      // Additional check to ensure the configuration is updated in the database
      const updatedConfig = await request(app).get('/config');
      expect(updatedConfig.body).toMatchObject(mockConfig);
    });
  });
});

// Human tasks:
// - Implement authentication and authorization tests for protected endpoints
// - Add tests for pagination and filtering on list endpoints
// - Implement tests for error scenarios (e.g., invalid input, not found resources)
// - Add tests for rate limiting and API abuse prevention
// - Implement tests for data validation and sanitization
// - Add performance tests to ensure API endpoints respond within acceptable time limits
// - Implement tests for all CRUD operations on each resource type