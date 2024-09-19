import { TwitterApiClient } from '../../../src/services/streamMonitoring/twitterApiClient';
import { TweetFilter } from '../../../src/services/streamMonitoring/tweetFilter';
import { PopularityThresholdChecker } from '../../../src/services/streamMonitoring/popularityThresholdChecker';
import { mockTwitterApi } from '../../mocks/twitterApiMock';
import { mockTweet } from '../../mocks/tweetMock';

// Human Tasks:
// TODO: Review and update test cases as new features are added to the stream monitoring services
// TODO: Implement integration tests to ensure proper interaction between TwitterApiClient, TweetFilter, and PopularityThresholdChecker
// TODO: Add more edge case scenarios to test robustness of the filtering and threshold checking logic
// TODO: Implement performance tests to ensure the stream monitoring services can handle high volume of tweets
// TODO: Add tests for error handling and recovery scenarios in the TwitterApiClient
// TODO: Implement mock server to simulate Twitter API responses for more comprehensive testing
// TODO: Ensure test coverage is maintained above 90% for all stream monitoring services

describe('TwitterApiClient', () => {
  test('should initialize TwitterApiClient with correct credentials', () => {
    // Create a new TwitterApiClient instance
    const client = new TwitterApiClient('apiKey', 'apiSecret', 'accessToken', 'accessTokenSecret');

    // Assert that the instance is created successfully
    expect(client).toBeInstanceOf(TwitterApiClient);

    // Assert that the API credentials are set correctly
    expect(client.getCredentials()).toEqual({
      apiKey: 'apiKey',
      apiSecret: 'apiSecret',
      accessToken: 'accessToken',
      accessTokenSecret: 'accessTokenSecret'
    });
  });

  test('should start streaming tweets', async () => {
    // Mock the Twitter API stream method
    const mockStream = jest.fn();
    mockTwitterApi.stream = mockStream;

    // Create a new TwitterApiClient instance
    const client = new TwitterApiClient('apiKey', 'apiSecret', 'accessToken', 'accessTokenSecret');

    // Call the startStream method
    const callback = jest.fn();
    await client.startStream(callback);

    // Assert that the stream is started correctly
    expect(mockStream).toHaveBeenCalledWith('statuses/filter', { track: 'javascript,typescript,nodejs' });

    // Assert that the callback is called with received tweets
    const mockTweetData = { id: '123', text: 'Test tweet' };
    mockStream.mock.calls[0][1](mockTweetData);
    expect(callback).toHaveBeenCalledWith(mockTweetData);
  });

  test('should fetch a tweet by ID', async () => {
    // Mock the Twitter API getTweet method
    const mockGetTweet = jest.fn().mockResolvedValue(mockTweet);
    mockTwitterApi.getTweet = mockGetTweet;

    // Create a new TwitterApiClient instance
    const client = new TwitterApiClient('apiKey', 'apiSecret', 'accessToken', 'accessTokenSecret');

    // Call the fetchTweet method with a mock tweet ID
    const tweetId = '123456789';
    const result = await client.fetchTweet(tweetId);

    // Assert that the correct tweet is returned
    expect(mockGetTweet).toHaveBeenCalledWith(tweetId);
    expect(result).toEqual(mockTweet);
  });
});

describe('TweetFilter', () => {
  test('should initialize TweetFilter with correct criteria', () => {
    // Create a new TweetFilter instance with mock criteria
    const criteria = { keywords: ['javascript', 'typescript'], minFollowers: 100 };
    const filter = new TweetFilter(criteria);

    // Assert that the instance is created successfully
    expect(filter).toBeInstanceOf(TweetFilter);

    // Assert that the filter criteria are set correctly
    expect(filter.getCriteria()).toEqual(criteria);
  });

  test('should correctly filter tweets based on criteria', () => {
    // Create a new TweetFilter instance with mock criteria
    const criteria = { keywords: ['javascript', 'typescript'], minFollowers: 100 };
    const filter = new TweetFilter(criteria);

    // Create mock tweets that meet and don't meet the criteria
    const validTweet = { ...mockTweet, text: 'This is a tweet about javascript', user: { followers_count: 200 } };
    const invalidTweet1 = { ...mockTweet, text: 'This is a tweet about python', user: { followers_count: 200 } };
    const invalidTweet2 = { ...mockTweet, text: 'This is a tweet about javascript', user: { followers_count: 50 } };

    // Call filterTweet method for each mock tweet
    const result1 = filter.filterTweet(validTweet);
    const result2 = filter.filterTweet(invalidTweet1);
    const result3 = filter.filterTweet(invalidTweet2);

    // Assert that tweets meeting criteria are accepted
    expect(result1).toBe(true);

    // Assert that tweets not meeting criteria are rejected
    expect(result2).toBe(false);
    expect(result3).toBe(false);
  });

  test('should update filter criteria correctly', () => {
    // Create a new TweetFilter instance with initial criteria
    const initialCriteria = { keywords: ['javascript'], minFollowers: 100 };
    const filter = new TweetFilter(initialCriteria);

    // Call updateFilterCriteria with new criteria
    const newCriteria = { keywords: ['typescript', 'nodejs'], minFollowers: 200 };
    filter.updateFilterCriteria(newCriteria);

    // Assert that the filter criteria are updated correctly
    expect(filter.getCriteria()).toEqual(newCriteria);
  });
});

describe('PopularityThresholdChecker', () => {
  test('should initialize PopularityThresholdChecker with correct thresholds', () => {
    // Create a new PopularityThresholdChecker instance with mock thresholds
    const thresholds = { likes: 100, retweets: 50 };
    const checker = new PopularityThresholdChecker(thresholds);

    // Assert that the instance is created successfully
    expect(checker).toBeInstanceOf(PopularityThresholdChecker);

    // Assert that the thresholds are set correctly
    expect(checker.getThresholds()).toEqual(thresholds);
  });

  test('should correctly check tweet popularity against thresholds', () => {
    // Create a new PopularityThresholdChecker instance with mock thresholds
    const thresholds = { likes: 100, retweets: 50 };
    const checker = new PopularityThresholdChecker(thresholds);

    // Create mock tweets with various popularity levels
    const popularTweet = { ...mockTweet, favorite_count: 150, retweet_count: 75 };
    const unpopularTweet1 = { ...mockTweet, favorite_count: 80, retweet_count: 75 };
    const unpopularTweet2 = { ...mockTweet, favorite_count: 150, retweet_count: 30 };

    // Call checkPopularityThreshold method for each mock tweet
    const result1 = checker.checkPopularityThreshold(popularTweet);
    const result2 = checker.checkPopularityThreshold(unpopularTweet1);
    const result3 = checker.checkPopularityThreshold(unpopularTweet2);

    // Assert that tweets meeting thresholds are accepted
    expect(result1).toBe(true);

    // Assert that tweets not meeting thresholds are rejected
    expect(result2).toBe(false);
    expect(result3).toBe(false);
  });

  test('should update popularity thresholds correctly', () => {
    // Create a new PopularityThresholdChecker instance with initial thresholds
    const initialThresholds = { likes: 100, retweets: 50 };
    const checker = new PopularityThresholdChecker(initialThresholds);

    // Call updateThresholds with new threshold values
    const newThresholds = { likes: 200, retweets: 100 };
    checker.updateThresholds(newThresholds);

    // Assert that the thresholds are updated correctly
    expect(checker.getThresholds()).toEqual(newThresholds);
  });
});