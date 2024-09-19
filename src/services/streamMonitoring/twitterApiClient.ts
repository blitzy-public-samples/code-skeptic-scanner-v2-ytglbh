import { Twitter, TweetStream } from 'twitter-api-v2';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';
import { TweetData } from '../types';

// Environment variables for Twitter API credentials
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;

class TwitterApiClient {
  private client: Twitter;
  private streamRules: string;

  constructor() {
    // Initialize Twitter client with API credentials
    this.client = new Twitter({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    });

    // Set up stream rules for AI coding tool-related tweets
    this.streamRules = 'AI coding tools OR code generation AI OR AI pair programming';
  }

  async startStream(callback: (tweet: TweetData) => void): Promise<void> {
    try {
      // Create a filtered stream using the Twitter client
      const stream = await this.client.v2.filterStream({
        'tweet.fields': ['author_id', 'created_at', 'text', 'public_metrics'],
      });

      // Set up event listeners for tweets, errors, and connection issues
      stream.on('data', (tweet) => {
        const tweetData: TweetData = {
          id: tweet.data.id,
          text: tweet.data.text,
          authorId: tweet.data.author_id,
          createdAt: tweet.data.created_at,
          publicMetrics: tweet.data.public_metrics,
        };
        callback(tweetData);
      });

      stream.on('error', (error) => {
        logger.error('Error in Twitter stream:', error);
      });

      stream.on('connection_error', (error) => {
        logger.error('Twitter stream connection error:', error);
      });

      // Start the stream
      await stream.connect();

      // Log the stream start
      logger.info('Twitter stream started successfully');
    } catch (error) {
      logger.error('Failed to start Twitter stream:', error);
      throw error;
    }
  }

  async fetchTweet(tweetId: string): Promise<TweetData> {
    try {
      // Use the Twitter client to fetch the tweet by ID
      const tweet = await this.client.v2.singleTweet(tweetId, {
        'tweet.fields': ['author_id', 'created_at', 'text', 'public_metrics'],
      });

      // Transform the raw tweet data into the TweetData format
      const tweetData: TweetData = {
        id: tweet.data.id,
        text: tweet.data.text,
        authorId: tweet.data.author_id,
        createdAt: tweet.data.created_at,
        publicMetrics: tweet.data.public_metrics,
      };

      return tweetData;
    } catch (error) {
      logger.error(`Failed to fetch tweet with ID ${tweetId}:`, error);
      throw error;
    }
  }

  async updateStreamRules(newRules: string[]): Promise<void> {
    try {
      // Retrieve current stream rules
      const currentRules = await this.client.v2.streamRules();

      // Delete all existing rules
      if (currentRules.data && currentRules.data.length > 0) {
        await this.client.v2.updateStreamRules({
          delete: { ids: currentRules.data.map((rule) => rule.id) },
        });
      }

      // Add new rules
      await this.client.v2.updateStreamRules({
        add: newRules.map((rule) => ({ value: rule })),
      });

      // Update the streamRules property
      this.streamRules = newRules.join(' OR ');

      // Log the rule update
      logger.info('Stream rules updated successfully');
    } catch (error) {
      logger.error('Failed to update stream rules:', error);
      throw error;
    }
  }
}

export function createTwitterApiClient(): TwitterApiClient {
  // Create a new TwitterApiClient instance
  return new TwitterApiClient();
}

// Human tasks:
// - Regularly review and update stream rules to ensure relevance
// - Monitor stream performance and adjust error handling as needed
// - Regularly review Twitter API usage to ensure compliance with rate limits
// - Periodically review and optimize stream rules for better tweet filtering