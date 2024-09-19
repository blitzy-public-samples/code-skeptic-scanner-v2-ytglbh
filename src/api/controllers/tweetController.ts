import express from 'express';
import { TweetData } from '../../types';
import { NotionApiClient } from '../../services/dataExtraction/notionApiClient';
import { TweetParser } from '../../services/dataExtraction/tweetParser';
import { DoubtRatingAssigner } from '../../services/sentimentAnalysis/doubtRatingAssigner';
import { AiToolMentionDetector } from '../../services/sentimentAnalysis/aiToolMentionDetector';
import { logger } from '../../utils/logger';

class TweetController {
  private notionClient: NotionApiClient;
  private tweetParser: TweetParser;
  private doubtRatingAssigner: DoubtRatingAssigner;
  private aiToolMentionDetector: AiToolMentionDetector;

  constructor(
    notionClient: NotionApiClient,
    tweetParser: TweetParser,
    doubtRatingAssigner: DoubtRatingAssigner,
    aiToolMentionDetector: AiToolMentionDetector
  ) {
    this.notionClient = notionClient;
    this.tweetParser = tweetParser;
    this.doubtRatingAssigner = doubtRatingAssigner;
    this.aiToolMentionDetector = aiToolMentionDetector;
  }

  public async getTweets(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract query parameters
      const { page, limit, startDate, endDate } = req.query;

      // TODO: Implement input validation for query parameters

      // Call notionClient to fetch tweets based on parameters
      const tweets = await this.notionClient.getTweets(page, limit, startDate, endDate);

      // Send JSON response with fetched tweets
      res.json(tweets);
    } catch (error) {
      logger.error('Error in getTweets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getTweetById(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract tweet ID from request parameters
      const { id } = req.params;

      // Call notionClient to fetch the tweet by ID
      const tweet = await this.notionClient.getTweetById(id);

      if (tweet) {
        // If tweet is found, send JSON response with tweet data
        res.json(tweet);
      } else {
        // If tweet is not found, send 404 error response
        res.status(404).json({ error: 'Tweet not found' });
      }
    } catch (error) {
      logger.error('Error in getTweetById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async createTweet(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract tweet data from request body
      const tweetData: TweetData = req.body;

      // TODO: Implement input validation for tweet data

      // Use tweetParser to parse and structure the tweet data
      const parsedTweet = this.tweetParser.parse(tweetData);

      // Assign doubt rating using doubtRatingAssigner
      const doubtRating = await this.doubtRatingAssigner.assignRating(parsedTweet.content);

      // Detect AI tool mentions using aiToolMentionDetector
      const aiToolMentions = await this.aiToolMentionDetector.detectMentions(parsedTweet.content);

      // Merge parsed tweet with analysis results
      const enrichedTweet = {
        ...parsedTweet,
        doubtRating,
        aiToolMentions
      };

      // Call notionClient to store the parsed and analyzed tweet
      const createdTweet = await this.notionClient.createTweet(enrichedTweet);

      // Send JSON response with created tweet data
      res.status(201).json(createdTweet);
    } catch (error) {
      logger.error('Error in createTweet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updateTweet(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract tweet ID from request parameters
      const { id } = req.params;

      // Extract update data from request body
      const updateData: Partial<TweetData> = req.body;

      // TODO: Implement input validation for update data

      // Call notionClient to fetch the existing tweet
      const existingTweet = await this.notionClient.getTweetById(id);

      if (!existingTweet) {
        res.status(404).json({ error: 'Tweet not found' });
        return;
      }

      // Merge existing tweet data with update data
      const mergedTweet = { ...existingTweet, ...updateData };

      // Re-assign doubt rating if content changed
      if (updateData.content) {
        mergedTweet.doubtRating = await this.doubtRatingAssigner.assignRating(mergedTweet.content);
      }

      // Re-detect AI tool mentions if content changed
      if (updateData.content) {
        mergedTweet.aiToolMentions = await this.aiToolMentionDetector.detectMentions(mergedTweet.content);
      }

      // Call notionClient to update the tweet
      const updatedTweet = await this.notionClient.updateTweet(id, mergedTweet);

      // Send JSON response with updated tweet data
      res.json(updatedTweet);
    } catch (error) {
      logger.error('Error in updateTweet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async deleteTweet(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract tweet ID from request parameters
      const { id } = req.params;

      // Call notionClient to delete the tweet
      await this.notionClient.deleteTweet(id);

      // Send JSON response confirming successful deletion
      res.json({ message: 'Tweet deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteTweet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function createTweetController(
  notionClient: NotionApiClient,
  tweetParser: TweetParser,
  doubtRatingAssigner: DoubtRatingAssigner,
  aiToolMentionDetector: AiToolMentionDetector
): TweetController {
  // Create a new TweetController instance with provided dependencies
  return new TweetController(notionClient, tweetParser, doubtRatingAssigner, aiToolMentionDetector);
}

// Human tasks:
// TODO: Implement input validation for all controller methods to ensure data integrity
// TODO: Develop unit tests for each controller method to ensure correct behavior
// TODO: Implement error handling and appropriate HTTP status codes for various error scenarios
// TODO: Consider implementing caching mechanisms for frequently accessed tweets
// TODO: Develop a mechanism for handling bulk operations on tweets, if needed
// TODO: Implement logging for all major operations and error cases