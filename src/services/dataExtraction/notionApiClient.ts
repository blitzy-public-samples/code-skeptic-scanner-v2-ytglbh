import { Client } from '@notionhq/client';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';
import { TweetData, ResponseData } from '../types';

const NOTION_API_KEY = process.env.NOTION_API_KEY || config.notionApiKey;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || config.notionDatabaseId;

class NotionApiClient {
  private notionClient: Client;
  private databaseId: string;

  constructor() {
    // Initialize Notion client with API key from environment variables or config
    this.notionClient = new Client({ auth: NOTION_API_KEY });
    // Set database ID from environment variables or config
    this.databaseId = NOTION_DATABASE_ID;
  }

  async storeTweet(tweetData: TweetData): Promise<string> {
    try {
      // Prepare the tweet data for Notion page creation
      const pageProperties = this.prepareTweetProperties(tweetData);

      // Create a new page in the Notion database with the tweet data
      const response = await this.notionClient.pages.create({
        parent: { database_id: this.databaseId },
        properties: pageProperties,
      });

      // Log the successful storage of the tweet
      logger.info(`Tweet stored successfully with ID: ${response.id}`);

      // Return the ID of the created Notion page
      return response.id;
    } catch (error) {
      logger.error(`Error storing tweet: ${error}`);
      throw error;
    }
  }

  async storeResponse(responseData: ResponseData): Promise<string> {
    try {
      // Prepare the response data for Notion page creation
      const pageProperties = this.prepareResponseProperties(responseData);

      // Create a new page in the Notion database with the response data
      const response = await this.notionClient.pages.create({
        parent: { database_id: this.databaseId },
        properties: pageProperties,
      });

      // Log the successful storage of the response
      logger.info(`Response stored successfully with ID: ${response.id}`);

      // Return the ID of the created Notion page
      return response.id;
    } catch (error) {
      logger.error(`Error storing response: ${error}`);
      throw error;
    }
  }

  async getTweet(tweetId: string): Promise<TweetData> {
    try {
      // Query the Notion database for the page with the given tweet ID
      const response = await this.notionClient.pages.retrieve({ page_id: tweetId });

      // Extract the tweet data from the Notion page
      const tweetData = this.extractTweetData(response);

      // Convert the Notion page data to TweetData format
      return tweetData;
    } catch (error) {
      logger.error(`Error retrieving tweet: ${error}`);
      throw error;
    }
  }

  async getResponse(responseId: string): Promise<ResponseData> {
    try {
      // Query the Notion database for the page with the given response ID
      const response = await this.notionClient.pages.retrieve({ page_id: responseId });

      // Extract the response data from the Notion page
      const responseData = this.extractResponseData(response);

      // Convert the Notion page data to ResponseData format
      return responseData;
    } catch (error) {
      logger.error(`Error retrieving response: ${error}`);
      throw error;
    }
  }

  async updateTweet(tweetId: string, updateData: Partial<TweetData>): Promise<void> {
    try {
      // Prepare the update data for Notion page update
      const updateProperties = this.prepareTweetProperties(updateData);

      // Update the Notion page with the given tweet ID
      await this.notionClient.pages.update({
        page_id: tweetId,
        properties: updateProperties,
      });

      // Log the successful update of the tweet
      logger.info(`Tweet updated successfully with ID: ${tweetId}`);
    } catch (error) {
      logger.error(`Error updating tweet: ${error}`);
      throw error;
    }
  }

  private prepareTweetProperties(tweetData: Partial<TweetData>): any {
    // Implement the logic to convert TweetData to Notion properties
    // This will depend on your Notion database schema
    // Return the prepared properties object
  }

  private prepareResponseProperties(responseData: ResponseData): any {
    // Implement the logic to convert ResponseData to Notion properties
    // This will depend on your Notion database schema
    // Return the prepared properties object
  }

  private extractTweetData(notionPage: any): TweetData {
    // Implement the logic to extract TweetData from Notion page
    // This will depend on your Notion database schema
    // Return the extracted TweetData object
  }

  private extractResponseData(notionPage: any): ResponseData {
    // Implement the logic to extract ResponseData from Notion page
    // This will depend on your Notion database schema
    // Return the extracted ResponseData object
  }
}

export function createNotionApiClient(): NotionApiClient {
  // Create a new NotionApiClient instance
  return new NotionApiClient();
}

// Human tasks:
// - Regularly review and update the Notion database schema to ensure it matches the TweetData structure
// - Implement error handling for cases where Notion API calls fail
// - Ensure the Notion database schema supports storing response data
// - Implement a mechanism to link responses to their corresponding tweets in the Notion database
// - Implement error handling for cases where the tweet is not found in the database
// - Implement error handling for cases where the response is not found in the database
// - Implement a mechanism to handle concurrent updates to the same tweet
// - Implement rate limiting handling for Notion API requests
// - Develop a caching mechanism to reduce the number of API calls to Notion
// - Create a backup strategy for the data stored in Notion
// - Implement pagination for retrieving large datasets from Notion