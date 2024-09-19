import { jest } from 'jest';
import { ContextAggregator } from '../../../src/services/aiResponseGeneration/contextAggregator';
import { LlmApiClient } from '../../../src/services/aiResponseGeneration/llmApiClient';
import { ResponseFormatter } from '../../../src/services/aiResponseGeneration/responseFormatter';
import { mockTweet } from '../../mocks/tweetMock';
import { mockContext } from '../../mocks/contextMock';
import { mockLlmResponse } from '../../mocks/llmResponseMock';

// Test suite for ContextAggregator
describe('ContextAggregator', () => {
  // Test ContextAggregator initialization
  test('should initialize ContextAggregator with NotionApiClient', () => {
    const mockNotionApiClient = jest.fn();
    const contextAggregator = new ContextAggregator(mockNotionApiClient);
    expect(contextAggregator).toBeDefined();
    expect(contextAggregator.notionApiClient).toBe(mockNotionApiClient);
  });

  // Test aggregateContext method
  test('should aggregate context correctly', async () => {
    const mockNotionApiClient = {
      getTweetHistory: jest.fn().mockResolvedValue(['tweet1', 'tweet2']),
      getAiToolDetails: jest.fn().mockResolvedValue({ tool1: 'details1', tool2: 'details2' }),
      getUserProfile: jest.fn().mockResolvedValue({ name: 'John Doe', bio: 'AI enthusiast' })
    };
    const contextAggregator = new ContextAggregator(mockNotionApiClient);
    const mentionedTools = ['tool1', 'tool2'];

    const context = await contextAggregator.aggregateContext(mockTweet, mentionedTools);

    expect(mockNotionApiClient.getTweetHistory).toHaveBeenCalledWith(mockTweet.user.id);
    expect(mockNotionApiClient.getAiToolDetails).toHaveBeenCalledWith(mentionedTools);
    expect(mockNotionApiClient.getUserProfile).toHaveBeenCalledWith(mockTweet.user.id);

    expect(context).toEqual({
      tweetHistory: ['tweet1', 'tweet2'],
      aiToolDetails: { tool1: 'details1', tool2: 'details2' },
      userProfile: { name: 'John Doe', bio: 'AI enthusiast' }
    });
  });
});

// Test suite for LlmApiClient
describe('LlmApiClient', () => {
  // Test LlmApiClient initialization
  test('should initialize LlmApiClient with correct API key and endpoint', () => {
    const apiKey = 'test-api-key';
    const endpoint = 'https://api.example.com';
    const llmApiClient = new LlmApiClient(apiKey, endpoint);

    expect(llmApiClient).toBeDefined();
    expect(llmApiClient.apiKey).toBe(apiKey);
    expect(llmApiClient.endpoint).toBe(endpoint);
  });

  // Test generateResponse method
  test('should generate response correctly', async () => {
    const llmApiClient = new LlmApiClient('test-api-key', 'https://api.example.com');
    const mockApiResponse = { choices: [{ text: 'Generated response' }] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse)
    });

    const response = await llmApiClient.generateResponse(mockTweet, mockContext);

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com', expect.any(Object));
    expect(response).toEqual(mockApiResponse.choices[0].text);
  });
});

// Test suite for ResponseFormatter
describe('ResponseFormatter', () => {
  // Test ResponseFormatter initialization
  test('should initialize ResponseFormatter with correct configuration', () => {
    const config = {
      maxLength: 280,
      forbiddenWords: ['bad', 'word']
    };
    const responseFormatter = new ResponseFormatter(config);

    expect(responseFormatter).toBeDefined();
    expect(responseFormatter.config).toEqual(config);
  });

  // Test formatResponse method
  test('should format response correctly', () => {
    const config = {
      maxLength: 280,
      forbiddenWords: ['bad', 'word']
    };
    const responseFormatter = new ResponseFormatter(config);
    const originalTweet = mockTweet;
    const unformattedResponse = 'This is a bad response with a forbidden word';

    const formattedResponse = responseFormatter.formatResponse(unformattedResponse, originalTweet);

    expect(formattedResponse.length).toBeLessThanOrEqual(280);
    expect(formattedResponse).not.toContain('bad');
    expect(formattedResponse).not.toContain('word');
    expect(formattedResponse).toContain(originalTweet.user.screen_name);
  });
});

// Human tasks:
// - Review and update test cases as new features are added to the AI response generation services
// - Implement integration tests to ensure proper interaction between ContextAggregator, LlmApiClient, and ResponseFormatter
// - Add more edge case scenarios to test robustness of the context aggregation and response generation logic
// - Implement performance tests to ensure efficient processing of responses for high-volume scenarios
// - Add tests for error handling and recovery scenarios in all services
// - Develop tests for different types of tweets and contexts to ensure versatility of response generation
// - Ensure test coverage is maintained above 90% for all AI response generation services